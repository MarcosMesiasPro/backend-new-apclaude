const router = require('express').Router();
const { body } = require('express-validator');
const { getComments, createComment, updateComment, deleteComment, toggleLike } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

router.use(apiLimiter);

router.get('/:animeId', getComments);
router.post('/:animeId', protect, [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters'),
], validate, createComment);

router.put('/:id', protect, [
  body('content').trim().isLength({ min: 1, max: 500 }),
], validate, updateComment);

router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
