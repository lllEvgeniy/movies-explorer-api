const router = require('express').Router();
const { updateUserValidation } = require('../middlewares/validation');
const {
  updateUser, currentUser,
} = require('../controllers/users');

router.get('/me', currentUser);

router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
