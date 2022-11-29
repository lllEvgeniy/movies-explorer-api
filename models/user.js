const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

}, {
  versionKey: false,
});

module.exports = mongoose.model('user', userSchema);
