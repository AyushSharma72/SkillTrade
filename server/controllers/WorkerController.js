const WorkerModal = require("../modals/WorkerModal");
const bcrypt = require("bcryptjs");
const UserModal = require("../modals/UserModal");

async function RegisterWorker(req, resp) {
  try {
    const { Name, MobileNo, ServiceType, Password, Address, pincode } =
      req.body;

    if (
      !Name ||
      !MobileNo ||
      !ServiceType ||
      !Password ||
      !Address ||
      !pincode
    ) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const WorkerMobileExists = await WorkerModal.findOne({ MobileNo });
    const userMobileExists = await UserModal.findOne({ MobileNo });
    if (WorkerMobileExists || userMobileExists) {
      return resp.status(409).send({
        success: false,
        message: "Mobile number already exists, please login",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newWorker = new WorkerModal({
      Name,
      MobileNo,
      ServiceType,
      Password: hashedPassword,
      Address,
      pincode,
    });
    await newWorker.save();

    resp.status(201).send({
      success: true,
      message: "Account created succesfully",
    });
  } catch (error) {
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

async function CheckCity(req, resp) {
  try {
    const { wid } = req.params;
    const city = await WorkerModal.find({ _id: wid }).select("city");

    if (city && city.length > 0) {
      return resp.status(200).send({
        success: true,
        message: "city exist",
      });
    } else {
      return resp.status(200).send({
        success: false,
        message: "city do not exist",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "internal server error ",
    });
  }
}

module.exports = { RegisterWorker, CheckCity };
