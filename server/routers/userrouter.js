import express from 'express';
import { UpdateUser, UserList, UserListings, deleteUser, test } from '../controllers/usercontroller.js';
import { verifyToken} from '../utils/verfiyUser.js';
const router = express.Router();

router.get("/test",test)
router.post("/update/:id",verifyToken,UpdateUser);
router.delete("/delete/:id",verifyToken,deleteUser);
router.get("/listings/:id",verifyToken,UserListings)
router.get("/:id",verifyToken,UserList)

export default router