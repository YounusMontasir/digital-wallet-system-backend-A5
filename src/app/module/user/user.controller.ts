import { NextFunction, Request, Response } from "express"
import { User } from "./user.model"
import { Wallet } from "../wallet/wallet.model"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { userServices } from "./user.service"
import { JwtPayload } from "jsonwebtoken"

const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

    const result = await userServices.createUser(req.body)
sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created Successfully",
    data: result
  })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await userServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })
})


const getAllUser =  async(req: Request, res: Response, next: NextFunction) =>{
    const users = await userServices.getAllUser()
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retreived all Users Successfully",
    data: users.users,
    meta: {
        total: users.totalUsers
    }

    })
}
const getSingleUser =  async(req: Request, res: Response, next: NextFunction) =>{
    const userId = req.params.id
    const users = await userServices.getSingleUser(userId)
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retreived Single User Successfully",
    data: users,
  

    })
}


export const userControllers = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser
}