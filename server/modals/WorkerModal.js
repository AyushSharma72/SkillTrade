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
  pincode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
  },
  role: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Workers", WorkerSchema);
