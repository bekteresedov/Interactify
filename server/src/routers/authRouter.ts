import express, { Router } from 'express';
import { userRegister } from '../controllers/authController';

const authRouter: Router = express.Router();
const basePath: string = "/auth";

authRouter.post(`${basePath}/register`, userRegister);
export default authRouter;