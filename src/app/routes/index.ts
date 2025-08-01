import { Router } from "express"
import { userRoutes } from "../module/user/user.route"
import { authRoutes } from "../module/auth/auth.route"
import { transactionRoutes } from "../module/transaction/transaction.route"
import { walletRoutes } from "../module/wallet/wallet.route"

export const router = Router()
const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/transaction",
        route: transactionRoutes
    },
    {
        path: "/wallet",
        route: walletRoutes
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})