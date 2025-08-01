import { model, Schema } from "mongoose";
import { ITransaction, TransactionType } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
    amount: {type: Number, required: true},
    charge: {type: Number, default: 0},
    transactionId: {type: String, required: true},
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderPhoneNumber: {type: String, required: true},
    receiverPhoneNumber: {type: String, required: true},
    commission: {type: Number, default: 0},
    transactionType: {type: String, enum: TransactionType}

},{
    timestamps: true,
    versionKey: false
})

export const Transaction = model<ITransaction>("Transaction", transactionSchema)