const OTP = require('../models/OTP.model');
const nodemailer = require('nodemailer');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPViaSMS = async (phone, otp) => {
  try {
    // Check if Twilio config exists
    // if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    //   console.warn('⚠️ Twilio credentials missing in .env. Skipping SMS.');
    //   console.log(`📱 SMS OTP (Simulated) to ${phone}: ${otp}`);
    //   return;
    // }

    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // await client.messages.create({
    //   body: `Your OTP is: ${otp}. Valid for 10 minutes.`,
    //   from: process.env.TWILIO_PHONE,
    //   to: phone,
    // });
    console.log(`✅ SMS sent to ${phone}: ${otp}`);
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    // Fallback for dev: log OTP anyway so you can still login
    console.log(`📱 SMS OTP (Fallback) to ${phone}: ${otp}`);
  }
};

const sendOTPViaEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Bus Tracking App',
    html: `
      <h2>OTP Verification</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const createOTP = async (phone, email, purpose) => {
  const otp = generateOTP(); // Generate OTP first
  const otpRecord = new OTP({
    phone,
    email,
    code: otp,
    purpose,
  });

  await otpRecord.save();

  if (email) {
    await sendOTPViaEmail(email, otp);
  } else if (phone) {
    await sendOTPViaSMS(phone, otp);
  }

  return otp;
};

const verifyOTP = async (phone, email, code) => {
  const query = { isUsed: false, code };
  if (phone) query.phone = phone;
  if (email) query.email = email;

  const otpRecord = await OTP.findOne(query);

  if (!otpRecord) {
    return { valid: false, message: 'Invalid or expired OTP' };
  }

  otpRecord.isUsed = true;
  await otpRecord.save();

  return { valid: true, message: 'OTP verified' };
};

module.exports = { createOTP, verifyOTP };
