require("dotenv").config();
const mongoose = require("mongoose");

// Configure mongoose settings
mongoose.set("strictQuery", false); // More flexible for future versions
mongoose.set("debug", process.env.NODE_ENV === "development"); // Enable query logging in dev

<<<<<<< HEAD
// Enhanced connection function with retry logic
const MongoConnect = async (retries = 3, delay = 5000) => {
  try {
    // Validate environment variable
    if (!process.env.MONGODB) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    // Secure connection options
    const options = {
=======
const MongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
>>>>>>> parent of f9a05d6 (v5_hosting_fixes)
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true, // Prefer 'tls' over 'ssl' for newer MongoDB drivers
      retryWrites: true,
<<<<<<< HEAD
      w: "majority",
      authSource: "admin", // Critical for Atlas authentication
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2
    };

    console.log("🔄 Attempting MongoDB connection...");
    
    await mongoose.connect(process.env.MONGODB, options);
=======
    });
>>>>>>> parent of f9a05d6 (v5_hosting_fixes)

    // Connection event listeners
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connection established");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    console.log("✅ Successfully connected to MongoDB Atlas");

  } catch (err) {
<<<<<<< HEAD
    console.error(`❌ Connection attempt failed (${retries} retries left):`, err.message);
    
    if (retries > 0) {
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      await new Promise(res => setTimeout(res, delay));
      return MongoConnect(retries - 1, delay);
    }

    console.error("💥 FATAL: Could not connect to MongoDB after multiple attempts");
    process.exit(1);
=======
    console.error("❌ Database Connection Error:", err.message);
>>>>>>> parent of f9a05d6 (v5_hosting_fixes)
  }
};

module.exports = MongoConnect;
