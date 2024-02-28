import express, { Router } from 'express';
import { signOutUser, userLogin, userRegister } from '../controllers/authController';

const authRouter: Router = express.Router();
const basePath: string = "/auth";

authRouter.post(`${basePath}/register`, userRegister);
authRouter.post(`${basePath}/login`, userLogin);
authRouter.post(`${basePath}/signout`, signOutUser);
export default authRouter;