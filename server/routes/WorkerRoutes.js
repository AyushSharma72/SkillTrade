const express = require("express");
const {
  RegisterWorker,
  CheckCity,
  Report,
  AcceptRequest,
} = require("../controllers/WorkerController");

const router = express.Router();

router.post("/WorkerRegister", RegisterWorker);

router.get("/CheckCity/:wid", CheckCity);

router.post("/report/:wid/:rid", Report);

router.post("/AcceptRequest/:wid/:rid", AcceptRequest);

module.exports = router;
