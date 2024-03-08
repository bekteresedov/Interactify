import { config } from "dotenv";
import { Response } from "express";
import jwt, { Secret, JwtPayload, VerifyErrors } from "jsonwebtoken"
import { APIError } from "../errors/APIError";
import { User } from "../../models/user.model";
import { IUser } from "../../interfaces/models/IUser";
config();



export const generateAccessToken = (userId: string, username: String, response: Response): void => {
    const accessSecret: Secret = process.env.ACCESS_TOKEN as Secret;
    const expiresIn: string = process.env.ACCESS_EXPIRESIN as string;
    const accessToken: string = jwt.sign({ userId, username }, accessSecret, { expiresIn, algorithm: "HS512" })
    const oneMonthInMilliseconds: number = 30 * 24 * 60 * 60 * 1000;
    response.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + oneMonthInMilliseconds),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
};

export const generateTemporaryToken = (userId: string, email: String, response: Response): void => {
    const token = jwt.sign({
        sub: userId,
        email
    }, process.env.TEMPORARY_TOKEN as string, {
        algorithm: "HS512",
        expiresIn: process.env.TEMPORARY_EXPIRESIN
    })

    const fiveHoursInMilliseconds: number = 5 * 60 * 60 * 1000;
    response.cookie("accessToken", token, {
        expires: new Date(Date.now() + fiveHoursInMilliseconds),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
}

export const decodedTemporaryToken = async (temporaryToken: string): Promise<IUser | undefined> => {
    // const token: string = temporaryToken.split(" ")[1]
    const token: string = temporaryToken;


    let userInfo;
    await jwt.verify(token, process.env.TEMPORARY_TOKEN as string, async (err: any, decoded: any) => {
        if (err) throw new APIError("Invalid Token", 401)

        userInfo = await User.findById(decoded.sub);
        if (!userInfo) throw new APIError("Invalid Token", 401)

    })

    return userInfo
}