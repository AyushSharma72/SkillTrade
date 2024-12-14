const express = require("express");
const {
  RegisterWorker,
  CheckCity,
} = require("../controllers/WorkerController");

const router = express.Router();

router.post("/WorkerRegister", RegisterWorker);
router.get("/CheckCity/:wid", CheckCity);

module.exports = router;
