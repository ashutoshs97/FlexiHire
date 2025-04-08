require("dotenv").config();
const mongoose = require("mongoose");

const MongoConnect = () => {
  // mongoose.connect(process.env.MONGODB);
  mongoose.connect("mongodb+srv://ashutoshs97:admin123@cluster0.xhipuoo.mongodb.net/FlexDB?retryWrites=true&w=majority&appName=Cluster0");
  const db = mongoose.connection;
  db.on("error", (err) => {
    console.log("Database Connection Error: " + err.message);
  });
  db.once("connected", () => {
    console.log("Database Connected");
  });
};

module.exports = MongoConnect;
