import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { transactionService } from "./transaction.service"
import { JwtPayload } from "jsonwebtoken"
import { sendResponse } from "../../utils/sendResponse"

const getAllTransactions = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
   
    
    
    const transactions = await transactionService.getAllTransactions() 

    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Transactions retreived Successfully",
    data: transactions.transactions,
    meta: {
      total: transactions.totalTransactions
    }
  })
})

const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id as string;

  
  const transactions = await transactionService.getMyTransactions(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Transactions retrieved Successfully",
    data: transactions.transactions,
    meta: {
      total: transactions.totalTransactions
    }
  });
});


const addMoney = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const decodedToken = req.user as JwtPayload
    // console.log(decodedToken);
    
    
    const result = await transactionService.addMoney(req.body, decodedToken.userId) 

    sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Transaction completed Successfully",
    data: result.transaction
  })
})
const sendMoney = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const decodedToken = req.user as JwtPayload
    
    
    const result = await transactionService.sendMoney(req.body, decodedToken.userId) 

    sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Transaction completed Successfully",
    data: result.transaction
  })
})

const cashOut = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const decodedToken = req.user as JwtPayload
    // console.log(decodedToken);
    
    
    const result = await transactionService.cashOut(req.body, decodedToken.userId) 

    sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Transaction completed Successfully",
    data: result.transaction
  })
})



export const transactionControllers = {
    addMoney,
    sendMoney,
    cashOut,
    getAllTransactions,
    getMyTransactions
}

