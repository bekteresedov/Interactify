import express, { Express, } from "express";
import { config } from "dotenv"


config();

const server: Express = express();

const PORT: String = process.env.APP_PORT as String;


server.listen(PORT, async () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})