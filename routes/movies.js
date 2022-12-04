const router = require('express').Router();
const {
  createMovie, getMovie, deleteMovieById,
} = require('../controllers/movies');

const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validation');

router.get('/', getMovie);

router.post('/', createMovieValidation, createMovie);

router.delete('/:movieId', deleteMovieValidation, deleteMovieById);

module.exports = router;
