import { Server } from "socket.io";

let io;

const userSocketMap = {};


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

    
    const userId = socket.handshake.query.userId;

    
    if (userId) {
      userSocketMap[userId] = socket.id;
    }
     console.log("Connected User:", userId);
    console.log("Current Socket Map:", userSocketMap);

  
    io.emit("getOnlineUsers", Object.keys(userSocketMap));



socket.on("typing", ({ receiverId, senderName }) => {

  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("typing", {
      senderName,
    });
  }

});

    console.log("Online Users:", userSocketMap);

    socket.on("disconnect", () => {
      console.log(" User Disconnected:", socket.id);

   
      delete userSocketMap[userId];

     
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