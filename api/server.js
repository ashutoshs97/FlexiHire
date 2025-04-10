require("dotenv").config({ path: "./.env" }); // Explicit path to .env file
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet"); // ✅ Adds security headers
const rateLimit = require("express-rate-limit"); // ✅ Rate limiting
const mongoose = require("mongoose");

// Debugging: Verify environment variables are loaded
console.log("Environment Variables:", {
  PORT: process.env.PORT,
  MONGODB: process.env.MONGODB ? "******" : "NOT FOUND", // Masking the URI
  NODE_ENV: process.env.NODE_ENV
});

// Validate critical environment variables
if (!process.env.PORT || !process.env.MONGODB) {
  console.error("❌ FATAL: Missing required environment variables");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3001;

// ✅ Security Middleware
app.use(helmet());

// ✅ Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});
app.use(limiter);

// Enhanced CORS Configuration
app.use(cors({
  origin: [
    "https://flexihire.vercel.app",
    "http://localhost:3000" // For local development
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body Parser Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Database Connection with Error Handling
const MongoConnection = require("./config/database");
(async () => {
  try {
    await MongoConnection();

    // Only start server after DB connection
    app.listen(port, () => {
      console.log(`✅ Server running on Port: ${port}`);
      console.log(`🛰️  Connected to MongoDB Atlas`);
    });

  } catch (error) {
    console.error("❌ FATAL: Failed to connect to MongoDB", error.message);
    process.exit(1); // Exit if DB connection fails
  }
})();

// Routes
app.use("/user", require("./routes/UserRoutes"));
app.use("/freelancer", require("./routes/FreelancerRoutes"));
app.use("/client", require("./routes/ClientRoutes"));
app.use("/chat", require("./routes/ChatRoutes"));

// Static Files with proper path resolution
app.use("/ProfilePic", express.static(path.join(__dirname, "uploads", "Users_imgs")));
app.use("/ServicePic", express.static(path.join(__dirname, "uploads", "UsersServices")));

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date()
  });
});

// Default Route
app.get("/", (req, res) => {
  res.send(`
    <h1>FlexiHire Backend</h1>
    <p>Status: <span style="color:green">Running</span></p>
    <p>Database: ${mongoose.connection.readyState === 1 ? "🟢 Connected" : "🔴 Disconnected"}</p>
  `);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Handle Uncaught Exceptions and Unhandled Promise Rejections
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});