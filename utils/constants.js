const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const SERVER_ERROR = 500;
const AUTHORIZATION_ERROR = 401;
const ERROR_MESSAGE = {
  INTERNAL_SERVER_ERROR: 'ошибка по-умолчанию',
  CREATE_USER_ERROR: 'Переданы некорректные данные в методы создания пользователя',
  CREATE_MOVIES_ERROR: 'Переданы некорректные данные в методы создания фильма',
  PATCH_BAD_REQUEST: 'Переданы некорректные данные в методы обновления профиля.',
  NOT_FOUND_USERID: 'Пользователь по данному _id не найден.',
  NOT_FOUND_MOVIESID: 'Фильм по данному _id не найдена',
  INCORRECT_MOVIESID: 'Передан некорректный id фильма',
  ERROR_LOGIN_OR_PASS: 'Неправильные почта или пароль',
  EXIST_EMAIL: 'Данный email уже зарегистрирован',
  IMPOSSIBLE_TO_DEL: 'Невозможно удалить',
  AUTHORIZATION_ERROR: 'Необходима авторизация',
  TOKEN_NOT_FOUND: 'Токен не найден',
};

const MongoUrlDev = 'mongodb://localhost:27017/moviesdb';

const jwtDel = 'Токен удалён';

const regExp = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

module.exports = {
  NOT_FOUND,
  BAD_REQUEST,
  SERVER_ERROR,
  ERROR_MESSAGE,
  AUTHORIZATION_ERROR,
  regExp,
  MongoUrlDev,
  jwtDel,
};
