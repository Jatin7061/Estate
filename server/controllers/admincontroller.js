import User from "../models/userSchmea.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorhandler } from "../utils/error.js";

export const signup =async(req,res,next)=>{
const {username,email,password} = req.body;
const hashPassword = bcrypt.hashSync(password,10);
const newuser = new User({username,email,password:hashPassword});
 try {
    await newuser.save()
    res.status(201).json("User Created successfully")
 } catch (error) {
  next(error);
 }
 
}


export const signin =async(req,res,next)=>{
   const {email,password} = req.body;
   try {
    const validUser = await User.findOne({email});
    if(!validUser){
      return next(errorhandler('404','Invalid Cerenditals'))
    }  
    const validPassword = bcrypt.compareSync(password,validUser.password);
    if(!validPassword){
      return next(errorhandler('404','Invalid Cerenditals'));
    }
    const token = jwt.sign({id: validUser._id},process.env.JWT_SECRET);
    const {password:pass,...rest}=validUser._doc;
    res.cookie("access_token",token,{httpOnly: true}).status(200).json(rest);
   } catch (error) {
      next(error)
   }

}

export const google =async(req,res,next)=>{
  try {
   const user = await User.findOne({email: req.body.email});
   if(user){
   const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
   const {password:pass,...rest}=user._doc;
   res.cookie("access_token",token,{httpOnly: true}).status(200).json(rest);
   }
   else{
   const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
   const hashedPassword = bcrypt.hashSync(generatePassword,10);
   const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email: req.body.email,password: hashedPassword,avatar: req.body.photo})
   await newUser.save();
   const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET);
   const {password:pass,...rest}=newUser._doc;
   res.cookie("access_token",token,{httpOnly: true}).status(200).json(rest);
   

   }
  } catch (error) {
   next(error)
  }
}

export const signout = (req,res,next)=>{
  try {
    res.clearCookie("access_token")
    res.status(200).json("User Logout Successfully")
  } catch (error) {
    next(error)
  }

}