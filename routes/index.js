const router = require('express').Router();
const { signin, signup } = require('../middlewares/validation');
const NotFoundError = require('../errors/Not-found-err');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');

router.post('/signin', signin, login);

router.post('/signup', signup, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Не найдено'));
});

module.exports = router;
