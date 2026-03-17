const Favorite = require('../models/Favorite');

// GET /api/favorites
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: favorites.length, favorites });
  } catch (error) {
    next(error);
  }
};

// POST /api/favorites
const addFavorite = async (req, res, next) => {
  try {
    const { animeId, animeTitle, animeCover, animeFormat, animeScore } = req.body;

    const favorite = await Favorite.create({
      user: req.user._id,
      animeId,
      animeTitle,
      animeCover,
      animeFormat,
      animeScore,
    });

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Anime already in favorites' });
    }
    next(error);
  }
};

// DELETE /api/favorites/:animeId
const removeFavorite = async (req, res, next) => {
  try {
    const deleted = await Favorite.findOneAndDelete({
      user: req.user._id,
      animeId: req.params.animeId,
    });

    if (!deleted) return res.status(404).json({ success: false, message: 'Favorite not found' });

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

// GET /api/favorites/check/:animeId
const checkFavorite = async (req, res, next) => {
  try {
    const fav = await Favorite.findOne({ user: req.user._id, animeId: req.params.animeId });
    res.json({ success: true, isFavorite: !!fav });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };
