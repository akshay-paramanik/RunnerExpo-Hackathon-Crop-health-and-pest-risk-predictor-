import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// routes (adjust paths if needed)
// import weatherRoutes from "./routes/weatherRoutes.js";
// import ndviRoutes from "./routes/ndviRoutes.js";

dotenv.config();

// connect database
connectDB();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
// app.use("/api/weather", weatherRoutes);
// app.use("/api/ndvi", ndviRoutes);

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