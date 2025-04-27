import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { UKR_NET_EMAIL_USER, UKR_NET_EMAIL_PASSWORD, BASE_URL } = process.env;

const config = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL_USER || 'goitnodejs@meta.ua',
    pass: UKR_NET_EMAIL_PASSWORD || process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${BASE_URL || 'http://localhost:3000'}/api/auth/verify/${verificationToken}`;
  
  const emailOptions = {
    from: UKR_NET_EMAIL_USER || 'goitnodejs@meta.ua',
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    html: `<p>Please verify your email by clicking on the following link:</p>
           <p><a href="${verificationLink}">Verify Email</a></p>`,
  };

  try {
    const info = await transporter.sendMail(emailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendVerificationEmail;
