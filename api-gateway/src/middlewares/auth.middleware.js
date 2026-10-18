const jwt = require('jsonwebtoken');
const { config } = require('../config');
const { UnauthorizedError } = require('../utils/error');
const logger = require('../config/logger');

/**
 * Middleware to verify access token from Authorization header
 * This is going to be the authentication mechanism which will authenticate user
 * Extracts user ID and attaches it to request headers for downstream services
 *
 */
function requireAuth(req, res, next) {
  try {
    let accessToken;

    // try `Authorization` header (service-to-service / mobile clients)
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.split(' ')[1];
    }

    // fallback to `httpOnly` cookie (browser clients)
    if (!accessToken && req.cookies) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
      throw new UnauthorizedError('Authorization token missing');
    }

    // verify access token
    const payload = jwt.verify(accessToken, config.JWT_ACCESS_SECRET);

    if (!payload.id) {
      throw new UnauthorizedError('Invalid token payload');
    }

    // attach user context to request for downstream services
    req.user = {
      id: payload.id,
    };

    // add user ID to headers for proxied requests
    req.headers['x-user-id'] = payload.id.toString();

    logger.debug(`User ${payload.id} authenticated successfully`);

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(
        new UnauthorizedError('Access token expired', 'TOKEN_EXPIRED'),
      );
    }

    if (error.name === 'JsonWebTokenError') {
      return next(
        new UnauthorizedError('Invalid access token', 'TOKEN_INVALID'),
      );
    }

    return next(error);
  }
}

module.exports = {
  requireAuth,
};
