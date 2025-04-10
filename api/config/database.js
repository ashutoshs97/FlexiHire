require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");

// Optional: Useful in dev to catch query mistakes
mongoose.set("strictQuery", false);

// Optional: Logs queries in development mode
mongoose.set("debug", process.env.NODE_ENV === "development");

const MongoConnect = async (retries = 3, delay = 5000) => {
  try {
    const mongoURI = process.env.MONGODB; // Fetch MongoDB connection string from environment variables

    if (!mongoURI) {
      throw new Error("❌ MONGODB is not defined in environment variables");
    }

    console.log("🔄 Connecting to MongoDB Atlas...");

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true, // Enable TLS for secure connections
      retryWrites: true,
      w: "majority", // Write concern: ensures data is written to a majority of nodes
      authSource: "admin", // Helps with some cluster permissions
      serverSelectionTimeoutMS: 10000, // Timeout for server selection
      socketTimeoutMS: 45000, // Timeout for socket operations
      heartbeatFrequencyMS: 10000, // Frequency of heartbeat checks
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections in the pool
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connection established");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

  } catch (err) {
    console.error(`❌ Connection failed (${retries} retries left): ${err.message}`);

    if (retries > 0) {
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return MongoConnect(retries - 1, delay); // Retry connection
    }

    console.error("💥 FATAL: Could not connect to MongoDB after multiple attempts");
    process.exit(1); // Exit the process if all retries fail
  }
};

module.exports = MongoConnect;