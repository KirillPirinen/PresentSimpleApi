const {User, Sequelize:{Op}} = require('../../db/models');
const appError = require('../Errors/errors');
const { checkInput } = require('../functions/validateBeforeInsert');
const bcrypt = require('bcrypt');
const deleteUploadedFile = require('../functions/deleteFile');

module.exports = class userController {
  static editUserData = async (req, res, next) => {
    try {
      if(req.body.password) {
        const input = checkInput(req.body, ['password'], true)
        if(input) {
          const hashPassword = await bcrypt.hash(input.password, 4);
          await User.update({password:hashPassword}, {where:{id:req.session.user.id}})
          return res.status(202).json({info:'Пароль успешно изменён'})
        }
      } else if (req.file) {

        const avatar = `uploads/${req.file.filename}`;

        const user = await User.findByPk(req.session.user.id)
        
        const prevAvatar = user.avatar
        
        user.avatar = avatar
        
        await user.save()
        
        deleteUploadedFile(prevAvatar)

        return res.json({avatar})

      } else {
        const input = checkInput(req.body, ['name', 'lname', 'email', 'phone', 'password'])
        if(input) {

          if(input.hasOwnProperty('phone')) {
            if(input.phone.length !== 11) return next(new appError(411, "Телефон должен быть длиной 11 символов"));
            if(await User.findOne({where:{ phone: { [Op.like]: `%${input.phone.slice(1)}` }}})) {
              return next(new appError(403, 'Пользователь с таким телефоном уже существует'))
            }
          }

          const user = await User.findByPk(req.session.user.id)
        
          Object.keys(input).forEach(field => {
            user[field] = input[field]
          })
    
          await user.save()
    
          res.json({info:'Изменения успешно внесены'})
    
        } else {
          return next(new appError(403, 'Вы не внесли никаких изменений'))
        }
      }
    } catch (err) {
      return next(new Error(err.message))
    }

  }
}
