const WorkerModal = require("../modals/WorkerModal");
const bcrypt = require("bcryptjs");
const UserModal = require("../modals/UserModal");
const ReportModal = require("../modals/ReportModal");
const RequestModal = require("../modals/RequestModal");
const fs = require("fs").promises;

async function RegisterWorker(req, resp) {
  try {
    const { Name, MobileNo, ServiceType, Password, Address, pincode } =
      req.body;

    if (
      !Name ||
      !MobileNo ||
      !ServiceType ||
      !Password ||
      !Address ||
      !pincode
    ) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const WorkerMobileExists = await WorkerModal.findOne({ MobileNo });
    const userMobileExists = await UserModal.findOne({ MobileNo });
    if (WorkerMobileExists || userMobileExists) {
      return resp.status(409).send({
        success: false,
        message: "Mobile number already exists, please login",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newWorker = new WorkerModal({
      Name,
      MobileNo,
      ServiceType,
      Password: hashedPassword,
      Address,
      pincode,
    });
    await newWorker.save();

    resp.status(201).send({
      success: true,
      message: "Account created succesfully",
    });
  } catch (error) {
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

async function CheckCity(req, resp) {
  try {
    const { wid } = req.params;
    const city = await WorkerModal.find({ _id: wid }).select("city");

    if (city && city.length > 0) {
      return resp.status(200).send({
        success: true,
        message: "city exist",
      });
    } else {
      return resp.status(200).send({
        success: false,
        message: "city do not exist",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "internal server error ",
    });
  }
}
async function Report(req, resp) {
  try {
    const { wid, rid } = req.params;
    const { IssueType, description } = req.body;

    if (!IssueType && !description) {
      return resp.status(400).send({
        success: false,
        message: "Provide at least one field",
      });
    }

    const existingReport = await ReportModal.findOne({
      worker: wid,
      requestId: rid,
    });
    if (existingReport) {
      return resp.status(400).send({
        success: false,
        message: "You have already reported this request",
      });
    }

    const report = await ReportModal({
      IssueType: IssueType,
      Description: description,
      worker: wid,
      requestId: rid,
    }).save();

    if (report) {
      return resp.status(200).send({
        success: true,
        report,
        message: "Request reported",
      });
    }
  } catch (error) {
    console.error(error);
    return resp.status(500).send({
      message: "Internal server error",
    });
  }
}

async function AcceptRequest(req, resp) {
  try {
    const { wid, rid } = req.params;
    const { EstimatedPrice, description, date } = req.body;

    if (!wid || !rid) {
      return resp.status(400).send({
        success: false,
        message: "Worker ID or Request ID is missing.",
      });
    }
    if (!EstimatedPrice) {
      return resp.status(400).send({
        success: false,
        message: "Estimated price is missing.",
      });
    }

    const existingAcceptance = await RequestModal.findOne({
      _id: rid,
      "acceptedBy.worker": wid,
    });

    if (existingAcceptance) {
      return resp.status(400).send({
        success: false,
        message: "You have already accepted this request.",
      });
    }
    const existingrequest = await RequestModal.findOne({ _id: rid });
    const updatedRequest = await RequestModal.findByIdAndUpdate(
      rid,
      {
        $push: {
          acceptedBy: {
            worker: wid,
            estimatedPrice: EstimatedPrice,
            priceJustification: description,
            acceptedAt: date,
          },
        },
        status:
          existingrequest.status == "Pending"
            ? "Accepted"
            : existingrequest.status,
      },
      { new: true }
    );

    if (!updatedRequest) {
      return resp.status(404).send({
        success: false,
        message: "Request not found.",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "You accepted the request successfully.",
      request: updatedRequest,
    });
  } catch (error) {
    console.error(error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  }
}

async function GetWorkerData(req, resp) {
  try {
    const { wid } = req.params;
    const worker = await WorkerModal.findOne({ _id: wid })
      .select("-Password -image -VerifyId")
      .populate({
        path: "Reviews.user",
        select: "Name",
      });
    if (worker) {
      resp.status(200).send({
        success: true,
        worker,
      });
    } else {
      resp.status(404).send({
        success: true,
        message: "worker not found",
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

async function UpdateProfile(req, resp) {
  const { wid } = req.params;

  const worker = await WorkerModal.findById(wid);
  if (!worker) {
    return resp.status(404).send({
      success: false,
      message: "worker not found",
    });
  }

  const { fields, files } = req;

  const updatedData = {
    Name: fields.Name || worker.Name,
    MobileNo: fields.MobileNo || worker.MobileNo,
    ServiceType: fields.ServiceType || worker.ServiceType,
    Address: fields.address || worker.Address,
    pincode: fields.pincode || worker.pincode,
    city: fields.city || worker.city,
  };

  const updatedWorker = await WorkerModal.findByIdAndUpdate(wid, updatedData, {
    new: true,
  });

  const image = files.image;
  const vimage = files.vimage;
  if (image) {
    try {
      updatedWorker.image = {
        data: await fs.readFile(image.filepath || image.path),
        contentType: image.mimetype || image.type,
      };
    } catch (error) {
      return resp.status(400).send({
        success: false,
        message: "Image processing failed",
      });
    }
  } else {
    console.log("No image exists");
  }
  if (vimage) {
    try {
      updatedWorker.VerifyId = {
        data: await fs.readFile(vimage.filepath || vimage.path),
        contentType: vimage.mimetype || vimage.type,
      };
    } catch (error) {
      return resp.status(400).send({
        success: false,
        message: "verification image processing failed",
      });
    }
  } else {
    console.log("No verification image exists");
  }

  await updatedWorker.save();

  return resp.status(200).send({
    success: true,
    message: "Worker updated successfully",
  });
}

async function GetWorkerImage(req, resp) {
  try {
    const worker = await WorkerModal.findById(req.params.wid).select("image");

    if (!worker || !worker.image || !worker.image.data) {
      return resp.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    resp.set("Content-Type", worker.image.contentType);
    return resp.status(200).send(worker.image.data);
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Error fetching image",
    });
  }
}

async function GetWorkerAcceptedRequest(req, resp) {
  try {
    const { wid } = req.params;
    const { pagenumber } = req.query;

    if (!wid) {
      return resp.status(400).json({ message: "Worker ID is required" });
    }

    const page = parseInt(pagenumber, 10) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalRequests = await RequestModal.countDocuments({
      acceptedBy: { $elemMatch: { worker: wid } },
    });

    const response = await RequestModal.find({
      acceptedBy: { $elemMatch: { worker: wid } },
    })
      .select("-image")
      .skip(skip)
      .limit(limit);

    if (response.length === 0) {
      return resp
        .status(404)
        .json({ message: "No requests found for this worker" });
    }

    return resp.status(200).json({
      success: true,
      data: response,
      totalPages: Math.ceil(totalRequests / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    return resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

const GetWorkerAssignedRequest = async (req, resp) => {
  try {
    const { wid } = req.params;
    const page = parseInt(req.query.pagenumber) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    if (!wid) {
      return resp
        .status(400)
        .json({ success: false, error: "Worker ID is required" });
    }

    const totalRequests = await RequestModal.countDocuments({
      assignedTo: wid,
    });

    const requests = await RequestModal.find({
      assignedTo: wid,
      status: "Assigned",
    })
      .skip(skip)
      .limit(limit)
      .select("-image")
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalRequests / limit);

    return resp.status(200).json({
      success: true,
      data: requests,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching assigned requests:", error);
    return resp
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
module.exports = {
  RegisterWorker,
  CheckCity,
  Report,
  AcceptRequest,
  GetWorkerData,
  UpdateProfile,
  GetWorkerImage,
  GetWorkerAcceptedRequest,
  GetWorkerAssignedRequest,
};
