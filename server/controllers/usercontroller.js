import User from "../models/userSchmea.js";
import Listing from "../models/listingSchmea.js"
import { errorhandler } from "../utils/error.js"
import bcrypt from "bcrypt";

export const test =(req,res)=>{
   console.log("Hello World")
}

export const UpdateUser = async (req, res, next) => {
  
  if(req.user.id !== req.params.id)
     return next(errorhandler(401, 'You can only update your own account!'));
  
   try {
      if(req.body.password){
     req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
     
     
     const updatedUser = await User.findByIdAndUpdate(
       req.params.id,
       {
         $set: {
           username: req.body.username,
           email: req.body.email,
           password: req.body.password,
           avatar: req.body.avatar,
         },
       },
       { new: true },
     );
 
     const { password, ...rest } = updatedUser._doc;
    
     res.status(200).json(rest);
     
   } catch (error) {
     next(error);
   }

 };

 export const deleteUser =async(req,res,next)=>{
   if(req.user.id !== req.params.id){
    return next(errorhandler(401,"Update your own account"));
   }
   try{
   await User.findByIdAndDelete(req.params.id);
   res.clearCookie('access_token');
   res.status(200).json("User Deleted Successfully");
   }
   catch(error){
    next(error)
   }

 }
 export const UserListings = async(req,res,next)=>{
  if(req.user.id === req.params.id){
    try {
     const listings = await Listing.find({ userRef: req.params.id})
     res.status(200).json(listings);
    } catch (error) {
     next(error) 
    }
  }
  else{
    return next(errorhandler(401, 'You can see only your own listings!'));
  }
 }

 export const UserList =async(req,res,next)=>{
  try {
   const user = await User.findById(req.params.id);
   if(!user){
    return next(errorhandler(404,"User not found"))
   }
   const {password: pass,...rest} = user._doc;
   res.status(200).json(rest) 
  } catch (error) {
    next(error)
  }
 }
