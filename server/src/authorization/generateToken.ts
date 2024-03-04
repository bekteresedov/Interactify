import { config } from "dotenv";
import jwt, { Secret } from "jsonwebtoken"
config();

const accessSecret: Secret = process.env.ACCESS_TOKEN as Secret;
export const generateAccessToken = (userId: String, username: String): String => jwt.sign({ userId, username }, accessSecret, { expiresIn: "48h", algorithm: "HS512" });


