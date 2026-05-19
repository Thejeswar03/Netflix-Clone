import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async(req, res, next) => {
  try {
    const token = req.cookies["jwt-netflix"]; //parses the cookie.
    if(!token){
      return res.status(401).json({success:false, Message:"Unauthorised - No token provided"});
    }

    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    //console.log("decoded token: ", decoded);
    if(!decoded){
      return res.status(401).json({success:false, Message:"Unauthorised - Invalid token"});
    }

    const user = await User.findById(decoded.userId).select("-password");
    //console.log("found the user, user: ", user);
    if(!user){
      return res.status(404).json({success:false, Message:"User not found"});
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: " + error.message);
    res.status(500).json({success:false, Message: "Internal server error"});
  }
};