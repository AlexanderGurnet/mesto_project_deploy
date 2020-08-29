const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(400).send({ message: 'Неверный запрос' }));
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail()
    .then((card) => {
      if (String(card.owner) !== String(req.user._id)) {
        res.status(403).send({ message: 'Вы не можете удалить карточку' });
      } else {
        Card.deleteOne(card)
          .then((deletedCard) => res.send(deletedCard));
      }
    })
    .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверный запрос' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
};
