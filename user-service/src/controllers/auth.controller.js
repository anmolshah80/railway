const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError } = require('../utils/error');
const { config } = require('../config');

exports.sendOTP = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new BadRequestError('All fields are required');
  }

  if (password !== confirmPassword) {
    throw new BadRequestError('Passwords do not match');
  }

  const { otpSessionId } = await authService.sendOTP(
    firstName,
    lastName,
    email,
    password,
  );

  res
    .cookie('railway-app-otp-session', otpSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: config.OTP_TTL * 1000, // default 5 minutes
    })
    .status(200)
    .json({
      success: true,
      message: 'OTP sent successfully',
    });
});

exports.verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const otpSessionId = req.cookies['railway-app-otp-session'];

  if (!otp || !otpSessionId) {
    throw new BadRequestError('OTP or OTP Session is missing');
  }

  const user = await authService.verifyOTP(otp, otpSessionId);

  return res.status(201).json({
    success: true,
    message: 'User account created and verified successfully',
    data: user,
  });
});
