require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');
const CentralizedErrorHandler = require('./middlewares/CentralizedErrorHandler');

const { PORT, MONGO_URL } = process.env;
mongoose.connect(MONGO_URL);
const app = express();
app.use(limiter);
app.use(helmet());
app.use(cors({
  exposedHeaders: '*',
}));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(errorLogger);
app.use(routes);

app.use(errors());
app.use(CentralizedErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
