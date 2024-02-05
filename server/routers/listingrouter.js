import express from 'express';
import { createListing } from '../controllers/listingcontroller.js';
import { verifyToken } from '../utils/verfiyUser.js';
const router = express.Router();

router.post("/create",verifyToken,createListing);


export default router;