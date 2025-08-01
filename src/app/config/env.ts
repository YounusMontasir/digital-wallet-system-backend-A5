import dotenv from 'dotenv';

dotenv.config();
interface EnvConfig {
    DB_URL: string,
    PORT: string,
    BCRYPT_SALT_ROUND: string,
    JWT_ACCESS_SECRET: string,
    JWT_ACCESS_EXPIRES: string,
    JWT_REFRESH_SECRET: string,
    JWT_REFRESH_EXPIRES: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string
}

const loadEnvVariables = (): EnvConfig =>{
    const requiredEnvVariables: string[] = ["DB_URL", "PORT", "BCRYPT_SALT_ROUND", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"]
    
    requiredEnvVariables.forEach(key =>{
        if(!process.env[key]){
             throw new Error(`Missing require environment variable ${key}`)
            
        }
    })

    return {
    DB_URL: process.env.DB_URL as string,
    PORT: process.env.PORT as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string

}
}


export const envVars = loadEnvVariables()