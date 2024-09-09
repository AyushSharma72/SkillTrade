const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const WorkerModal = require("../modals/WorkerModal");
const UserModal = require("../modals/UserModal");

async function RegisterUser(req, resp) {
  try {
    const { Name, MobileNo, Email, Password, Address } = req.body;

    if (!Name || !MobileNo || !Email || !Password || !Address) {
      return resp.status(400).send({
        success: false,
        error: "All fields are required",
      });
    }
    const userEmailExists = await UserModal.findOne({ Email });
    const userMobileExists = await UserModal.findOne({ MobileNo });
    const WorkerMobileExists = await WorkerModal.findOne({ MobileNo });

    if (userEmailExists) {
      return resp.status(409).send({
        success: false,
        message: "User already exists, please login",
      });
    }
    if (userMobileExists || WorkerMobileExists) {
      return resp.status(409).send({
        success: false,
        message: "Mobile number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newuser = new UserModal({
      Name,
      MobileNo,
      Email,
      Password: hashedPassword,
      Address,
    });
    await newuser.save();

    resp.status(201).send({
      success: true,
      message: "Account created succesfully",
    });
  } catch (error) {
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

async function UserLogin(req, resp) {
  try {
    const { MobileNo, Password } = req.body;
    if (!MobileNo || !Password) {
      return resp.status(404).send({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await UserModal.findOne({ MobileNo }).select("-Password");
    const worker = await WorkerModal.findOne({ MobileNo }).select("-Password");

    if (!user && !worker) {
      return resp.status(401).send({
        success: false,
        message: "No such user found",
      });
    }
    let hashedPassword;
    if (user) {
      hashedPassword = await UserModal.findOne({ MobileNo }).select("Password");
    } else {
      hashedPassword = await WorkerModal.findOne({ MobileNo }).select(
        "Password"
      );
    }
    const matchpassword = await bcrypt.compare(
      Password,
      hashedPassword.Password
    );

    if (!matchpassword) {
      return resp.status(210).send({
        success: false,
        message: "Invalid number or password",
      });
    }
    let token;

    if (user) {
      token = JWT.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      return resp.status(200).send({
        success: true,
        message: "login successfull",
        token,
        user,
      });
    } else {
      token = JWT.sign({ _id: worker._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      return resp.status(200).send({
        success: true,
        message: "login successfull",
        token,
        worker,
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "server error",
    });
  }
}

module.exports = { RegisterUser, UserLogin };
