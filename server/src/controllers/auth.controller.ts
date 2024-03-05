import { Request, Response } from "express";
import { IResponse } from "../interfaces/share/IResponse";
import { IAuthResponse, modelToDto } from "../interfaces/response/IAuthResponse";
import bcrypt from 'bcrypt';
import { IUser } from "../interfaces/models/IUser";
import { generateAccessToken, } from "../authorization/generateToken";
import nodemailer, { SendMailOptions } from 'nodemailer';
import { ApiResponse } from "../utils/share/response";
import { APIError } from "../utils/errors/APIError";
import { User } from "../models/user.model";
export const userLogin = async (request: Request, response: Response<IResponse<IAuthResponse>>) => {
    const { username, password, email } = request.body;
    const findUser: IUser = await User.findOne({ username }) as IUser;

    if (!findUser || findUser.email !== email || !(await bcrypt.compare(password, findUser.password as string))) {
        throw new APIError(`The username or email, or password is incorrect`, 401);
    }
    const accessToken: String = generateAccessToken(findUser._id, findUser.username);

    response.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    return new ApiResponse<IAuthResponse>(modelToDto(findUser), "User login successfully").
        success(response);
}

export const userRegister = async (request: Request, response: Response<IResponse<IAuthResponse>>) => {
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
            return new ApiResponse<IAuthResponse>(modelToDto(responseData), "User created successfully").
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
            service: "gmail",
            auth: {
                user: "Good",
                pass: "ffwezlgyuhzhkfgz",
            },
        })


        const mailOptions: SendMailOptions = {
            from: 'pubg347bekter@gmail.com',
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
