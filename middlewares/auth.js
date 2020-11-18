const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/UnathorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnathorizedError('Необходима авторизация'));
  } else {
    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
      payload = jwt.verify(token, (process.env.JWT_KEY || 'dev-key'));
    } catch (err) {
      next(new UnathorizedError('Необходима авторизация'));
    }
    req.user = payload;

    next();
  }
};
