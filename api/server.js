require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;

const MongoConnection = require("./config/database");

// ✅ CORS Configuration (Allow frontend to connect)
app.use(cors({
  origin: "https://flexihire.vercel.app", // ✅ Your frontend Vercel domain
  credentials: true
}));

// ✅ Body Parser for JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ Connect MongoDB
MongoConnection();

// ✅ Routes
app.use("/user", require("./routes/UserRoutes"));
app.use("/freelancer", require("./routes/FreelancerRoutes"));
app.use("/client", require("./routes/ClientRoutes"));
app.use("/chat", require("./routes/ChatRoutes"));

// ✅ Static Files
app.use("/ProfilePic", express.static(__dirname + "/uploads/Users_imgs"));
app.use("/ServicePic", express.static(__dirname + "/uploads/UsersServices"));

// ✅ Default Route for Testing (optional)
app.get("/", (req, res) => {
  res.send("FlexiHire backend running ✅");
});

// ✅ Server Start
app.listen(port, (err) => {
  if (err) {
    console.error("❌ Server Error:", err.message);
  } else {
    console.log("✅ Server running on Port:", port);
  }
});
