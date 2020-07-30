const cardsRouter = require('express').Router();
const path = require('path');
const util = require('util');
const fs = require('fs');

const filepath = path.join(path.dirname(process.mainModule.filename), './data/cards.json');

cardsRouter.get('/cards', (req, res) => {
  const readFile = util.promisify(fs.readFile);
  readFile(filepath, { encoding: 'utf8' })
    .then((data) => {
      const dataParsed = JSON.parse(data);
      res.send(dataParsed);
    })
    .catch(() => {
      res.status(500);
    });
});

module.exports = cardsRouter;
