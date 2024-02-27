import mongoose, { Document } from "mongoose";
import { IRefreshToken } from "../interfaces/models/IRefreshToken";
import { Schema } from "mongoose";

const RefreshTokenSchema: Schema = new Schema({
    token: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});




export const RefreshToken = mongoose.model<IRefreshToken & Document>("RefreshToken", RefreshTokenSchema);



