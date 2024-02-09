import express from 'express';
import { createListing, deleteListing } from '../controllers/listingcontroller.js';
import { verifyToken } from '../utils/verfiyUser.js';
const router = express.Router();

router.post("/create",verifyToken,createListing);
router.delete("/delete/:id",verifyToken,deleteListing)


export default router;