import  httpStatus  from 'http-status-codes';
import AppError from "../../middleware/AppError"
import { User } from "../user/user.model"
import { ITransaction } from "./transaction.interface"
import { Wallet } from '../wallet/wallet.model';
import { Transaction } from './transaction.model';
import { IsActive, Role } from '../user/user.interface';
import { WalletStatus } from '../wallet/wallet.interface';

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const getAllTransactions = async() =>{
    const transactions = await Transaction.find()
    .populate('sender', 'name email phoneNumber role')
    .populate('receiver', 'name email phoneNumber role');

    const totalTransactions = await Transaction.countDocuments()

    return {
        transactions,
        totalTransactions
    }
}

const getMyTransactions = async (userId: string) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

 const transactions = await Transaction.find({
  $or: [{ sender: isUserExist._id }, { receiver: isUserExist._id }],
})
.populate('sender', 'name email phoneNumber role')
.populate('receiver', 'name email phoneNumber role');


     const totalTransactions = transactions.length;

    return {
        transactions,
        totalTransactions
    }
};


const addMoney = async(payload: Partial<ITransaction>, userId: string) =>{
     const transactionId = getTransactionId()
    const session = await Transaction.startSession()
    session.startTransaction()
    try {
        const sender = await User.findById(userId)
     if(!sender){
        throw new AppError(httpStatus.NOT_FOUND, "No sender existed")
    }
    const receiver = await User.findOne({phoneNumber: payload.receiverPhoneNumber })

    if(!receiver){
        throw new AppError(httpStatus.NOT_FOUND, "No receiver existed")
    }
    if (receiver.isActive === IsActive.BLOCKED || receiver.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `Receiver is ${receiver.isActive}`)
        }
        if (receiver.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "Receiver is deleted")
        }
    if(sender.role === Role.AGENT  && (receiver.role === Role.AGENT || receiver.role === Role.ADMIN)){
        throw new AppError(httpStatus.BAD_REQUEST, "Agent can not send money to other Agent")
    }


    const senderWallet = await Wallet.findById(sender.wallet)
    if(senderWallet?.walletStatus === WalletStatus.INACTIVE || senderWallet?.walletStatus === WalletStatus.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, `Sender account is ${senderWallet.walletStatus}`)
    }

    const receiverWallet = await Wallet.findById(receiver.wallet)
    if(receiverWallet?.walletStatus === WalletStatus.INACTIVE || receiverWallet?.walletStatus === WalletStatus.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, `Receiver account is ${receiverWallet.walletStatus}`)
    }
    let commission = 0;
     if(Number(payload.amount) >= 25000){
        commission = 50
    }else{
        commission = 0
    }

    if(Number(payload.amount)> Number(senderWallet?.currentAmount)){
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance")
    }


    const updatedSenderAmount = (Number(senderWallet?.currentAmount) + commission) - Number(payload.amount) 
    const updatedReceiverAmount = Number(receiverWallet?.currentAmount) + Number(payload.amount)

    const transaction = await Transaction.create([{
        amount: payload.amount,
        receiverPhoneNumber: payload.receiverPhoneNumber,
        transactionType: payload.transactionType,
        sender: sender?._id,
        receiver: receiver?._id,
        senderPhoneNumber: sender.phoneNumber,
        transactionId: transactionId,
        commission: commission

    }], { session })
    const updateSenderWallet = await Wallet.findByIdAndUpdate(senderWallet?._id, {
        currentAmount: updatedSenderAmount
    }, { session })
    const updatedReceiverWallet = await Wallet.findByIdAndUpdate(receiverWallet?._id, {
        currentAmount: updatedReceiverAmount
    }, { session })

     await session.commitTransaction()
    session.endSession()

    return {
        transaction,
        updateSenderWallet,
        updatedReceiverWallet
    }
    } catch (error) {
        console.log(error);
    session.endSession()
    throw error
    }
}
const sendMoney = async(payload: Partial<ITransaction>, userId: string) =>{
     const transactionId = getTransactionId()
    const session = await Transaction.startSession()
    session.startTransaction()
    try {
        const sender = await User.findById(userId)
     if(!sender){
        throw new AppError(httpStatus.NOT_FOUND, "No sender existed")
    }
    const receiver = await User.findOne({phoneNumber: payload.receiverPhoneNumber })

    if(!receiver){
        throw new AppError(httpStatus.NOT_FOUND, "No receiver existed")
    }
    if (receiver.isActive === IsActive.BLOCKED || receiver.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `Receiver is ${receiver.isActive}`)
        }
        if (receiver.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "Receiver is deleted")
        }
    if(receiver.role === Role.AGENT || receiver.role === Role.ADMIN){
        throw new AppError(httpStatus.BAD_REQUEST, "User can not send money to any Agent")
    }


    const senderWallet = await Wallet.findById(sender.wallet)
    if(senderWallet?.walletStatus === WalletStatus.INACTIVE || senderWallet?.walletStatus === WalletStatus.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, `Sender account is ${senderWallet.walletStatus}`)
    }

    const receiverWallet = await Wallet.findById(receiver.wallet)
    if(receiverWallet?.walletStatus === WalletStatus.INACTIVE || receiverWallet?.walletStatus === WalletStatus.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, `Receiver account is ${receiverWallet.walletStatus}`)
    }
    
    let charge = 0;
    let commission = 0;
    if(Number(payload.amount) > 100 && Number(payload.amount) < 500){
        charge = 10
    } else if(Number(payload.amount) >= 500 && Number(payload.amount) < 1000 ){
        charge = 20 
    }
    else if(Number(payload.amount) >= 1000 && Number(payload.amount) < 25000 ){
        charge = (Number(payload.amount) / 1000) * 20
    }
    else if(Number(payload.amount) >= 25000){
        charge = (Number(payload.amount) / 1000) * 20
        commission = 50
    }
    else{
        charge = 0
        commission = 0
    }
    if((Number(payload.amount) + charge)> Number(senderWallet?.currentAmount)){
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance")
    }
   
    const updatedSenderAmount = (Number(senderWallet?.currentAmount) + commission) - (Number(payload.amount) + charge)  
    const updatedReceiverAmount = Number(receiverWallet?.currentAmount) + Number(payload.amount)

    const transaction = await Transaction.create([{
        amount: payload.amount,
        receiverPhoneNumber: payload.receiverPhoneNumber,
        transactionType: payload.transactionType,
        sender: sender?._id,
        receiver: receiver?._id,
        senderPhoneNumber: sender.phoneNumber,
        transactionId: transactionId,
        charge: charge,
        commission: commission

    }], { session })
    const updateSenderWallet = await Wallet.findByIdAndUpdate(senderWallet?._id, {
        currentAmount: updatedSenderAmount
    }, { session })
    const updatedReceiverWallet = await Wallet.findByIdAndUpdate(receiverWallet?._id, {
        currentAmount: updatedReceiverAmount
    }, { session })

     await session.commitTransaction()
    session.endSession()

    return {
        transaction,
        updateSenderWallet,
        updatedReceiverWallet
    }
    } catch (error) {
        console.log(error);
    session.endSession()
    throw error
    }
}

const cashOut = async(payload: Partial<ITransaction>, userId: string) =>{
     const transactionId = getTransactionId()
    const session = await Transaction.startSession()
    session.startTransaction()
    try {
        const sender = await User.findById(userId)
     if(!sender){
        throw new AppError(httpStatus.NOT_FOUND, "No sender existed")
    }
    const receiver = await User.findOne({phoneNumber: payload.receiverPhoneNumber })

    if(!receiver){
        throw new AppError(httpStatus.NOT_FOUND, "No receiver existed")
    }
    if (receiver.isActive === IsActive.BLOCKED || receiver.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `Receiver is ${receiver.isActive}`)
        }
        if (receiver.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "Receiver is deleted")
        }
    if((receiver.role === Role.USER || receiver.role === Role.ADMIN)){
        throw new AppError(httpStatus.BAD_REQUEST, "Only agent can cash out. Give agent number for cash out.")
    }


    const senderWallet = await Wallet.findById(sender.wallet)
    if(senderWallet?.walletStatus === WalletStatus.INACTIVE || senderWallet?.walletStatus === WalletStatus.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, `Sender account is ${senderWallet.walletStatus}`)
    }

    const receiverWallet = await Wallet.findById(receiver.wallet)
    if(receiverWallet?.walletStatus === WalletStatus.INACTIVE || receiverWallet?.walletStatus === WalletStatus.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, `Receiver account is ${receiverWallet.walletStatus}`)
    }
   let charge = 0;
    if(Number(payload.amount) > 100 && Number(payload.amount) < 500){
        charge = 10
    } else if(Number(payload.amount) >= 500 && Number(payload.amount) < 1000 ){
        charge = 20 
    }
    else if(Number(payload.amount) >= 1000 && Number(payload.amount) < 25000 ){
        charge = 100
    }
    else if(Number(payload.amount) >= 25000){
        charge = 200
    }
    else{
        charge = 0
    }
    if(Number(payload.amount)> Number(senderWallet?.currentAmount)){
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance")
    }


    const updatedSenderAmount = Number(senderWallet?.currentAmount) - (Number(payload.amount) + charge)  
    const updatedReceiverAmount = Number(receiverWallet?.currentAmount) + Number(payload.amount)

    const transaction = await Transaction.create([{
        amount: payload.amount,
        receiverPhoneNumber: payload.receiverPhoneNumber,
        transactionType: payload.transactionType,
        sender: sender?._id,
        receiver: receiver?._id,
        senderPhoneNumber: sender.phoneNumber,
        transactionId: transactionId,
        charge: charge

    }], { session })
    const updateSenderWallet = await Wallet.findByIdAndUpdate(senderWallet?._id, {
        currentAmount: updatedSenderAmount
    }, { session })
    const updatedReceiverWallet = await Wallet.findByIdAndUpdate(receiverWallet?._id, {
        currentAmount: updatedReceiverAmount
    }, { session })

     await session.commitTransaction()
    session.endSession()

    return {
        transaction,
        updateSenderWallet,
        updatedReceiverWallet
    }
    } catch (error) {
        console.log(error);
    session.endSession()
    throw error
    }
}
   

export const transactionService = {
    addMoney,
    sendMoney,
    cashOut,
    getAllTransactions,
    getMyTransactions
}