const express = require("express");
const { CreateRequest } = require("../controllers/RequestController");
const formidable = require("express-formidable");

const router = express.Router();

router.post("/CreateRequest", formidable(), CreateRequest);

module.exports = router;
