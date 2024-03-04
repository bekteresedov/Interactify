import express, { Router } from 'express';
import { forgotPassword, signOut, userLogin, userRegister } from '../controllers/auth.controller';
import { AuthValidation } from '../middlewares/validations/auth.validation';

const authRouter: Router = express.Router();

authRouter.post(`/register`, AuthValidation.register, userRegister);
authRouter.post(`/login`, AuthValidation.login, userLogin);
authRouter.post(`/signout`, signOut);
authRouter.post(`/forgot-password`, forgotPassword);

export default authRouter;