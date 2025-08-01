import  httpStatus  from 'http-status-codes';
import { envVars } from "../../config/env";
import AppError from "../../middleware/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { Wallet } from "../wallet/wallet.model";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import { JwtPayload } from 'jsonwebtoken';

const createUser = async(payload: Partial<IUser>) =>{
    const session =await User.startSession()
    session.startTransaction()

try {
    const {email, pin, role, ...rest} = payload

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPin =await bcryptjs.hash(pin as string, Number(envVars.BCRYPT_SALT_ROUND))
    
    
    const user = await User.create([{
        email,
        pin: hashedPin,
        role,
        ...rest
    }], { session })
    let amount = 50 
    if(role === Role.AGENT){
        amount = 100000
    } else if(role === Role.ADMIN || role === Role.SUPER_ADMIN){
        amount = 1000000
    } else{
        amount = 50
    }
    const wallet = await Wallet.create([{
        currentAmount: amount,
        user: user[0]._id
    }], { session })

    const updateUser = await User.findByIdAndUpdate(user[0]._id, {
        wallet: wallet[0]._id
    }, { new: true,runValidators: true, session }).populate("wallet", "currentAmount commission")

    await session.commitTransaction()
    session.endSession()

    return updateUser
} 
catch (error) {
    console.log(error);
    session.endSession()
    throw error
}
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.pin) {
        payload.pin = await bcryptjs.hash(payload.pin, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

const getAllUser = async () =>{
     const users = await User.find()
     const totalUsers = await User.countDocuments()
     return {
        users,
        totalUsers
     }
}

const getSingleUser = async (userId: string) =>{
     const user = await User.findById(userId).populate("wallet", "currentAmount")
     return user
}


export const userServices = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser
} 