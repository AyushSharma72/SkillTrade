const express = require("express");
const { RegisterUser, UserLogin } = require("../controllers/UserController");
const Isloggedin = require("../middleware/Isloggedin");
const router = express.Router();

router.post("/UserRegister", RegisterUser);
router.post("/UserLogin", UserLogin);

router.get("/userAuth", Isloggedin, (req, res) => {
  res.status(200).send({ success: true });
});

module.exports = router;
