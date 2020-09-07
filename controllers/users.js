const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/user');
const UnathorizedError = require('../errors/UnathorizedError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, (process.env.JWT_KEY || 'dev-key'), { expiresIn: '7d' });

      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .end();
    })
    .orFail(() => new UnathorizedError('Введите логин или пароль'))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!validator.matches(password, /[a-zA-Z0-9*]{8,15}/gi)) {
    res.status(400).send({ message: 'Поле password может содержать символы: *, a-z, A-Z, 0-9.' });
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email, password: hash, name, about, avatar,
      }))
      .then((user) => res.send({ name: user.name, about: user.about, email: user.email }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Неверный запрос'));
        } else if (err.name === 'MongoError') {
          next(new ConflictError('Пользователь уже существует'));
        }
      });
  }
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  if (!(name && about)) {
    throw new BadRequestError('Неверный запрос');
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new BadRequestError('Неверный запрос');
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};
