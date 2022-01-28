module.exports = class appError extends Error {
  constructor(status, message){
    super();
    this.status = status,
    this.message = message
  }
  static badReq = function () {
    return new appError(400, 'Некорректный запрос');
  }
  static unAuth = function () {
    return new appError(401, 'Неверные данные');
  }
}
