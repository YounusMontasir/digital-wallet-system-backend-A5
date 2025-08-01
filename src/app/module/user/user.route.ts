import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "./user.validation";



const router = Router()

router.post("/create",validateRequest(createUserZodSchema), userControllers.createUser)
router.get("/",checkAuth(Role.SUPER_ADMIN, Role.ADMIN), userControllers.getAllUser)
router.patch("/update/:id", checkAuth(...Object.values(Role)), userControllers.updateUser)
router.get("/:id", checkAuth(...Object.values(Role)), userControllers.getSingleUser)

export const userRoutes = router