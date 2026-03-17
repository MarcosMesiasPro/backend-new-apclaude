const router = require('express').Router();
const { body } = require('express-validator');
const { getProfile, updateProfile, followUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

router.use(apiLimiter);

router.get('/:username', getProfile);

router.put('/me', protect, [
  body('username').optional().trim().isLength({ min: 3, max: 30 }),
  body('bio').optional().isLength({ max: 200 }),
  body('avatar').optional().isURL().withMessage('Invalid avatar URL'),
], validate, updateProfile);

router.post('/:id/follow', protect, followUser);

module.exports = router;
