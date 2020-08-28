const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json({ type: 'application/json' }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.get('*', auth, (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
