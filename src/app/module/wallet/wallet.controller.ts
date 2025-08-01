import  httpStatus  from 'http-status-codes';
import { sendResponse } from "../../utils/sendResponse"
import { catchAsync } from '../../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { walletService } from './wallet.Service';
import { JwtPayload } from 'jsonwebtoken';

const updateWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;
    const wallet = await walletService.updateWallet(walletId, payload, verifiedToken as JwtPayload)

    

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Wallet Updated Successfully",
        data: wallet,
    })
})


const getAllWallet = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const wallets = await walletService.getAllWallet() 

    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Wallets retreived Successfully",
    data: wallets.wallets,
    meta: {
      total: wallets.totalWallets
    }
  })
})

const getSingleWallet =  async(req: Request, res: Response, next: NextFunction) =>{
    const walletId = req.params.id
    const wallet = await walletService.getSingleWallet(walletId)
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retreived Single Wallet Successfully",
    data: wallet,
  

    })
}


export const walletController = {
    getAllWallet,
    getSingleWallet,
    updateWallet
}