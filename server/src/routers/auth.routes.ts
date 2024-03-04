import express, { Router } from 'express';
import { forgotPassword, signOut, userLogin, userRegister } from '../controllers/auth.controller';

const authRouter: Router = express.Router();
const basePath: string = "/auth";

authRouter.post(`/register`, userRegister);
authRouter.post(`/login`, userLogin);
authRouter.post(`/signout`, signOut);
authRouter.post(`/forgot-password`, forgotPassword);

export default authRouter;