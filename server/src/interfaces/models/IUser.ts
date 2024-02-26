import { Document } from "mongoose";
export interface IUser extends Document {
    username: string
    email: string
    name: string
    surname: string
    password: string
    bio: string
    birth: string[]
    profilePhoto: string

}