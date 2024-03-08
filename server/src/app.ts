require("express-async-errors")
import express, { Express, } from "express";
import { config } from "dotenv"
import connect from "./utils/db/dbConnect";
import cookieParser from 'cookie-parser'
import router from "./routers";
import { errorHandlerMiddleware } from "./middlewares/errorHandler";
config();
connect();
const server: Express = express();
const mainPath: string = "/api/v1"
const PORT: String = process.env.APP_PORT as String;

server.use(cookieParser());
server.use(express.json({ limit: '10mb' }));
// routers
server.use(mainPath, router)

// error handler
server.use(errorHandlerMiddleware)


server.listen(PORT, async () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})
