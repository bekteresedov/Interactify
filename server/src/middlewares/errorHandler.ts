import { NextFunction, Request, Response } from "express";
import { APIError } from "../utils/errors/APIError";
import { IErrorResponse } from "../interfaces/response/IErrorResponse";

export const errorHandlerMiddleware = (error: any, request: Request, response: Response<IErrorResponse>, next: NextFunction) => {
    if (error instanceof APIError) {
        return response.status(error.statusCode || 400)
            .json({
                success: false,
                message: error.message
            })
    }

    console.log(error);

    return response.status(500).json({
        success: false,
        message: "Internal Server Error!"
    })
}