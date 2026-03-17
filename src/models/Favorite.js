const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  animeId: {
    type: Number,
    required: true,
  },
  animeTitle: {
    type: String,
    required: true,
  },
  animeCover: {
    type: String,
    default: '',
  },
  animeFormat: {
    type: String,
    default: '',
  },
  animeScore: {
    type: Number,
    default: null,
  },
}, { timestamps: true });

// Prevent duplicate favorites
favoriteSchema.index({ user: 1, animeId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
