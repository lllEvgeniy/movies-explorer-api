const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/Not-found-err');
const BadRequest = require('../errors/BadRequest');
const ExistEmail = require('../errors/ExistEmail');
const NoExist = require('../errors/NoExist');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  ERROR_MESSAGE,
  jwtDel,
} = require('../utils/constants');

const currentUser = (req, res, next) => {
  User.findById(
    req.user._id,
  ).orFail(new NotFoundError('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(ERROR_MESSAGE.PATCH_BAD_REQUEST));
      }
      if (err.message === 'NotFound') {
        return next(new NotFoundError(ERROR_MESSAGE.NOT_FOUND_USERID));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new NotFoundError('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ExistEmail(ERROR_MESSAGE.EXIST_EMAIL));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(ERROR_MESSAGE.PATCH_BAD_REQUEST));
      }
      if (err.message === 'NotFound') {
        return next(new NotFoundError(ERROR_MESSAGE.NOT_FOUND_USERID));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NoExist(ERROR_MESSAGE.ERROR_LOGIN_OR_PASS);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoExist(ERROR_MESSAGE.ERROR_LOGIN_OR_PASS);
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.cookie('jwt', token, {
            maxAge: 3600000 * 12 * 7,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ token });
        });
    })
    .catch(next);
};

const logout = async (req, res, next) => {
  if (req.cookies.jwt) {
    await res.clearCookie('jwt');
    return res.send({ message: jwtDel });
  }
  return next(new NotFoundError(ERROR_MESSAGE.TOKEN_NOT_FOUND));
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const newUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      res.send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ExistEmail(ERROR_MESSAGE.EXIST_EMAIL));
      }
      if ((err.name === 'ValidationError')) {
        return next(new BadRequest(ERROR_MESSAGE.PATCH_BAD_REQUEST));
      }
      return next(err);
    });
};

module.exports = {
  login,
  updateUser,
  createUser,
  currentUser,
  logout,
};
