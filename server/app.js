import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"
import conversationRoute from "./routes/conversationRoutes.js"
import dotenv from "dotenv";

dotenv.config();

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
// Ye hai phele Api call
app.use("/api/v1/auth", authRoutes);
// conversation route hai 
app.use("/api/v1/conversations", conversationRoute);
// ye message route hai
app.use("/api/v1/messages",messageRoutes)
export { app }