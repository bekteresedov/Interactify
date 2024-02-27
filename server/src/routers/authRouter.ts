import express, { Router } from 'express';
import { userLogin, userRegister } from '../controllers/authController';

const authRouter: Router = express.Router();
const basePath: string = "/auth";

authRouter.post(`${basePath}/register`, userRegister);
authRouter.post(`${basePath}/login`, userLogin);

export default authRouter;