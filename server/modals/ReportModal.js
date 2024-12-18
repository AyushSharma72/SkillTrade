const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReportSchema = mongoose.Schema(
  {
    worker: {
      type: Schema.Types.ObjectId,
      ref: "Workers",
      required: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "Requests",
      required: true,
    },
    IssueType: {
      type: String,
    },
    Description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reports", ReportSchema);
