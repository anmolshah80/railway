const cors = require('cors');

const { config } = require('../config');

const corsMiddleware = cors({
  origin: config.ALLOWED_ORIGINS.split(','),
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
