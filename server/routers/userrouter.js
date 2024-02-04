import express from 'express';
import { UpdateUser, deleteUser, test } from '../controllers/usercontroller.js';
import { verifyToken} from '../utils/verfiyUser.js';
const router = express.Router();

router.get("/test",test)
router.post("/update/:id",verifyToken,UpdateUser);
router.delete("/delete/:id",verifyToken,deleteUser);

export default router