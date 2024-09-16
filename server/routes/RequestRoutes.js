const express = require("express");
const {
  CreateRequest,
  GetUserRequest,
} = require("../controllers/RequestController");
const formidable = require("express-formidable");

const router = express.Router();

router.post("/CreateRequest", formidable(), CreateRequest);

router.get("/GetUserRequest/:id/:page", GetUserRequest);

module.exports = router;
