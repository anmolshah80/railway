const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError, NotFoundError } = require('../utils/error');
const userService = require('../services/user.service');

exports.getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw new BadRequestError('User ID is missing', 'USER_ID_MISSING');
  }

  const user = await userService.getProfile(userId);

  return res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: user,
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw new BadRequestError('User ID is missing', 'USER_ID_MISSING');
  }

  const updatedUser = await userService.updateProfile(userId, req.body);

  return res.status(200).json({
    success: true,
    message: 'User profile updated successfully',
    data: updatedUser,
  });
});

exports.deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw new BadRequestError('User ID is missing', 'USER_ID_MISSING');
  }

  await userService.deleteProfile(userId);

  return res.status(200).json({
    success: true,
    message: 'User profile deleted successfully',
  });
});

exports.getUserInternal = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new BadRequestError('User ID is missing', 'USER_ID_MISSING');
  }

  const user = await userService.getProfile(userId);

  if (!user) {
    throw new NotFoundError('User not found', 'USER_NOT_FOUND');
  }

  return res.status(200).json({
    success: true,
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
});
