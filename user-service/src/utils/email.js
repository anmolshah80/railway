const sgMail = require('@sendgrid/mail');
const { config } = require('../config');

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpExpiresIn = (config.OTP_TTL || 300) / 60;

async function sendOtpEmail(email, otp) {
  const message = {
    to: email,
    from: `${config.SENDER_EMAIL_ADDRESS}`,
    subject: 'OTP Verification Code for Railway App',
    text: `Your OTP Verification Code for Railway App is ${otp}. It will expire in ${otpExpiresIn} minutes.`,
    html: `
    <div style="
      font-family: Arial, sans-serif; 
      max-width: 420px; 
      margin: auto; 
      padding: 20px; 
      border: 1px solid #e5e5e5; 
      border-radius: 10px; 
      background: #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    ">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4A3AFF; margin: 0;">Railway App</h2>
      </div>

      <p style="font-size: 16px; color: #333;">
        Hi,
      </p>

      <p style="font-size: 16px; color: #333;">
        Welcome to <strong>Railway</strong> 👋  
        Use the verification code below to complete your sign up:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <div style="
          display: inline-block; 
          padding: 14px 26px; 
          font-size: 32px; 
          letter-spacing: 8px; 
          font-weight: bold; 
          background: #F4F4FF; 
          border-radius: 8px; 
          color: #4A3AFF;
          border: 1px solid #e0e0ff;
        ">
          ${otp}
        </div>
      </div>

      <p style="font-size: 15px; color: #555;">
        This code will expire in <strong>${otpExpiresIn} minutes</strong>.
      </p>

      <p style="font-size: 15px; color: #555;">
        If this wasn't you, please ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

      <p style="font-size: 14px; color: #888; text-align: center;">
        <strong>Team Railway</strong>
      </p>
    </div>
  `,
  };

  await sgMail.send(message);
}

async function verifyOtpEmail(meta) {
  const message = {
    to: meta.email,
    from: `${config.SENDER_EMAIL_ADDRESS}`,
    subject: 'OTP Verified Successfully',
    text: `Your OTP has been verified successfully. Welcome to Railway!`,
    html: `
    <div style="
      font-family: Arial, sans-serif; 
      max-width: 420px; 
      margin: auto; 
      padding: 20px; 
      border: 1px solid #e5e5e5; 
      border-radius: 10px; 
      background: #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    ">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4A3AFF; margin: 0;">Railway App</h2>
      </div>

      <p style="font-size: 16px; color: #333;">
        Hi <strong>${meta.firstName},</strong>
      </p>

      <p style="font-size: 16px; color: #333;">
        Welcome to <strong>Railway App</strong> 👋  
        Your account has been successfully created and verified.
      </p>

      <div style="
        text-align: center; 
        margin: 25px 0;
      ">   
        <a href="https://railwayapp.com/login" 
          style="
          display: inline-block;
          padding: 12px 22px;
          background: #4A3AFF;
          color: white;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          border-radius: 6px;
        ">
        Login to Your Account
        </a>
      </div>

      <p style="font-size: 15px; color: #555;">
        If you did not create this account, please contact our support team immediately.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

      <p style="font-size: 14px; color: #888; text-align: center;">
        Happy Learning 🎉<br/>
        <strong>Team Railway</strong>
      </p>
    </div>`,
  };

  await sgMail.send(message);
}

module.exports = {
  sendOtpEmail,
  verifyOtpEmail,
};
