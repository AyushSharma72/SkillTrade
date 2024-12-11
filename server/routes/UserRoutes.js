const express = require("express");
const formidable = require("express-formidable");
const {
  RegisterUser,
  UserLogin,
  GetUserInfo,
  UpdateUserInfo,
  GetUserImage,
  UserPassword,
} = require("../controllers/UserController");

const Isloggedin = require("../middleware/Isloggedin");
const router = express.Router();

router.post("/UserRegister", RegisterUser);

router.post("/UserLogin", UserLogin);

router.get("/userAuth", Isloggedin, (req, res) => {
  res.status(200).send({ success: true });
});

router.get("/Userinfo/:uid", GetUserInfo);

router.post("/UpdateUserInfo/:uid", formidable(), UpdateUserInfo);

router.get("/GetUserImage/:uid", GetUserImage);

router.post("/UserPassword/:uid", UserPassword);

module.exports = router;
