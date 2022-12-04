require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');
const CentralizedErrorHandler = require('./middlewares/CentralizedErrorHandler');
const { MongoUrlDev } = require('./utils/constants');

const { PORT, MONGO_URL, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MongoUrlDev);

const app = express();
app.use(cors({
  exposedHeaders: '*',
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(CentralizedErrorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${NODE_ENV === 'production' ? PORT : 3000}`);
});
