const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с id ${cardId} не найдена`);
      }
      if (String(card.owner) !== String(req.user._id)) {
        throw new ForbiddenError('Вы не можете удалить эту карточку');
      } else {
        Card.deleteOne(card)
          .then((deletedCard) => res.send(deletedCard));
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFoundError(`Карточка c _id: ${req.params.cardId} не найдена`))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFoundError(`Карточка c _id: ${req.params.cardId} не найдена`))
    .then((card) => res.send(card))
    .catch(next);
};
