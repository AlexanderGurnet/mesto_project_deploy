const cardsRouter = require('express').Router();
const path = require('path');
const fs = require('fs');

const filapath = path.join(path.dirname(process.mainModule.filename), '/data/cards.json');

cardsRouter.get('/cards', (req, res) => {
  fs.readFile(filapath, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      return null;
    }

    res.send(data);
  });
});

module.exports = cardsRouter;
