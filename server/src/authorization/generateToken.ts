import { config } from "dotenv";
import jwt, { Secret } from "jsonwebtoken"
config();

const accessSecret: Secret = process.env.ACCESS_TOKEN as Secret;
const expiresIn: string = process.env.EXPIRESIN as string;
export const generateAccessToken = (userId: String, username: String): String => jwt.sign({ userId, username }, accessSecret, { expiresIn, algorithm: "HS512" });


