import { Request, Response } from "express";
import { IResponse } from "../interfaces/share/IResponse";
import { loginSchema, registerSchema } from '../schema/authSchema';
import { IAuthResponse, modelToDto } from "../interfaces/response/IAuthResponse";
import bcrypt from 'bcrypt';
import { User } from "../models/user.model";
import { IUser } from "../interfaces/models/IUser";
import { generateAccessToken, } from "../authorization/generateToken";
import nodemailer, { SendMailOptions } from 'nodemailer';
import Joi from "joi";
import { ShareResponse } from "../utils/share/response";
import { APIError } from "../utils/errors/APIError";
export const userLogin = async (request: Request, response: Response<IResponse<IAuthResponse>>) => {
    try {
        const { username, password, email } = request.body;
        const validation: Joi.ValidationResult = loginSchema.validate(request.body, { abortEarly: false });
        if (validation.error) {
            return response.status(400).json(
                {
                    success: false,
                    message: validation.error.details.map((err) => err.message)
                }
            );
        }
        const findUser: IUser = await User.findOne({ username }) as IUser;

        if (!findUser || findUser.email !== email || !(await bcrypt.compare(password, findUser.password as string))) {
            return response.status(401).json({ success: false, message: "The username, email, or password is incorrect" });
        }
        const accessToken: String = generateAccessToken(findUser._id, findUser.username);

        response.cookie("accessToken", accessToken, {
            expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return response.status(200).json({ success: true, message: "User login successfully" });
    } catch (error: any) {
        console.log(error);
        return response.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const userRegister = async (request: Request, response: Response<IResponse<IAuthResponse>>) => {
    // const validation: Joi.ValidationResult = registerSchema.validate(request.body, { abortEarly: false });
    // if (validation.error) {
    //     return response.status(400).json(
    //         {
    //             success: false,
    //             message: validation.error.details.map((err) => err.message)
    //         }
    //     );
    // }

    request.body.password = await bcrypt.hash(request.body.password, 10);
    const createUser = new User(request.body);
    await createUser
        .save()
        .then((responseData: IUser) => {
            const accessToken: String = generateAccessToken(createUser._id, createUser.username);
            response.cookie("accessToken", accessToken, {
                expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            return new ShareResponse<IAuthResponse>(modelToDto(responseData), "User created successfully").
                created(response);
        })
        .catch((error: any) => {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                const fieldName: string = Object.keys(error.keyValue)[0];
                throw new APIError(`${fieldName.split(".")[0]} value is already in use`, 400);
            }
            throw new APIError("User could not be registered!", 400);
        });

}



export const signOut = async (request: Request, response: Response<IResponse<void>>) => {
    try {
        const accessToken: String = request.cookies.accessToken;
        if (!accessToken) {
            return response.status(200).json({ success: true, message: "User is already signed out" });
        }
        response.clearCookie('accessToken', { httpOnly: true, secure: true });
        return response.status(200).json({ success: true, message: "User signed out successfully" });
    } catch (error: any) {
        console.error(error);
        return response.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const forgotPassword = async (request: Request, response: Response<IResponse<void>>) => {
    try {
        const { email } = request.body;

        const user: IUser = await User.findOne({ email }) as IUser;
        if (!user) {
            return response.status(404).json({
                success: false, message: 'This email is already in use.'
            });
        }

        const token = await bcrypt.hash(user.email as string, 10);

        const transporter: nodemailer.Transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            secure: false,
            auth: {
                user: "fa09aa5b2e7c56",
                pass: "6f492ac41a6339"
            }
        });


        const mailOptions: SendMailOptions = {
            from: 'info@mailtrap.ru',
            to: user.email as string,
            subject: 'Parola Sıfırlama Talebi',
            text: `Parolanızı sıfırlamak için aşağıdaki bağlantıyı tıklayın: http://example.com/reset-password/${token}`,
        };

        const info = await transporter.sendMail(mailOptions)
        console.log(info);
        return response.status(200).json({ success: true, message: "OK", })
    } catch (error: any) {
        console.error(error);
        return response.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const resetPassword = (request: Request, response: Response<IResponse<void>>) => {

}
