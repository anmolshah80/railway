const { config } = require('../config');
const { redis } = require('../config/redis');
const prisma = require('../config/prisma');
const logger = require('../config/logger');
const { BadRequestError } = require('../utils/error');

const getProfile = async (userId) => {
  logger.info(`Fetching profile for user ID: ${userId}`);

  const storedUser = await redis.get(`user:${userId}`);

  if (storedUser) {
    logger.info(`User profile found in cache for user ID: ${userId}`);

    return JSON.parse(storedUser);
  }

  logger.info(
    `User profile not found in cache for user ID: ${userId}. Fetching from database.`,
  );

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    logger.error(`User not found for user ID: ${userId}`);

    throw new BadRequestError('User not found', 'USER_NOT_FOUND');
  }

  logger.info('Exclude password from the user object before returning');

  const { password: _password, ...safeUser } = user;

  logger.info(
    `Storing user profile in cache for user ID: ${userId} with a TTL of ${config.REDIS_USER_TTL} seconds`,
  );

  await redis.set(
    `user:${userId}`,
    JSON.stringify(safeUser),
    'EX',
    config.REDIS_USER_TTL,
  );

  return safeUser;
};

const updateProfile = async (userId, profileData) => {
  logger.info(`Updating profile for user ID: ${userId}`);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: profileData,
  });

  logger.info('Exclude password from the updated user object before returning');

  const { password: _password, ...safeUser } = updatedUser;

  logger.info(
    `Updating user profile in cache for user ID: ${userId} with a TTL of ${config.REDIS_USER_TTL} seconds`,
  );

  await redis.set(
    `user:${userId}`,
    JSON.stringify(safeUser),
    'EX',
    config.REDIS_USER_TTL,
  );

  return safeUser;
};

const deleteProfile = async (userId) => {
  logger.info(`Deleting profile for user ID: ${userId}`);

  await prisma.user.delete({
    where: { id: userId },
  });

  logger.info(`Removing user profile from cache for user ID: ${userId}`);

  await redis.del(`user:${userId}`);
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
};
