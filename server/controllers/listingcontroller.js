import Listing from "../models/listingSchmea.js"
import { errorhandler } from "../utils/error.js"
export const createListing=async(req,res,next)=>{
    try {
        const listing = await Listing.create(req.body);
        res.status(200).json(listing);
    } catch (error) {
         next(error)
    }
}

export const deleteListing =async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorhandler(404,'Listing not found!'));
    }
    if( req.user.id !== listing.userRef){
        return next(errorhandler(401,'You can only delete your own listings!'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing has been deleted")
    } catch (error) {
      next(error)  
    }
}