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
    Email: {
      type: String,
      required: true,
      unique: true,
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
      verified: {
        type: String,
        // enum: ["Pending", "Verified", "Unverified", "Rejected"],
        default: "Unverified",
      },
      rejectedReason: {
        type: String,
      },
      rejectionDate: {
        type: Date,
      },
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
