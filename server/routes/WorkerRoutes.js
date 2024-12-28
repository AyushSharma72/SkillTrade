const express = require("express");
const formidable = require("express-formidable");
const {
  RegisterWorker,
  CheckCity,
  Report,
  AcceptRequest,
  GetWorkerData,
  UpdateProfile,
  GetWorkerImage,
} = require("../controllers/WorkerController");

const router = express.Router();

router.post("/WorkerRegister", RegisterWorker);

router.get("/CheckCity/:wid", CheckCity);

router.post("/report/:wid/:rid", Report);

router.post("/AcceptRequest/:wid/:rid", AcceptRequest);

router.get("/GetWorkerData/:wid", GetWorkerData);

router.post("/UpdateProfile/:wid", formidable(), UpdateProfile);

router.get("/GetWorkerImage/:wid", GetWorkerImage);

module.exports = router;
