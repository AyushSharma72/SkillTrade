const WorkerModal = require("../modals/WorkerModal");
const bcrypt = require("bcryptjs");
const UserModal = require("../modals/UserModal");

async function RegisterWorker(req, resp) {
  try {
    const { Name, MobileNo, ServiceType, Password, Address, Pincode } =
      req.body;

    if (!Name || !MobileNo || !ServiceType || !Password || !Address) {
      return resp.status(400).send({
        success: false,
        error: "All fields are required",
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
      Pincode,
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

module.exports = { RegisterWorker };
