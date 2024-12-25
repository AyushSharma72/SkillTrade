const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
  assignedRequest: [
    {
      request: {
        type: Schema.Types.ObjectId,
        ref: "Requests",
      },
      unassignReason: {
        type: String,
        default: null,
      },
      unassignesAt: {
        type: Date,
        default: null,
      },
    },
  ],
});

module.exports = mongoose.model("Workers", WorkerSchema);
