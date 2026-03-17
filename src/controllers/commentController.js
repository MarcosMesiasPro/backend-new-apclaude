const Comment = require('../models/Comment');

// GET /api/comments/:animeId
const getComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ animeId: req.params.animeId, isDeleted: false })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ animeId: req.params.animeId, isDeleted: false });

    res.json({ success: true, total, page, comments });
  } catch (error) {
    next(error);
  }
};

// POST /api/comments/:animeId
const createComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      user: req.user._id,
      animeId: req.params.animeId,
      content: req.body.content,
    });

    const populated = await comment.populate('user', 'username avatar');
    res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /api/comments/:id
const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, isDeleted: false });
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (String(comment.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    comment.content = req.body.content;
    await comment.save();

    res.json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/comments/:id
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, isDeleted: false });
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (String(comment.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    comment.isDeleted = true;
    await comment.save();

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

// POST /api/comments/:id/like
const toggleLike = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, isDeleted: false });
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const userId = req.user._id;
    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }
    await comment.save();

    res.json({ success: true, liked: !alreadyLiked, likesCount: comment.likes.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, createComment, updateComment, deleteComment, toggleLike };
