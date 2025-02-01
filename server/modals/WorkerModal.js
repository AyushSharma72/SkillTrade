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
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
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
        unAssignedBy: {
          type: Number, // user, worker
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
      verified: {
        type: String,
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

// Create a geospatial index on coordinates for efficient location-based queries
WorkerSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Workers", WorkerSchema);
