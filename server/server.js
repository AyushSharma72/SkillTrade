const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDb = require("./dbconfig");
const UserRoutes = require("./routes/UserRoutes");
const app = express();

//parse the data
app.use(express.json());

//use cors
app.use(cors());

//config dotenv
dotenv.config();

// connect database
ConnectDb();

app.use("/api/v1/users", UserRoutes);
 
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("server running on", PORT);
});
