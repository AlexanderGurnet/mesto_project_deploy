const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/user');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: '7d' });

      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(400).send({ message: 'Неверный запрос' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId).orFail()
    .then((user) => res.send(user))
    .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
};

module.exports.createUser = (req, res) => {
  try {
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
            res.status(400).send({ message: 'Неверный запрос' });
          } else if (err.name === 'MongoError') {
            res.status(409).send({ message: 'Пользователь уже существует' });
          }
        });
    }
  } catch (err) {
    res.status(400).send({ message: 'Неверный запрос' });
  }
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  if (!(name && about)) {
    res.status(400).send({ message: 'Неверный запрос' });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).orFail()
    .then((user) => res.send(user))
    .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(400).send({ message: 'Неверный запрос' });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail()
    .then((user) => res.send(user))
    .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
};
