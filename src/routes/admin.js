const router = require('express').Router();
const { body } = require('express-validator');
const {
  getAllUsers, createUser, editUser, deleteUser,
  toggleBlockUser, adminDeleteComment, getAllComments
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(protect, adminOnly);

// Users
router.get('/users', getAllUsers);
router.post('/users', [
  body('username').trim().isLength({ min: 3, max: 30 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'admin']),
], validate, createUser);
router.put('/users/:id', editUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/block', toggleBlockUser);

// Comments
router.get('/comments', getAllComments);
router.delete('/comments/:id', adminDeleteComment);

module.exports = router;
