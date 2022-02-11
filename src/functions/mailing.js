const {User, Wishlist} = require('../../db/models');
const MailController = require("../controllers/emailController/email.controller");
const messageTemplate = require('../helpers/messageTemplate');

const ownerToggleStatusWish = async (wish, user_id) => {
  try {
    if(user_id) {
      const user = await User.findOne({where:{id:user_id}})

      const html = messageTemplate(
        `Владелец подарка ${wish.title} отметил его как подаренный`,
        `Если вы ещё не успели его подарить, возможно он передумал.
         Уведомляем, что теперь вы не сможете увидеть его в разделе "Я дарю"
        `,
        `/`,
        'Выбрать другой'
      )

      MailController.sendEmail(user.email, "Изменение статуса подарка, который вы дарите", html)

    } else {
      const group = await wish.getGroup()
      if(group) { 
        const users = await group.getUsers()
         if(users.length) {
          const emails = users.map(user => user.email)

          const html = messageTemplate(
            `Владелец подарка ${wish.title} отметил его как подаренный`,
            `Если вы ещё не успели его подарить, возможно он передумал.
             Группа автоматически расформирована.
            `,
            `/`,
            'Выбрать другой'
          )

          MailController.sendEmail(emails, "Изменение статуса подарка, который вы дарите", html)

          group.destroy()
         }
      }
    } 
  } catch (err) {
    console.log(err)
  }
}

const giverToggleStatusWish = async (id) => {
  try {
    const {User:{email}} = await Wishlist.findOne({where:{id}, include:{model:User}})
    
    const html = messageTemplate(
      `Владелец подарка ${wish.title} отметил его как подаренный`,
      `Один из ваших подарков отмечен пользователем как подаренный
        Если Вам ничего не дарили, возможно это произошло по ошибке.
        Проверить и при необходимости восстановить подарок вы можете в личном кабинете во вкладке "Мне подарили".
      `,
      `/profile`,
      'Проверить в личном кабинете'
    )

    MailController.sendEmail(email, "Изменение статуса подарка из списка", html)

  } catch(err) {
    console.log(err)
  }
}

module.exports = {
  ownerToggleStatusWish,
  giverToggleStatusWish
}
