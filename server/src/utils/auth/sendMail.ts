import nodemailer, { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer';
import { APIError } from '../errors/APIError';
import { config } from "dotenv"

config();
export const sendEmail = async (mailOptions: SendMailOptions) => {
    var transporter: Transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSORD,
        },
    });

    transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
            console.log(error);
            throw new APIError("Email Failed to Send!", 403)
        } else {
            console.log("Email sent: " + info.response);
        }

    });

}