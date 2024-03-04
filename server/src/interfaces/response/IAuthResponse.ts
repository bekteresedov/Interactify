import { IUser } from "../models/IUser";

export interface IAuthResponse {
    _id: String;
    username: String;
    profilePhoto: String
}

export function modelToDto(model: IUser): IAuthResponse {
    return { _id: model._id, username: model.username, profilePhoto: model.profilePhoto }
}