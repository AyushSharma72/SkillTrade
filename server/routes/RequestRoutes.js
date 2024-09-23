const express = require("express");
const {
  CreateRequest,
  GetUserRequest,
  GetSingleUserRequest,
  GetRequestPhotoController,
  EditRequestController,
} = require("../controllers/RequestController");
const formidable = require("express-formidable");

const router = express.Router();

router.post("/CreateRequest", formidable(), CreateRequest);

router.get("/GetUserRequest/:id/:page", GetUserRequest);

router.get("/GetSingleUserRequest/:rid", GetSingleUserRequest);

router.get("/GetRequestPhotoController/:rid", GetRequestPhotoController);

router.post("/EditRequest/:rid", formidable(), EditRequestController);

module.exports = router;
