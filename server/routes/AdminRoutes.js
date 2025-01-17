const express = require("express");
const {
  VerifyWorker,
  GetVerifyingRequest,
  GetVerifyId,
  rejectVerificationRequest,
  GetReport,
  DeleteRequest,
  InformUser,
  ApproveRequest,
  RejectReviewRequest,
} = require("../controllers/AdminController");

const router = express.Router();
const isAdmin = require("../middleware/isAdmin");

router.post("/verify_worker/:wid", isAdmin, VerifyWorker);

router.post("/get_verifying_requests", isAdmin, GetVerifyingRequest);

router.get("/get_veriify_id/:wid", GetVerifyId);

router.post(
  "/reject_verification_request/:wid",
  isAdmin,
  rejectVerificationRequest
);

router.post("/view_reports", GetReport);

router.delete("/delete_request/:rid",DeleteRequest);

router.post("/inform_user/:rid", InformUser);

router.delete("/approve_review/:rid", ApproveRequest);

router.post("/reject_review/:rid", RejectReviewRequest);

module.exports = router;
