require("dotenv").config();
const mongoose = require("mongoose");

// ✅ Set strictQuery to avoid deprecation warning
mongoose.set("strictQuery", true);

// ✅ Function to connect to MongoDB Atlas
const MongoConnect = async () => {
  try {
    // Define connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true, // ✅ Ensure SSL is enabled
      retryWrites: true,
      serverSelectionTimeoutMS: 5000, // ✅ Timeout after 5 seconds
    };

    // Attempt to connect to MongoDB
    await mongoose.connect(process.env.MONGODB, options);

    console.log("✅ Database Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
    process.exit(1); // ✅ Exit the application on connection failure
  }
};

module.exports = MongoConnect;