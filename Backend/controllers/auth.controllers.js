import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";


export async function signup(req, res) {
  try {
    const {email,password,username} = req.body;

    if(!email || !password || !username){
      return res.status(400).json({success:false, message:"All fields are required"})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
      return res.status(400).json({success:false, message:"Invalid Email"})
    }

    if(password.length < 6){
      return res.status(400).json({success:false, message:"password needs to be atleast 6 letters"})
    }

    const existingUserByEmail = await User.findOne({email:email});

    if(existingUserByEmail){
      return res.status(400).json({success:false, message:"Email already exists"})
    }

    const existingUserByUsername = await User.findOne({username:username});

    if(existingUserByUsername){
      return res.status(400).json({success:false, message:"Username already exists"})
    }

    const salt =await bcryptjs.genSalt(10); //faced an issue here!!
    //sol:- must use await because the gensalt error: Illegal arguments: string, object tries to 
    //explain that one of the arguments passed to the hash function below is invalid, since it's type is invalid.
    //In this case it's the second argument (salt) which expects a string/number 
    //but receives an object (the promise object that's returned if you don't await).

    //genSalt asynchronously calls a genSaltSync() that generates the salt. so to use the salt you need to await the genSalt function.
    
    const hashedPassword = await bcryptjs.hash(password, salt);//hashes the password for security purposes

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const Image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email:email,
      password:hashedPassword,
      username:username,
      Image:Image
    });

    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();
    res.status(201).json({success:true, user: {
      ...newUser._doc,
      password:"",//shows all fields of user and removes password from the response  
     },
    });

  } catch (error) {
    console.log("Error in singup controller", error.message);
    res.status(500).json({success:false, message:"Internal server error"});
  }
};

export async function login(req, res) {
  try {
    const {email, password} = req.body;

    if(!email || !password){
      res.status(400).json({successs:false, message:"All fields aare required"});
    }

    const user = await User.findOne({email})
    if(!user){
      res.status(404).json({success:false, message:"invalid credentials"});
    };

    const isPassword = await bcryptjs.compare(password, user.password)
    if(!isPassword){
      res.status(404).json({success:false, message:"Invalid password"});
    }
    
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      succes:true,
      user:{
      ...user._doc,
      password: "",
    }
  })

  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({success:false, message:"Internal server error"});
  };
};

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({success:true, message:"Logged out succesfully"});
  } catch (error) {
    console.log("error logging out", error.message);
    res.status(500).json({success:false, message:"internal server error"});
  }
};

export async function authCheck(req, res) {
  try {
    res.status(200).json({ success: true, user: req.user});
  } catch (error) {
    console.log("Error in authCheck controller");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};