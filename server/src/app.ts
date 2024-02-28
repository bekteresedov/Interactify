import express, { Express, } from "express";
import { config } from "dotenv"
import connect from "./utils/db/dbConnect";
import authRouter from "./routers/authRouter";
import cookieParser from 'cookie-parser'
config();
connect();
const server: Express = express();
const mainPath: string = "/api/v1"
const PORT: String = process.env.APP_PORT as String;

server.use(cookieParser());
server.use(express.json({ limit: '10mb' }));
// routers
server.use(mainPath, authRouter)
server.listen(PORT, async () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})
