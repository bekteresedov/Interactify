import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../../schema/authSchema";
import { APIError } from "../../utils/errors/APIError";

export class AuthValidation {
    constructor() { }
    public static register = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await registerSchema.validateAsync(request.body)
        } catch (error: any) {
            if (error.details && error?.details[0].message)
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Please Follow the Validation Rules", 400)
        }
        next();
    }
    public static login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await loginSchema.validateAsync(request.body)
        } catch (error: any) {
            if (error.details && error?.details[0].message)
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Please Follow the Validation Rules", 400)
        }
        next();
    }
};