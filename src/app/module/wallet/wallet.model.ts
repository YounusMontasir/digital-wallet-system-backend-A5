import { model, Schema } from "mongoose";
import {  IWallet, WalletStatus } from "./wallet.interface";
import { Role } from "../user/user.interface";

const walletSchema = new Schema<IWallet>({
    currentAmount: {type: Number, required: true},
    walletStatus: {type: String, enum: Object.values(WalletStatus), default: WalletStatus.ACTIVE},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    // role: {type: String, enum: Object.values(Role), default: Role.USER}
},{
    timestamps: true,
    versionKey: false
})

export const Wallet = model<IWallet>("Wallet", walletSchema)