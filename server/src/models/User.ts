import { IUser, } from '../interfaces/models/IUser';

import mongoose, { Schema, Document } from 'mongoose';



const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
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
        type: {
            day: Number,
            month: Number,
            year: Number
        }
    }




},
    {
        timestamps: true,
        toJSON: { virtuals: true }
    });


export const User = mongoose.model<IUser & Document>("User", UserSchema);