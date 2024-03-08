import { Request, Response } from "express";
import { IResponse } from "../interfaces/share/IResponse";
import { IAuthResponse, modelToDto } from "../interfaces/response/IAuthResponse";
import bcrypt from 'bcrypt';
import { IUser } from "../interfaces/models/IUser";
import { decodedTemporaryToken, generateAccessToken, generateTemporaryToken, } from "../utils/auth/token";
import { ApiResponse } from "../utils/share/response";
import { APIError } from "../utils/errors/APIError";
import { User } from "../models/user.model";
import { sendEmail } from "../utils/auth/sendMail";
import crypto from "crypto";
import moment from "moment";
export const userLogin = async (request: Request, response: Response<IResponse<IAuthResponse>>) => {
    const { username, password, email } = request.body;
    const findUser: IUser = await User.findOne({ username }) as IUser;

    if (!findUser || findUser.email !== email || !(await bcrypt.compare(password, findUser.password as string))) {
        throw new APIError(`The username or email, or password is incorrect`, 401);
    }
    generateAccessToken(findUser._id, findUser.username, response);

    return new ApiResponse<IAuthResponse>(modelToDto(findUser), "User login successfully").
        success(response);
}

export const userRegister = async (request: Request, response: Response<IResponse<IAuthResponse>>) => {
    request.body.password = await bcrypt.hash(request.body.password, 10);
    const createUser = new User(request.body); -
        await createUser
            .save()
            .then((responseData: IUser) => {
                generateAccessToken(createUser._id, createUser.username, response);
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

export const signOut = async (request: Request, response: Response<IResponse<null>>) => {
    if (!request.cookies.accessToken) throw new APIError("User is already signed out", 200);

    response.clearCookie('accessToken', { httpOnly: true, secure: true });
    return new ApiResponse<null>(null, "User signed out successfully").
        success(response);
}

export const forgotPassword = async (request: Request, response: Response<IResponse<null>>) => {
    const { email } = request.body;

    const user: IUser = await User.findOne({ email }) as IUser;

    if (!user) throw new APIError("Invalid User", 400)

    const resetCode: string = crypto.randomBytes(3).toString("hex");

    await sendEmail(
        {
            from: "youremail@gmail.com",
            to: email,
            subject: "Password Reset",
            text: resetCode,
        }
    );
    await User.updateOne(
        { email },
        {
            reset: {
                code: resetCode,
                time: moment(new Date())
                    .add(15, "minute")
                    .format("YYYY-MM-DD HH:mm:ss"),
            },
        }
    );
    return new ApiResponse<null>(null, "Please Check Your Mailbox").
        success(response);
}
export const resetCodeCheck = async (request: Request, response: Response<IResponse<null>>) => {
    const { email, password } = request.body;
    const userInfo = await User.findOne({ email }) as IUser

    if (!userInfo) throw new APIError("Invalid Code", 401);

    const dbTime = moment(userInfo.reset.time as string);
    const nowTime = moment(new Date());

    const timeDiff = dbTime.diff(nowTime, "minutes");

    console.log("Date diff : ", timeDiff);
    if (timeDiff <= 0 || userInfo.reset.code !== password) {
        throw new APIError("Invalid Code", 401);
    }
    generateTemporaryToken(userInfo._id, userInfo.email, response);

    return new ApiResponse<null>(null, "You Can Reset Your Password").
        success(response);
};

export const resetPassword = async (request: Request, response: Response<IResponse<null>>) => {
    const decodedToken = await decodedTemporaryToken(request.cookies.accessToken);
    request.body.password = await bcrypt.hash(request.body.password, 10);
    const result: IUser = await User.findByIdAndUpdate(
        { _id: decodedToken?._id },
        {
            reset: {
                code: null,
                time: null,
            },
            password: request.body.password,
        }
    ) as IUser;
    generateAccessToken(result._id, result.username, response)
    return new ApiResponse<null>(null, "Password Reset Successful").
        success(response);
}
