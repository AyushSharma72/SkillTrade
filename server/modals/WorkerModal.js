const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WorkerSchema = mongoose.Schema(
  {
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
    image: {
      data: Buffer,
      contentType: String,
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
    gender: {
      type: String,
    },
    UnAssignedRequest: [
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
    CompletedRequest: {
      type: Number,
      default: 0,
    },
    OverallRaitngs: {
      type: Number,
      default: 0,
    },
    Reviews: [
      {
        stars: {
          type: Number,
        },
        comment: {
          type: String,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "Users",
        },
        date: {
          type: Date,
        },
      },
    ],
    TotalStars: {
      type: Number,
    },
    Verified: {
      type: Boolean,
      default: false,
    },
    VerifyId: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workers", WorkerSchema);
