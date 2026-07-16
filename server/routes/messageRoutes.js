import express from "express"
import { getMessage,sendMessages } from "../controllers/messageController.js"
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.middleware.js"

const router= express.Router();

router.post(
  "/",
  verifyToken ,
  upload.single("media"),
  sendMessages
);
router.get("/:conversationId", verifyToken, getMessage);
// router.post("/", verifyToken, sendMessages);

export default router;