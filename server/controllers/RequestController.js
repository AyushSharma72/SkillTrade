const RequestModal = require("../modals/RequestModal");
const WorkerModal = require("../modals/WorkerModal");
const fs = require("fs").promises;

async function CreateRequest(req, resp) {
  try {
    const {
      user,
      service,
      description,
      time,
      date,
      location,
      coordinates,
      pincode,
      city,
    } = req.fields;

    // Check if required fields are present
    if (
      !user ||
      !service ||
      !description ||
      !time ||
      !date ||
      !location ||
      !pincode ||
      !city
    ) {
      return resp.status(400).send({
        success: false,
        message: "All required fields must be provided",
      });
    }

    let geoCoordinates;

    // Check if coordinates are provided and valid
    if (coordinates) {
      const { latitude, longitude } = JSON.parse(coordinates);

      // Only set geoCoordinates if both latitude and longitude are valid numbers
      if (latitude && longitude) {
        geoCoordinates = [longitude, latitude];
      }
    }

    // Build request data
    const requestData = {
      user,
      service,
      description,
      time,
      date,
      location,
      pincode,
      city,
    };

    // If geoCoordinates is defined, add it to the request data
    if (geoCoordinates) {
      requestData.coordinates = {
        type: "Point",
        coordinates: geoCoordinates,
      };
    }

    // Save the request
    const request = await new RequestModal(requestData).save();

    // Handle image upload
    if (req.files && req.files.image) {
      request.image.data = await fs.readFile(req.files.image.path);
      request.image.contentType = req.files.image.type;
      await fs.unlink(req.files.image.path);
      await request.save(); // Save the image
    }

    return resp.status(201).send({
      success: true,
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return resp.status(500).send({
      success: false,
      message: "Error creating request",
    });
  }
}

async function GetUserRequest(req, resp) {
  try {
    const { id, page } = req.params;

    const totalRequests = await RequestModal.countDocuments({ user: id });

    // Fetch the requests for the current page
    const requests = await RequestModal.find({ user: id })
      .select("service location date status user")
      .limit(5)
      .skip((page - 1) * 5)
      .sort({ createdAt: -1 }); 

    if (requests && requests.length) {
      return resp.status(200).send({
        success: true,
        totalRequests,
        requests,
      });
    } else {
      return resp.status(404).send({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in API",
    });
  }
}

async function GetSingleUserRequest(req, resp) {
  try {
    const { rid } = req.params;
    const requestdetails = await RequestModal.findById(rid)
      .select("-image") // Exclude the "image" field
      .populate("user", "Name") // Populate the "user" field with the "Name" field only
      .populate("assignedTo", "Name"); // Populate the "assignedTo" field with the "Name" field only

    if (requestdetails) {
      return resp.status(200).send({
        success: true,
        requestdetails,
      });
    } else {
      return resp.status(400).send({
        success: false,
        message: "No request found",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "No request found",
    });
  }
}

async function GetRequestPhotoController(req, resp) {
  try {
    const request = await RequestModal.findById(req.params.rid).select("image");

    if (!request || !request.image || !request.image.data) {
      return resp.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    resp.set("Content-Type", request.image.contentType);
    return resp.status(200).send(request.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    return resp.status(500).send({
      success: false,
      message: "Error fetching image",
      error,
    });
  }
}

async function EditRequestController(req, resp) {
  try {
    const { date, time, address, pincode } = req.fields;
    const { rid } = req.params;
    const request = await RequestModal.findById(rid);
    if (request) {
      const updatedRequest = await RequestModal.findByIdAndUpdate(
        rid,
        {
          date: date || request.date,
          time: time || request.time,
          location: address || request.location,
          pincode: pincode || request.pincode,
        },
        { new: true }
      );
      await updatedRequest.save();

      return resp.status(200).send({
        success: true,
        message: "request updated",
      });
    } else {
      return resp.status(404).send({
        success: false,
        message: "request not found ",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(400).send({
      success: false,
      message: "Error in Updation",
    });
  }
}

async function GetAllRequests(req, resp) {
  try {
    const pagenumber = req.params.pagenumber;

    const totalrequests = await RequestModal.countDocuments({
      status: { $in: ["Accepted", "Assigned"] },
    });
    const requests = await RequestModal.find({
      status: { $in: ["Accepted", "Assigned"] },
    })
      .select("service location date status user")
      .skip((pagenumber - 1) * 5)
      .limit(5);

    if (requests && requests.length >= 1) {
      return resp.status(200).send({
        totalrequests,
        requests,
        success: true,
        message: "all request fetched",
      });
    } else {
      return resp.status(200).send({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "internal server error",
    });
    {
    }
  }
}

async function FilterRequests(req, resp) {
  try {
    const { wid } = req.params;
    const { nearBy, yourCity, ServiceType } = req.query;

    const worker = await WorkerModal.findById(wid).select("pincode city");
    // console.log(worker);
    if (!worker) {
      return resp.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }
    let query = {};

    // Add dynamic filtering based on query parameters
    if (nearBy === "true" && worker.pincode) {
      query.pincode = worker.pincode;
    }
    if (ServiceType) {
      query.service = ServiceType;
    }
    if (yourCity === "true" && worker.city) {
      query.city = worker.city;
    }
    // console.log(worker.city);
    const requests = await RequestModal.find(query).select("-image");

    if (requests.length > 0) {
      return resp.status(200).send({
        success: true,
        requests,
        message: "All requests fetched",
      });
    } else {
      return resp.status(200).send({
        success: true,
        message: "No requests found",
      });
    }
  } catch (error) {
    console.error("Error in FilterRequests:", error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function UpdateRequestPhoto(req, resp) {
  try {
    const requestId = req.params.rid;
    const request = await RequestModal.findById(requestId);

    if (!request) {
      return resp.status(404).json({ message: "Request not found" });
    }
    if (req.files && req.files.image) {
      request.image.data = await fs.readFile(req.files.image.path);
      request.image.contentType = req.files.image.type;
      await fs.unlink(req.files.image.path);
      await request.save();
      return resp
        .status(200)
        .json({ message: "Photo updated successfully", request });
    } else {
      return resp.status(400).json({ message: "No image file provided" });
    }
  } catch (error) {
    console.log(error);
    console.error("Error updating request photo:", error);
    return resp.status(500).json({ message: "Internal server error" });
  }
}

async function GetWhoAcceptedRequest(req, resp) {
  try {
    const { rid, page } = req.params;
    const requests = await RequestModal.find(
      {
        _id: rid,
        status: { $in: ["Accepted", "Assigned", "Completed"] },
      },
      "acceptedBy"
    )
      .populate("acceptedBy.worker", "Name")
      .populate("assignedTo", "_id")
      .populate("status")
      .limit(5)
      .skip((page - 1) * 5);

    if (!requests || requests.length === 0) {
      return resp.status(404).json({
        success: false,
        message: "No accepted or confirmed requests found for this request.",
      });
    }
    return resp
      .status(200)
      .send({ success: true, requests, total: requests.length });
  } catch (error) {
    console.error("Error fetching accepted or confirmed requests:", error);
    return resp
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function DeleteRequest(req, resp) {
  try {
    const { rid } = req.params;
    const response = await RequestModal.deleteOne({ _id: rid });
    if (response.deletedCount > 0) {
      resp.status(200).send({
        success: true,
        message: "Request deleted",
      });
    } else {
      resp.status(400).send({
        success: false,
        message: "Request not found ",
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

async function AssignRequest(req, resp) {
  try {
    const { wid, rid } = req.params;
    const { date } = req.body;

    if (!wid || !rid) {
      return resp.status(400).send({
        success: false,
        message: "Worker ID and Request ID are required",
      });
    }

    const request = await RequestModal.findById(rid);

    if (!request) {
      return resp.status(404).send({
        success: false,
        message: "Request not found",
      });
    }

    request.assignedTo = wid;
    request.confirmedAt = date;
    request.status = "Assigned";

    await request.save();

    return resp.status(200).send({
      success: true,
      message: "Request assigned successfully",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function UnassignRequest(req, resp) {
  try {
    const { reason, date } = req.body;
    const { rid, wid } = req.params;

    // Validate inputs
    if (!reason || !date) {
      return resp.status(400).send({
        message: "Reason and date are required for unassigning the request",
        success: false,
      });
    }

    // Find request and worker
    const request = await RequestModal.findOne({ _id: rid });
    const worker = await WorkerModal.findOne({ _id: wid });

    if (!request || !worker) {
      return resp.status(404).send({
        message: "Either request or worker not found",
        success: false,
      });
    }

    request.confirmedAt = null;
    request.assignedTo = null;
    request.status = "Accepted";

    worker.UnAssignedRequest.push({
      request: rid,
      unassignReason: reason,
      unassignesAt: new Date(),
    });

    await request.save();
    await worker.save();

    return resp.status(200).send({
      message: "Unassigned successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in UnassignRequest:", error);
    return resp.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
}

async function RequestCompleted(req, resp) {
  try {
    const { rid, wid, uid } = req.params;
    const { stars, comment, price } = req.body;
    if (!rid || !wid || !uid) {
      return resp.status(400).send({
        success: false,
        message: "request id or worker id is missing",
      });
    }
    if (!stars || !comment || !price) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    const request = await RequestModal.findById(rid);
    if (!request) {
      return resp.status(404).send({
        success: false,
        message: "request not found",
      });
    }
    if (request.status === "Completed") {
      return resp.status(400).send({
        success: false,
        message: "request was already completed",
      });
    }
    const worker = await WorkerModal.findById(wid);
    if (!worker) {
      return resp
        .status(404)
        .send({ success: false, message: "Worker not found" });
    }

    request.status = "Completed";
    request.actualPrice = price;
    request.completedAt = new Date();
    await request.save();

    worker.TotalStars = worker.TotalStars || 0; // Ensure TotalStars is initialized
    worker.TotalStars += stars;
    worker.OverallRaitngs = worker.TotalStars / (worker.Reviews.length + 1);
    worker.Reviews.push({
      stars: stars,
      comment: comment,
      user: uid,
      date: new Date(),
    });
    worker.CompletedRequest += 1;

    await worker.save();

    resp.status(200).send({
      success: true,
      message: "Request was completed",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

module.exports = {
  CreateRequest,
  GetUserRequest,
  GetSingleUserRequest,
  GetRequestPhotoController,
  EditRequestController,
  GetAllRequests,
  FilterRequests,
  UpdateRequestPhoto,
  GetWhoAcceptedRequest,
  DeleteRequest,
  AssignRequest,
  UnassignRequest,
  RequestCompleted,
};
