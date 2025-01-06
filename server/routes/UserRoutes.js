const express = require("express");
const formidable = require("express-formidable");
const {
  RegisterUser,
  UserLogin,
  GetUserInfo,
  UpdateUserInfo,
  GetUserImage,
  UserPassword,
  SendOtp,
  VerifyOtp,
  ResetPassword,
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

router.post("/SendOtp", SendOtp);

router.post("/VerifyOtp", VerifyOtp);

router.post("/Resetpassword", ResetPassword);

module.exports = router;
