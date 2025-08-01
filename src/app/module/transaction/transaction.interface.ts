import { Types } from "mongoose";
export enum TransactionType {
    ADDMONEY = "ADDMONEY",
    CASHOUT = "CASHOUT",
    SENDMONEY = "SENDMONEY"
}
export interface ITransaction {
    _id: Types.ObjectId
    transactionId: string,
    amount: number,
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
    senderPhoneNumber:string,
    receiverPhoneNumber: string,
    charge: number,
    transactionType: TransactionType,
    commission?: number,
}