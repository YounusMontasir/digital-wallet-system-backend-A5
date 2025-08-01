import { NextFunction, Request, Response } from "express";
import { TErrorSources } from "../interfaces/error.types";
import AppError from "./AppError";
import { handlerValidationError } from "../errorHelpers/handleValidationError";
import { handlerZodError } from "../errorHelpers/handleZodError";
import { handleCastError } from "../errorHelpers/handleCastError";
import { handlerDuplicateError } from "../errorHelpers/handleDuplicateError";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction)=>{
    let statusCode = 500
    let message = "Something Went Wrong!!"
    let errorSources : TErrorSources[] = []

      //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }
    else if(err instanceof AppError){
        statusCode = err.statusCode,
        message = err.message
    }
    else{
        statusCode = 500,
        message = err.message
    }
      res.status(statusCode).json({
        success: false,
        message,
        errorSources
    })
}