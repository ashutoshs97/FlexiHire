require("dotenv").config();
const mongoose = require("mongoose");

// ✅ Set strictQuery to avoid deprecation warning
mongoose.set("strictQuery", true);

const MongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true, // ✅ Ensure SSL is enabled
      retryWrites: true,
    });

    console.log("✅ Database Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ Database Connection Error:", err.message);
  }
};

module.exports = MongoConnect;
