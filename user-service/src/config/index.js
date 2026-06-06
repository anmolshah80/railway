require('dotenv').config();

const config = {
  SERVICE_NAME: require('../../package.json').name,
  PORT: Number(process.env.PORT) || 4001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL || 'redis://:railwayapp@redis:6379',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:4000',

  OTP_TTL: process.env.OTP_TTL || 300,

  MAIL_SEND: process.env.MAIL_SEND,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};

if (!config.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is missing');
}

if (!config.MAIL_SEND) {
  throw new Error('MAIL_SEND is missing');
}

module.exports = { config };
