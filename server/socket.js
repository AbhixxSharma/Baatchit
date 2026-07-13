import { Server } from "socket.io";

let io;

const userSocketMap = {};

// Helper Function
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    // Get userId from frontend
    const userId = socket.handshake.query.userId;

    // Save userId -> socketId
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // Broadcast online users to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    console.log("Online Users:", userSocketMap);

    socket.on("disconnect", () => {
      console.log(" User Disconnected:", socket.id);

      // Remove disconnected user
      delete userSocketMap[userId];

      // Broadcast updated online users
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      console.log("Online Users:", userSocketMap);
    });
  });
};

export {
  initializeSocket,
  io,
  userSocketMap,
  getReceiverSocketId,
};