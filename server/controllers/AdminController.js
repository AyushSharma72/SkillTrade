const WorkerModal = require("../modals/WorkerModal");

async function GetVerifyingRequest(req, resp) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const skip = (page - 1) * limit;

    const requests = await WorkerModal.find({ "Verified.verified": "Pending" })
      .skip(skip)
      .limit(limit);

    const totalRequests = await WorkerModal.countDocuments({
      "Verified.verified": "Pending",
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

async function rejectVerificationRequest(req, resp) {
  try {
    const { wid } = req.params;
    const { reason } = req.body;
    const worker = await WorkerModal.findById(wid);
    if (!worker) {
      return resp.status(404).send({
        message: "worker not found",
        success: false,
      });
    }
    worker.Verified.verified = "Rejected";
    worker.Verified.rejectedReason = reason;
    worker.Verified.rejectionDate = new Date();
    await worker.save();
    resp.status(200).send({
      message: "request rejected",
      success: true,
    });
  } catch (error) {
    resp.status(500).send({
      message: "internal server error",
      success: false,
    });
  }
}

async function VerifyWorker(req, resp) {
  try {
    const { wid } = req.params;
    const worker = await WorkerModal.findById(wid);
    if (!worker) {
      return resp.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }

    worker.Verified.verified = "Verified";
    worker.save();

    return resp.status(200).send({
      success: true,
      message: "Worker verifed",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "intenral server error",
    });
  }
}

module.exports = {
  VerifyWorker,
  GetVerifyingRequest,
  GetVerifyId,
  rejectVerificationRequest,
};
