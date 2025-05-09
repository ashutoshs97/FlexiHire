require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

// Set Mongoose strictQuery mode
mongoose.set("strictQuery", true);

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Import DB connection
const MongoConnection = require("./config/database");

// Import Routes
const userRoutes = require("./routes/UserRoutes");
const freelancerRoutes = require("./routes/FreelancerRoutes");
const clientRoutes = require("./routes/ClientRoutes");
const chatRoutes = require("./routes/ChatRoutes");

// === Middleware ===

// Parse application/json
app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Enable CORS
app.use(cors());
// Serve static files
app.use("/ProfilePic", express.static(path.join(__dirname, "/uploads/Users_imgs")));
app.use("/ServicePic", express.static(path.join(__dirname, "/uploads/UsersServices")));

// === Connect to MongoDB ===
MongoConnection();

// === Route Handlers ===
app.use("/user", userRoutes);
app.use("/freelancer", freelancerRoutes);
app.use("/client", clientRoutes);
app.use("/chat", chatRoutes);

// === Error Handling Middleware (Optional but recommended) ===
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// === Start Server ===
app.listen(port, () => {
  console.log(`✅ Flexihire Server is Running on http://localhost:${port}`);
});

// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

// const app = express();
// const cors = require("cors");
// const port = process.env.PORT || 3001;

// const MongoConnection = require("./config/database");
// const userRoutes = require("./routes/UserRoutes");
// const freelancerRoutes = require("./routes/FreelancerRoutes");
// const clientRoutes = require("./routes/ClientRoutes");
// const chatRoutes = require("./routes/ChatRoutes");
// const bodyParser = require("body-parser");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

// MongoConnection();

// app.use("/user", userRoutes);
// app.use("/freelancer", freelancerRoutes);
// app.use("/client", clientRoutes);
// app.use("/chat", chatRoutes);

// app.use("/ProfilePic", express.static(__dirname + "/uploads/Users_imgs"));
// app.use("/ServicePic", express.static(__dirname + "/uploads/UsersServices"));

// app.listen(port, (err) => {
//   if (err) console.log("Server Error :" + err.message);
//   else console.log("Server Runnig on Port: " + port);
// });