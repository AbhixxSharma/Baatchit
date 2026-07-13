import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { initializeSocket } from "./socket.js";

dotenv.config({
  path: "./.env",
});

const server = http.createServer(app);
initializeSocket(server);
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });