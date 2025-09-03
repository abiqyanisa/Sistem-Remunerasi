import express from 'express';
import { authentication, restrictToRole } from '../controllers/auth.controller.js';
import { getAllUser, addUser, updateUser, deleteUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.route('/')
    .post(authentication, restrictToRole('admin'), addUser)
    .get(authentication, restrictToRole('admin'), getAllUser)
    .put(authentication, restrictToRole('admin'), updateUser)
    .delete(authentication, restrictToRole('admin'), deleteUser)

export { userRouter }