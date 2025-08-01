import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from './auth.service';
import { setAuthCookie } from '../../utils/setCookie';
import { catchAsync } from '../../utils/catchAsync';

const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const loginInfo = await  AuthServices.credentialsLogin(req.body)

    setAuthCookie(res, loginInfo)
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logged in Successfully",
    data: {
        accessToken: loginInfo.accessToken,
        refreshToken: loginInfo.refreshToken,
        user: loginInfo.user
    }
    })
})

export const authControllers = {
    credentialsLogin
}