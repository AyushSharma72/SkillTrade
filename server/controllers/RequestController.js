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
      .select("-image")
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
        message: "No requests found",
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
    const requestdetails = await RequestModal.findById({ _id: rid })
      .select("-image")
      .populate({
        path: "user",
        select: "Name",
      });

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

    const totalrequests = await RequestModal.find();
    const requests = await RequestModal.find()
      .select("-image")
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
        message: "no request found",
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

module.exports = {
  CreateRequest,
  GetUserRequest,
  GetSingleUserRequest,
  GetRequestPhotoController,
  EditRequestController,
  GetAllRequests,
  FilterRequests,
};
