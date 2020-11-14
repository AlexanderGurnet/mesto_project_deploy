const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const NotFoundError = require('./errors/NotFoundError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json({ type: 'application/json' }));

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
