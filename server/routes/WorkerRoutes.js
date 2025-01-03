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
  GetWorkerAcceptedRequest,
  GetWorkerAssignedRequest,
} = require("../controllers/WorkerController");

const router = express.Router();

router.post("/WorkerRegister", RegisterWorker);

router.get("/CheckCity/:wid", CheckCity);

router.post("/report/:wid/:rid", Report);

router.post("/AcceptRequest/:wid/:rid", AcceptRequest);

router.get("/GetWorkerData/:wid", GetWorkerData);

router.post("/UpdateProfile/:wid", formidable(), UpdateProfile);

router.get("/GetWorkerImage/:wid", GetWorkerImage);

router.get("/GetWorkerAcceptedRequest/:wid", GetWorkerAcceptedRequest);

router.get("/GetWorkerAssignedRequest/:wid", GetWorkerAssignedRequest);

module.exports = router;
