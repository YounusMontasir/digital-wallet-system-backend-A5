import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";



let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("MongoDB connected successfully");

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening on port ${envVars.PORT}`);
        });
    } catch (error) {
        console.log("Failed to start server:", error);
    }
};

(async () => {
    await startServer()
    await seedSuperAdmin()
})()
