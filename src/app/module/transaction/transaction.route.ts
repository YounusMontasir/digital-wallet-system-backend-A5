import { Role } from './../user/user.interface';
import { checkAuth } from "../../middleware/checkAuth"
import { transactionControllers } from './transaction.controller';
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createTransactionZodSchema } from './transaction.validation';

const router = Router()

router.post("/add-money",checkAuth(Role.ADMIN, Role.AGENT), validateRequest(createTransactionZodSchema), transactionControllers.addMoney)
router.post("/send-money",checkAuth(Role.USER), validateRequest(createTransactionZodSchema), transactionControllers.sendMoney)
router.post("/cash-out",checkAuth(Role.USER), validateRequest(createTransactionZodSchema), transactionControllers.cashOut)
router.get("/", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), transactionControllers.getAllTransactions)
router.get("/my-transaction/:id", checkAuth(...Object.values(Role)), transactionControllers.getMyTransactions)

export const transactionRoutes = router