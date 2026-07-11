import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyToken = async (req, res, next) => {
  try {
   
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

      console.log(req.cookies+"1");
      console.log(req.headers.authorization+"2");

   
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing",
      });
    }

  
    const decoded = jwt.verify(token,  process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

   
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

   
    req.user = user;

   
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};

export { verifyToken };
// export default VerifyToken