const messageTemplate = require("../helpers/messageTemplate");

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://easy2give.ru';

const initiatorMessage = (guest) => {
 return messageTemplate(
   `Поздравляем, ваш друг ${guest.name} заполнил анкету`,
   'Список его желаний теперь доступен через поиск по сайту или в вашем личном кабинете',
   `/filledform/${guest.id}`,
   'Перейти в анкету'
   )
}

const recipientMessage = (recipient) => {
  return messageTemplate(
    `Поздравляем, кто-то хочет подарить тебе подарок`,
    `${recipient.name}, пожалуйста заполни анкету, чтобы твои друзья знали что тебе подарить.
    <br/>
    Наш сервис помогает анонимно подобрать подарок выбранному человеку. Больше о нас и как это работает вы можете узнать на нашем сайте <br/>
    <a href="https://easy2give.ru">Easy2Give</a>
    `,
    `/sentform/${recipient.id}`,
    'Перейти в анкету'
    )
 }

 const activationMessage = (uuid) => {
  return messageTemplate(
    `Активируйте свой аккаунт`,
    'Сразу после активации, вы будете авторизированны на сайте.',
    `/activation/${uuid}`,
    'Активировать'
    )
 }

 const googleSighnUp = (password) => {
  return messageTemplate(
    `Ваш временный пароль от сервиса`,
    `Пароль: <strong>${password}</strong>.<br />Измените его как можно скорее, сделать это можно в личном кабинете на сайте.`,
    `/profile`,
    'Изменить пароль'
    )
 }

 const changePassword = (recipient, id) => {
  return messageTemplate(
    `${recipient.name}, Вы отправили запрос на восстановление пароля.`,
    `Для того, чтобы создать новый пароль, перейдите по ссылке нижу и следуйте инструкциям на странице. Ссылка действительна сутки.`,
    `/resetPassword/${id}`,
    'Изменить пароль'
  )
};

module.exports = {
  initiatorMessage,
  recipientMessage,
  activationMessage,
  googleSighnUp,
  changePassword
};
