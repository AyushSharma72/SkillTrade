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
  image: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Users", UserSchema);
