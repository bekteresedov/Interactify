import { config } from "dotenv";
import jwt, { Secret } from "jsonwebtoken"
config();

const accessSecret: Secret = process.env.ACCESS_TOKEN as Secret;
const refreshSecret: Secret = process.env.REFRESH_TOKEN_SECRET as Secret;
export const generateAccessToken = (userId: String, username: String): String => jwt.sign({ userId, username }, accessSecret, { expiresIn: "40min", algorithm: "HS512" });


export const generateRefreshToken = (userId: String, username: String): String => jwt.sign({ userId, username }, refreshSecret, { expiresIn: "2m", algorithm: "HS512" });
