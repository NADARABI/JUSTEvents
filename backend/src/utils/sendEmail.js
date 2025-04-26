// src/utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for 587 (we use 587 with TLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"JUSTEvents Service" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7; color: #333;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #007BFF; text-align: center;">JUSTEvents Verification</h2>
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Here is your verification code:</p>
            <h1 style="text-align: center; color: #333;">${message}</h1>
            <p style="font-size: 14px; color: #555;">If you didn't request this, you can safely ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">This email was sent automatically by the JUSTEvents System.</p>
          </div>
        </div>
      `,
    };    

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}: ${error.message}`);
    return false;
  }
};

export default sendEmail;
