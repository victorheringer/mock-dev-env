import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function enviarEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    ignoreTLS: true,
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: "user@test.com",
    subject: "Test MailCatcher",
    text: "This is a test email sent via MailCatcher",
  });

  console.log("Email sent (check MailCatcher at http://localhost:1080)");
}
