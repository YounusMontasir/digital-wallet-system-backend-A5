import  httpStatus  from 'http-status-codes';
import AppError from "../../middleware/AppError";
import { Wallet } from "./wallet.model"
import { IWallet } from './wallet.interface';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from '../user/user.interface';

const updateWallet = async (walletId: string, payload: Partial<IWallet>, decodedToken: JwtPayload) => {

    const isWalletExist = await Wallet.findById(walletId);

    if (!isWalletExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found")
    }

    

    if (payload.walletStatus) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }


    const newUpdatedWallet = await Wallet.findByIdAndUpdate(walletId, payload, { new: true, runValidators: true })

    return newUpdatedWallet
}

const getAllWallet = async() =>{
    const wallets = await Wallet.find().populate("user", "name email phoneNumber role")

    const totalWallets = await Wallet.countDocuments()

    return {
        wallets,
        totalWallets
    }
}

const getSingleWallet = async (walletId: string) =>{
     const wallet = await Wallet.findById(walletId).populate("user", "name email phoneNumber role")
     return wallet
}

export const walletService ={
    getAllWallet,
    getSingleWallet,
    updateWallet
}