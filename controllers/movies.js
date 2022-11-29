const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/Not-found-err');
const ImpossibleDelete = require('../errors/Impossible-to-delete');
const {
  ERROR_MESSAGE,
} = require('../utils/constants');

const getMovie = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest(ERROR_MESSAGE.CREATE_CARDS_ERROR));
      }
      return next(err);
    });
};

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CARDSID);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ImpossibleDelete(ERROR_MESSAGE.IMPOSSIBLE_TO_DEL);
      }
      return Movie.findByIdAndRemove(req.params.cardId)
        .then((removeCard) => res.send(removeCard));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest(ERROR_MESSAGE.INCORRECT_CARDSID));
      }
      return next(err);
    });
};

module.exports = {
  deleteMovieById,
  createMovie,
  getMovie,
};
