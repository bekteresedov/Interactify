import { config } from "dotenv";
import jwt, { Secret } from "jsonwebtoken"
config();

const accessSecret: Secret = process.env.ACCESS_TOKEN as Secret;
const refreshSecret: Secret = process.env.REFRESH_TOKEN_SECRET as Secret;
export const generateAccessToken = (userId: String, username: String): String => {
    let data = jwt.sign({ userId, username }, accessSecret, { expiresIn: "15min", algorithm: "HS512" });
    return data
}

export const generateRefreshToken = (userId: String, username: String): String => {
    let data = jwt.sign({ userId, username }, refreshSecret, { expiresIn: "15d", algorithm: "HS512" });
    return data
}