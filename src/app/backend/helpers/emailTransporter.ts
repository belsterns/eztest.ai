import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

export const emailTransporter: Transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE_HOST as string,
  port: Number(process.env.EMAIL_SERVICE_PORT),
  auth: {
    user: process.env.EMAIL_SERVICE_AUTH_USER as string,
    pass: process.env.EMAIL_AUTH_KEY as string,
  },
} as SMTPTransport.Options);
