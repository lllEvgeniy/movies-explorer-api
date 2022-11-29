const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUser, currentUser,
} = require('../controllers/users');

router.get('/me', currentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
  }),
}), updateUser);

module.exports = router;
