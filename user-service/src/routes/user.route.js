const express = require('express');

const { getUserContext } = require('../middlewares/getUserContext.middleware');
const { internalAuth } = require('../middlewares/internalAuth.middleware');
const {
  getProfile,
  updateProfile,
  deleteProfile,
  getUserInternal,
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/', getUserContext, getProfile);
router.put('/', getUserContext, updateProfile);
router.delete('/', getUserContext, deleteProfile);

router.get('/internal/:userId', internalAuth, getUserInternal);

module.exports = router;
