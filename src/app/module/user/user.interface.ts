import { Types } from "mongoose";

export enum Role{
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN ="ADMIN",
    AGENT = "AGENT",
    USER = "USER"

}
export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    nid: string,
    phoneNumber: string,
    email: string,
    pin: string,
    photo?: string,
    role?: Role,
    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    wallet?: Types.ObjectId

}