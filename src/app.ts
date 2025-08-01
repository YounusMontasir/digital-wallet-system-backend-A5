import express, { Request, Response } from 'express'
import cookieParser from "cookie-parser"
import cors from 'cors';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/api", router)
app.use("/", (req: Request, res: Response)=>{
    res.status(200).json({
        message: "Welcome to digitel wallet system backend"
    })
})

app.use(globalErrorHandler)