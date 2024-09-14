const mongoose = require("mongoose");

async function ConnectDb() {
  try {
    // const DatabaseConnect = process.env.DatabaseConnect;
    await mongoose.connect(
      "mongodb+srv://asharma7588:Ayush1234@cluster0.8ysl0ky.mongodb.net/SkillTrade"
    );
    console.log("connected to database");
  } catch (error) {
    console.log("error :", error);
  }
}

module.exports = ConnectDb;
