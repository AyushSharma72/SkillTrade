const RequestModal = require("../modals/RequestModal");
const fs = require("fs").promises;

async function CreateRequest(req, resp) {
  try {
    const { user, service, description, time, date, location, coordinates } =
      req.fields;

    if (
      !user ||
      !service ||
      !description ||
      !time ||
      !date ||
      !location ||
      !coordinates
    ) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const { latitude, longitude } = JSON.parse(coordinates);
    const geoCoordinates = [longitude, latitude];

    const request = await new RequestModal({
      user,
      service,
      description,
      time,
      date,
      location,
      coordinates: {
        type: "Point",
        coordinates: geoCoordinates,
      },
    }).save();

    if (req.files && req.files.image) {
      request.image.data = await fs.readFile(req.files.image.path);
      request.image.contentType = req.files.image.type;
      await fs.unlink(req.files.image.path);
      request.save();
    }

    return resp.status(201).send({
      success: true,
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    console.error(error);
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
      .skip((page-1) * 5)
      .sort({ createdAt: -1 });
 
    if (requests && requests.length) { 
      return resp.status(200).send({
        success: true,
        totalRequests,
        requests,
      });
    } else {
      return resp.status(400).send({
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

module.exports = { CreateRequest, GetUserRequest };
