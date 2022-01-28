const appError = require('../Errors/errors');

const checkAuth = (req, res, next) => {
  if (!req.session.user) {
    return next(new appError(401, 'Доступно только для авторизированных пользователей. Авторизируйтесь или зарегистрируйтесь'))
  } else {
    return next();
  }
};

module.exports = checkAuth;
