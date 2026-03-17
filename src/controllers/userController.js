const User = require('../models/User');

// GET /api/users/:username
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/me
const updateProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, avatar },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user: updated });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/:id/follow
const followUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const currentId = req.user._id;

    if (targetId === String(currentId)) {
      return res.status(400).json({ success: false, message: "You can't follow yourself" });
    }

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });

    const alreadyFollowing = target.followers.includes(currentId);

    if (alreadyFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(targetId, { $pull: { followers: currentId } });
      await User.findByIdAndUpdate(currentId, { $pull: { following: targetId } });
      return res.json({ success: true, message: 'Unfollowed successfully', following: false });
    } else {
      // Follow
      await User.findByIdAndUpdate(targetId, { $addToSet: { followers: currentId } });
      await User.findByIdAndUpdate(currentId, { $addToSet: { following: targetId } });
      return res.json({ success: true, message: 'Followed successfully', following: true });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, followUser };
