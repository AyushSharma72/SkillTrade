const express = require("express");
const { RegisterUser } = require("../controllers/UserController");
const router = express.Router();

router.post("/UserRegister", RegisterUser);

module.exports = router;
  