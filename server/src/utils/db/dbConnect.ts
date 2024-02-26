import mongoose, { ConnectOptions } from "mongoose";
import { config } from "dotenv"

config();

const DB_URI: String = process.env.DB_URI as String;

const connect = () => {
    mongoose.set("strictQuery", true);
    mongoose
        .connect(DB_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        .then(() => console.log("connected to database"))
        .catch((err: any) => console.log(err));
};

export default connect;