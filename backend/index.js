import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { startCronJobs } from "./jobs/cornJobs.js";
import weatherRoute from "./Routes/weatherRoute.js";
import lstmRoute from "./Routes/lstmRoute.js"
import ndviRoutes from "./Routes/ndviRoutes.js";
import pestRoutes from "./Routes/pestRoutes.js";
import sensorRoutes from "./Routes/sensorRoutes.js";

import connectDB from "./config/db.js";

// routes (adjust paths if needed)
// import weatherRoutes from "./routes/weatherRoutes.js";
// import ndviRoutes from "./routes/ndviRoutes.js";

dotenv.config();

// connect database
connectDB();
startCronJobs()

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/weather", weatherRoute);
app.use("/api/lstm", lstmRoute);
app.use("/api/ndvi", ndviRoutes);
app.use("/api/pest", pestRoutes);
app.use("/api/sensor", sensorRoutes);

// health check (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// error handler (basic)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Server Error" });
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});