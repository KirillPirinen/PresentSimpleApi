const initiatorMessage = (friendname) => {
 return `<h1>Ура, ваш друг ${friendname} заполнил анкету</h1>
 <p>Список его желаний теперь доступен через поиск по сайту или в вашем личном кабинете</p>
 `
}

const recipientMessage = (recipient) => {
  return `<h1>Ура, кто-то хочет подарить тебе подарок </h1>
  <p>${recipient.name}, пожалуйста заполни анкету, чтобы твои друзья знали что тебе подарить.</p>
  <p>Ссылка на анкету: <a href="http://localhost:3000/sentform/${recipient.id}">ССЫЛКА</a></p>
  <p>Подробнее о нас и о том как это работает ты можешь узнать на нашем сайте <a href="http://localhost:3000">Present Simple</a></p>
  `
 }

module.exports = {
  initiatorMessage,
  recipientMessage
};
