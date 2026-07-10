import express from "express";
import {
  createConversation,
  getUserConversations,
} from "../controllers/conversationControlller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createConversation);


router.get("/", verifyToken, getUserConversations);

export default router;