import  bcryptjs  from 'bcryptjs';
import  httpStatus  from 'http-status-codes';
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import AppError from '../../middleware/AppError';
import { createUserTokens } from '../../utils/userTokens';

const credentialsLogin = async (payload: Partial<IUser>) =>{
    const {email, pin} = payload

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPinMatched = await bcryptjs.compare(pin as string, isUserExist.pin)

    if (!isPinMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Pin")
    }

    const userTokens = createUserTokens(isUserExist)

    const { pin: pinnedPass, ...rest } = isUserExist.toObject()

    return{
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

    

}

export const AuthServices = {
    credentialsLogin
}