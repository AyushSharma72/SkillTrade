const WorkerModal = require("../modals/WorkerModal");
const bcrypt = require("bcryptjs");
const UserModal = require("../modals/UserModal");
const ReportModal = require("../modals/ReportModal");
const RequestModal = require("../modals/RequestModal");

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
        status: "Accepted",
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

module.exports = { RegisterWorker, CheckCity, Report, AcceptRequest };
