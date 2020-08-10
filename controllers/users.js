const User = require('../models/user');

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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
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
