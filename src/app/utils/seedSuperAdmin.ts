import  bcryptjs  from 'bcryptjs';
import { envVars } from "../config/env"
import { IUser, Role } from "../module/user/user.interface";
import { User } from "../module/user/user.model"

export const seedSuperAdmin = async() =>{
    try {
        const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})

        if(isSuperAdminExist){
            console.log("Super Admin Already Exists!");
            return;
        }

         const hashedPin= await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

           const payload: IUser = {
            name: "Super admin",
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            nid: "45644146546",
            pin: hashedPin,
            isVerified: true,
            phoneNumber:"01854641564"

        }

        const superAdmin = await User.create(payload)
        console.log("Super Admin Created Successfuly! \n");

        
    } catch (error) {
        console.log(error);
        
    }
}