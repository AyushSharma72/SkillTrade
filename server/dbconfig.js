const mongoose = require("mongoose");

async function ConnectDb() {
  try {
    await mongoose.connect(process.env.DatabaseConnect);
    console.log("connected to database");
  } catch (error) {
    console.log("error :", error);
  }
}

module.exports = ConnectDb;
