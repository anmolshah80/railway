const { UnauthorizedError } = require('../utils/error');

/**
 * Extract user context from gateway headers
 * Gateway sets x-user-id after JWT verification
 *
 */
function getUserContext(req, _res, next) {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return next(
      new UnauthorizedError(
        'User context is missing in headers — must come through gateway',
        'USER_CONTEXT_MISSING',
      ),
    );
  }

  req.user = { id: userId };

  next();
}

module.exports = { getUserContext };
