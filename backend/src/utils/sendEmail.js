//fake log, connect Nodemailer latter
// const sendEmail = async (to, message) => {
//     console.log(`Sending email to ${to}: ${message}`);
//   };
  
//   export default sendEmail;

// src/utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, message) => {
  try {
    // Configure the transporter with SMTP settings
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email options
    const mailOptions = {
      from: `"JUSTEvents" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}: ${error.message}`);
    return false;
  }
};

export default sendEmail;

  