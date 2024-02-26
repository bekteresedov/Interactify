import { IUser } from "../interfaces/models/IUser";

import mongoose, { Schema, Document } from 'mongoose';



const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    password: {
        type: String,
    },
    bio: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
    birth: {
        type: [String]
    }




},
    {
        timestamps: true,
        toJSON: { virtuals: true }
    });


export const User = mongoose.model<IUser & Document>("User", UserSchema);