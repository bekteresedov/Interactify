import { Request, Response } from "express";
import { IResponse } from "../interfaces/share/IResponse";
import { loginSchema, registerSchema } from '../schema/authSchema';
import { IAuthResponse, modelToDto } from "../interfaces/response/IAuthResponse";
import bcrypt from 'bcrypt';
import { User } from "../models/User";
import { IUser } from "../interfaces/models/IUser";
import { generateAccessToken, } from "../authorization/generateToken";
export const userLogin = async (request: Request, response: Response<IResponse<IAuthResponse>>) => {
    try {
        const { username, password, email } = request.body;
        const validation = loginSchema.validate(request.body, { abortEarly: false });
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
    try {
        const validation = registerSchema.validate(request.body, { abortEarly: false });
        if (validation.error) {
            return response.status(400).json(
                {
                    success: false,
                    message: validation.error.details.map((err) => err.message)
                }
            );
        }

        const passwordHash: string = await bcrypt.hash(request.body.password, 10);

        const createUser: IUser = await User.create({ ...request.body, password: passwordHash });

        const accessToken: String = generateAccessToken(createUser._id, createUser.username);
        response.cookie("accessToken", accessToken, {
            expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        return response.status(201).json(
            {
                success: false,
                message: "User created successfully",
                content: modelToDto(createUser)
            }
        );;
    } catch (error: any) {
        console.log(error);
        if (error.name === 'MongoServerError' && error.code === 11000) {
            const fieldName: string = Object.keys(error.keyValue)[0];
            let errorMessage = `${fieldName.split(".")[0]} value is already in use`;
            return response.status(400).json({ success: false, message: errorMessage });
        }
        return response.status(500).json({ success: false, message: "Internal Server Error" })
    }

}


export const signOutUser = async (request: Request, response: Response<IResponse<void>>) => {
    try {
        const accessToken = request.cookies.accessToken;

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
