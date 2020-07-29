const usersRouter = require('express').Router();
const path = require('path');
const fs = require('fs');

const filapath = path.join(path.dirname(process.mainModule.filename), '/data/users.json');

usersRouter.get('/users', (req, res) => {
  fs.readFile(filapath, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      return null;
    }

    res.send(data);
  });
});

usersRouter.get('/users/:id', (req, res) => {
  fs.readFile(filapath, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      return null;
    }
    const dataParsed = JSON.parse(data);
    const userFound = dataParsed.find((user) => req.params.id === user._id);
    if (userFound) {
      res.send(userFound);
    } else {
      res.status(404);
      res.send({ message: 'Нет пользователя с таким id' });
    }
  });
});

usersRouter.get('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = usersRouter;
