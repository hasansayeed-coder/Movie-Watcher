import nodemailer from "nodemailer";

if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASS) {
  throw new Error("Missing Mailtrap credentials in environment variables");
}

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

export default transporter;