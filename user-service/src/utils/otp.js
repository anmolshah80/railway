const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const { redis } = require('../config/redis');
const { config } = require('../config');
const { TooManyRequestsError } = require('./error');

const RATE_MAX = parseInt(config.OTP_RATE_MAX_PER_HOUR || '5', 10);
const ATTEMPTS_MAX = parseInt(config.OTP_MAX_VERIFY_ATTEMPTS || '5', 10);
const OTP_TTL = parseInt(config.OTP_TTL || '300', 10);
const OTP_HMAC_SECRET = config.OTP_HMAC_SECRET;

function hmacFor(email, otp) {
  return crypto
    .createHmac('sha256', OTP_HMAC_SECRET)
    .update(email + ':' + otp)
    .digest('hex');
}

async function generateAndStoreOtp(meta) {
  // max OTPs per hour
  const rateKey = `otp:rate:${meta.email}`;
  const sentCount = parseInt((await redis.get(rateKey)) || '0', 10);

  if (sentCount >= RATE_MAX) {
    throw new TooManyRequestsError(
      'Too many OTP requests. Please try again later.',
      'OTP_RATE_LIMIT',
    );
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const otpSessionId = crypto.randomUUID();

  const hashedOtp = hmacFor(meta.email, otp);

  await redis.set(
    `otp:session:${otpSessionId}`,
    JSON.stringify({
      hashedOtp: hashedOtp,
      meta,
    }),
    'EX',
    OTP_TTL,
  );

  await redis.incr(rateKey);
  await redis.expire(rateKey, 3600);

  return {
    otp,
    otpSessionId,
  };
}

async function verifyOtp(otp, otpSessionId) {
  const rawData = await redis.get(`otp:session:${otpSessionId}`);

  if (!rawData) return null;

  const { hashedOtp: storedHashedOtp, meta } = JSON.parse(rawData);

  // track the number of attempts made to verify the OTP (only 5 attempts can be made)
  const attemptsKey = `otp:attempts:${meta.email}`;
  const attemptsCount = parseInt((await redis.get(attemptsKey)) || '0', 10);

  if (attemptsCount >= ATTEMPTS_MAX) {
    throw new TooManyRequestsError(
      'Too many OTP verification attempts. Please request a new OTP.',
    );
  }

  // hash the OTP provided by the user (for comparison)
  const hashedUserProvidedOtp = hmacFor(meta.email, otp);

  if (
    crypto.timingSafeEqual(
      Buffer.from(hashedUserProvidedOtp, 'hex'),
      Buffer.from(storedHashedOtp, 'hex'),
    )
  ) {
    await redis.del(`otp:session:${otpSessionId}`, attemptsKey);
    await redis.del(`otp:rate:${meta.email}`);

    return meta;
  }

  await redis.incr(attemptsKey);
  await redis.expire(attemptsKey, OTP_TTL);

  return null;
}

module.exports = {
  generateAndStoreOtp,
  verifyOtp,
};
