import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({userId}, ENV_VARS.JWT_SECRET, {expiresIn: '15d'});

  res.cookie("jwt-netflix", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,// 15 days in milli seconds
    httpOnly:true, //prevents xss attacks - Cross Site Scripting attacks
    sameSite:"strict", //CSRF attacks - Cross Site Request Forgery Attacks
    secure: ENV_VARS.NODE_ENV!=="development" // cookie will only be set in https in production
  });

  return token;
};

