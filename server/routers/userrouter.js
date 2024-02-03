import express from 'express';
import { UpdateUser, test } from '../controllers/usercontroller.js';
import { verifyToken} from '../utils/verfiyUser.js';
const router = express.Router();

router.get("/test",test)
router.post("/update/:id",verifyToken,UpdateUser)

export default router