const router = require('express').Router();
const { body } = require('express-validator');
const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

router.use(protect, apiLimiter);

router.get('/', getFavorites);
router.get('/check/:animeId', checkFavorite);

router.post('/', [
  body('animeId').isNumeric().withMessage('Invalid anime ID'),
  body('animeTitle').trim().notEmpty().withMessage('Anime title is required'),
], validate, addFavorite);

router.delete('/:animeId', removeFavorite);

module.exports = router;
