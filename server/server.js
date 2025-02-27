const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDb = require("./dbconfig");
const UserRoutes = require("./routes/UserRoutes");
const WorkerRoutes = require("./routes/WorkerRoutes");
const RequestRoutes = require("./routes/RequestRoutes");
const AdminRoutes = require("./routes/AdminRoutes");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

const app = express();

//parse the data
app.use(express.json());

//use cors
app.use(cors({ origin: "*", credentials: true }));

//config dotenv
dotenv.config();

// connect database
ConnectDb();

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/workers", WorkerRoutes);
app.use("/api/v1/request", RequestRoutes);

// use with middleware
app.use("/api/v1/admin", AdminRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("server running on", PORT);
});
