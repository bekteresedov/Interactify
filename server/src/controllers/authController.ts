import { Request, Response } from "express";
import { IResponse } from "../interfaces/share/IResponse";
import { loginSchema, registerSchema } from "../schema/authSchema";
import { IAuthResponse, modelToDto } from "../interfaces/response/IAuthResponse";
import bcrypt from 'bcrypt';
import { User } from "../models/User";
// export const userLogin = (request: Request, response: Response<IResponse<any>>) => {
//     try {
//         const validation = loginSchema.validate(request.body, { abortEarly: false });
//         if (validation.error) {
//             return response.status(400).json(
//                 {
//                     success: false,
//                     message: validation.error.details.map((err) => err.message)
//                 }
//             );
//         }
//     } catch (error: any) {

//     }

// }

export const userRegister = async (request: Request, response: Response<IResponse<IAuthResponse>>) => {
    try {
        const validation = registerSchema.validate(request.body, { abortEarly: false });
        if (validation.error) {
            return response.status(400).json(
                {
                    success: false,
                    message: validation.error.details.map((err) => err.message)
                }
            );
        }
        console.log(request.body);

        const passwordHash: string = await bcrypt.hash(request.body.password, 10);

        const data: IAuthResponse = modelToDto(await User.create({ ...request.body, password: passwordHash }));
        return response.status(201).json(
            {
                success: false,
                message: "User created successfully",
                content: data
            }
        );;
    } catch (error: any) {
        console.log(error);
        if (error.name === 'MongoServerError' && error.code === 11000) {
            const fieldName: string = Object.keys(error.keyValue)[0];
            let errorMessage = `${fieldName.split(".")[0]} value is already in use`;
            return response.status(400).json({ success: false, message: errorMessage });
        }
        return response.status(500).json({ success: false, message: "Internal Server Error" })
    }

}