const mongoose = require("mongoose");

const WorkerSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  MobileNo: {
    type: Number,
    required: true,
    unique: true,
  },
  ServiceType: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Pincode: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Workers", WorkerSchema);
