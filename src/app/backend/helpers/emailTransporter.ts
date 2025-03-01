import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

export const emailTransporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USERNAME as string,
    pass: process.env.SMTP_PASSWORD as string,
  },
} as SMTPTransport.Options);
