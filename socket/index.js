const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config(); // To load environment variables from .env file

// Set up express and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://flexihire.vercel.app", // Updated with your production frontend URL
  },
});

// User management
let users = [];

// Add user to the users array
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

// Remove user from the users array
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// Get user by userId
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Add user to the list when they join
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users); // Broadcast updated users list to all clients
  });

  // Handle sending messages
  socket.on("sendMessage", ({ senderId, receiverId, text, chatId }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", {
        senderId,
        text,
        chatId,
      });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users); // Broadcast updated users list to all clients
  });
});

// Define a basic route for testing the server
app.get("/", (req, res) => {
  res.send("Socket.IO server running!");
});

// Start the server
const PORT = process.env.PORT || 8900; // Use the port from environment variables
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
