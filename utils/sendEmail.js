// File: utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Buat transporter (kurir)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Definisikan opsi email
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: ... (bisa juga mengirim html)
  };

  // 3. Kirim email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;