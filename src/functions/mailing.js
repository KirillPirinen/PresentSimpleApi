const {User, Wishlist} = require('../../db/models');
const MailController = require("../controllers/emailController/email.controller")

const ownerToggleStatusWish = async (wish, user_id) => {
  try {
    if(user_id) {
      const user = await User.findOne({where:{id:user_id}})
      // MailController.sendEmail(user.email, 
      //   "Изменение статуса подарка, который вы дарите", 
      //   `<p>Владелец подарка ${wish.title} отметил его как подаренный</p>
      //    <p>Если вы ещё не успели его подарить, возможно он передумал</p>
      //    <p>Уведомляем, что теперь вы не сможете увидеть его в разделе "Я дарю"</p>
      //   `)
    } else {
      const group = await wish.getGroup()
      if(group) { 
        const users = await group.getUsers()
         if(users.length) {
          const emails = users.map(user => user.email)
          // MailController.sendEmail(emails, 
          //   "Изменение статуса подарка, который вы дарите", 
          //   `<p>Владелец подарка ${wish.title} отметил его как подаренный</p>
          //    <p>Если вы ещё не успели его подарить, возможно он передумал</p>
          //    <p>Группа автоматически расформирована.</p>
          //   `)
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
    
    // MailController.sendEmail(email, 
    //         "Изменение статуса подарка из списка", 
    //         `<p>Один из ваших подарков отмечен пользователем как подаренный</p>
    //          <p>Если Вам ничего не дарили, возможно это произошло по ошибке.</p>
    //          <p>Проверить и при необходимости восстановить подарок вы можете в личном кабинете во вкладке "Мне подарили"</p>
    //         `)

  } catch(err) {
    console.log(err)
  }
}

module.exports = {
  ownerToggleStatusWish,
  giverToggleStatusWish
}
