import express from "express";
import { registerUser,loginUser ,getAllUsers} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router= express.Router();
router.get("/users",verifyToken,getAllUsers)
router.post("/register", registerUser);
router.post("/login", loginUser);
export default router;