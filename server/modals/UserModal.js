const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  MobileNo: {
    type: Number,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Users", UserSchema);
