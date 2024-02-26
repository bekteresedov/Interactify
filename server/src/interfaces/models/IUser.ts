import { Document } from "mongoose";
export interface IUser extends Document {
    username: String
    email: String
    name: String
    surname: String
    password: String
    bio: String
    birth: String[]
    profilePhoto: String

}