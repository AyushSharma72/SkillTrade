const express = require("express");
const {
  VerifyWorker,
  GetVerifyingRequest,
  GetVerifyId,
} = require("../controllers/AdminController");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");

router.post("/verify_worker", isAdmin, VerifyWorker);

router.post("/get_verifying_requests", isAdmin, GetVerifyingRequest);

router.get("/get_veriify_id/:wid", GetVerifyId);

module.exports = router;
