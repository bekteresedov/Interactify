import { Request, Response } from "express";
import { IResponse } from "../interfaces/share/IResponse";
import { loginSchema } from "../schema/authSchema";

export const userLogin = (request: Request, response: Response<IResponse<any>>) => {
    try {
        const validation = loginSchema.validate(request.body, { abortEarly: false });
        if (validation.error) {
            return response.status(400).json(
                {
                    success: false,
                    message: validation.error.details.map((err) => err.message)
                }
            );
        }
    } catch (error: any) {

    }

}