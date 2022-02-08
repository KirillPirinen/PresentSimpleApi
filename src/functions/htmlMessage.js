const host = process.env.NODE_ENV === 'development' ? 'https://easy2give.ru' : 'http://localhost:3000'

const initiatorMessage = (friendname) => {
 return `<h1>Ура, ваш друг ${friendname} заполнил анкету</h1>
 <p>Список его желаний теперь доступен через поиск по сайту или в вашем личном кабинете</p>
 `
}

const recipientMessage = (recipient) => {
  return `<h1>Ура, кто-то хочет подарить тебе подарок </h1>
  <p>${recipient.name}, пожалуйста заполни анкету, чтобы твои друзья знали что тебе подарить.</p>
  <p>Ссылка на анкету: <a href="${host}/sentform/${recipient.id}">ССЫЛКА</a></p>
  <p>Подробнее о нас и о том как это работает ты можешь узнать на нашем сайте <a href="${host}">Present Simple</a></p>
  `
 }

 const activationMessage = (uuid) => {
  return `<h1>Активируйте свой аккаунт</h1>
  <p>Для активации вашего аккаунта перейдите по ссылке: <a href="${host}/api/v1/auth/activation/${uuid}">ССЫЛКА</a></p>
  `
 }

module.exports = {
  initiatorMessage,
  recipientMessage,
  activationMessage
};
