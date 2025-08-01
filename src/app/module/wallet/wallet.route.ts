import { Router } from "express"
import { checkAuth } from "../../middleware/checkAuth"
import { Role } from "../user/user.interface"
import { walletController } from "./wallet.controller"

const router = Router()


router.get("/", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), walletController.getAllWallet)
router.patch("/update/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletController.updateWallet)
router.get("/:id", checkAuth(...Object.values(Role)), walletController.getSingleWallet)

export const walletRoutes = router