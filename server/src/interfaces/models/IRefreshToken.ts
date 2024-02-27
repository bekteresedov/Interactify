import { Types } from "mongoose";
import { IUser } from "./IUser";

export interface IRefreshToken extends Document {
    token: String;
    user: Types.ObjectId | IUser;
}