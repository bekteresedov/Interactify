import { Document } from "mongoose";
interface IBirth {
    day: Number;
    month: Number;
    year: Number
}

interface IReset {
    code: String
    time: String
}

export interface IUser extends Document {
    username: String
    email: String
    name: String
    surname: String
    password: String
    bio: String
    birth: IBirth
    profilePhoto: String
    reset: IReset
}