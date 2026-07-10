import express from "express"
import { getMessage,sendMessages } from "../controllers/messageController.js"
import { verifyToken } from "../middleware/authMiddleware.js";

const router= express.Router();
router.get("/:conversationId", verifyToken, getMessage);
router.post("/", verifyToken, sendMessages);

export default router;