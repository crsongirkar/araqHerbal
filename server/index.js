require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");
const cmsRoutes = require("./routes/cms");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Global Middlewares
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount Routes under /api
app.use("/api", authRoutes);
app.use("/api", cmsRoutes);
app.use("/api", uploadRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 ARAQ Server running on http://localhost:${PORT}`);
});
// Nodemon trigger comment
