const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/Not-found-err');
const ImpossibleDelete = require('../errors/Impossible-to-delete');
const {
  ERROR_MESSAGE,
} = require('../utils/constants');

const getMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
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
        return next(new BadRequest(ERROR_MESSAGE.CREATE_MOVIES_ERROR));
      }
      return next(err);
    });
};

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_MOVIESID);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ImpossibleDelete(ERROR_MESSAGE.IMPOSSIBLE_TO_DEL);
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then((removeMovie) => res.send(removeMovie));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest(ERROR_MESSAGE.INCORRECT_MOVIESID));
      }
      return next(err);
    });
};

module.exports = {
  deleteMovieById,
  createMovie,
  getMovie,
};
