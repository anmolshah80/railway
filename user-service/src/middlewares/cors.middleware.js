const cors = require('cors');

const { config } = require('../config');

const allowedOrigins = config.ALLOWED_ORIGINS
  ? config.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : [];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'ORIGIN',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
});

module.exports = { corsMiddleware };
