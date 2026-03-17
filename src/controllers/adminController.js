const User = require('../models/User');
const Comment = require('../models/Comment');

// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();
    res.json({ success: true, total, page, users });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users
const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.create({ username, email, password, role });
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id
const editUser = async (req, res, next) => {
  try {
    const { username, email, bio, avatar, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, bio, avatar, role },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/block
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? 'User blocked' : 'User unblocked',
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/comments/:id
const adminDeleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    res.json({ success: true, message: 'Comment deleted by admin' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/comments
const getAllComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ isDeleted: false })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ isDeleted: false });
    res.json({ success: true, total, page, comments });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, createUser, editUser, deleteUser, toggleBlockUser, adminDeleteComment, getAllComments };
