import User from "../models/userSchmea.js"
import bcrypt from "bcrypt";
export const signup =async(req,res)=>{
const {username,email,password} = req.body;
const hashPassword = bcrypt.hashSync(password,10);
const newuser = new User({username,email,password:hashPassword});
 try {
    await newuser.save()
    res.status(201).json("USer Created successfully")
 } catch (error) {
   res.status(400).json(error.message) 
 }
 
}