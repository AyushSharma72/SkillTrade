const express = require("express");
const {
  RegisterWorker,
  CheckCity,
  Report,
  AcceptRequest,
  GetWorkerData,
} = require("../controllers/WorkerController");

const router = express.Router();

router.post("/WorkerRegister", RegisterWorker);

router.get("/CheckCity/:wid", CheckCity);

router.post("/report/:wid/:rid", Report);

router.post("/AcceptRequest/:wid/:rid", AcceptRequest);

router.get("/GetWorkerData/:wid", GetWorkerData);

module.exports = router;
