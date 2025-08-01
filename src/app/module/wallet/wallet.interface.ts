import { Types } from "mongoose";
import { Role } from "../user/user.interface";


export enum WalletStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface IWallet {
    currentAmount: number,
    walletStatus?: WalletStatus,
    user: Types.ObjectId
}