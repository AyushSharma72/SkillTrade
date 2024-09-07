const express = require("express");
const { RegisterWorker } = require("../controllers/WorkerController");

const router = express.Router();

router.post("/WorkerRegister", RegisterWorker);

module.exports = router;
