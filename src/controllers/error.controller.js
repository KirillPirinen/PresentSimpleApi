const appError = require('../Errors/errors');

module.exports = function(err, req, res, next) {
  if(err instanceof appError) {
    if(typeof err.status === 'number') res.status(err.status)
    const errors = {error:err.message}
    console.log(errors)
    return res.json(errors)
  }
  return res.status(500).json({error:`Что-то пошло не по плану...  \r\n${err}`})
};
