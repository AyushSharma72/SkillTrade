const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"], // GeoJSON type must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // Array of numbers for [longitude, latitude]
        required: true,
      },
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
RequestSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Requests", RequestSchema);
