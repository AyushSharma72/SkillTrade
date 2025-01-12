const WorkerModal = require("../modals/WorkerModal");

async function VerifyWorker(req, resp) {
  try {
  } catch (error) {}
}

async function GetVerifyingRequest(req, resp) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const skip = (page - 1) * limit;

    const requests = await WorkerModal.find({ Verified: "Pending" })
      .skip(skip)
      .limit(limit);

    const totalRequests = await WorkerModal.countDocuments({
      Verified: "Pending",
    });

    if (requests && requests.length > 0) {
      return resp.status(200).send({
        success: true,
        requests,
        totalPages: Math.ceil(totalRequests / limit),
      });
    } else {
      return resp.status(404).send({
        success: false,
        message: "No request found",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function GetVerifyId(req, resp) {
  try {
    const request = await WorkerModal.findById(req.params.wid).select(
      "VerifyId"
    );
    console.log(request)
    if (!request || !request.VerifyId || !request.VerifyId.data) {
      return resp.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    resp.set("Content-Type", request.VerifyId.contentType);
    return resp.status(200).send(request.VerifyId.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    return resp.status(500).send({
      success: false,
      message: "Error fetching image",
      error,
    });
  }
}

module.exports = { VerifyWorker, GetVerifyingRequest, GetVerifyId };
