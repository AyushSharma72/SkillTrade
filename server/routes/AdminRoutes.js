const express = require("express");
const {
  VerifyWorker,
  GetVerifyingRequest,
  GetVerifyId,
  rejectVerificationRequest,
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

module.exports = router;
