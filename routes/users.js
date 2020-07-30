const usersRouter = require('express').Router();
const path = require('path');
const util = require('util');
const fs = require('fs');

const filepath = path.join(path.dirname(process.mainModule.filename), '/data/users.json');
const readFile = util.promisify(fs.readFile);

usersRouter.get('/users', (req, res) => {
  readFile(filepath, { encoding: 'utf8' })
    .then((data) => {
      const dataParsed = JSON.parse(data);
      res.send(dataParsed);
    })
    .catch(() => {
      res.status(500);
    });
});

usersRouter.get('/users/:id', (req, res) => {
  readFile(filepath, { encoding: 'utf8' })
    .then((data) => {
      const dataParsed = JSON.parse(data);
      // eslint-disable-next-line no-underscore-dangle
      const userFound = dataParsed.find((user) => req.params.id === user._id);
      if (userFound) {
        res.send(userFound);
      } else {
        res.status(404);
        res.send({ message: 'Нет пользователя с таким id' });
      }
    })
    .catch(() => {
      res.status(500);
    });
});

usersRouter.get('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = usersRouter;
