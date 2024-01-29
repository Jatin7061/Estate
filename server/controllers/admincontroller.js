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
    res.cookie("accestoken",token,{httpOnly: true}).status(200).json(rest);
   } catch (error) {
      next(error)
   }

}