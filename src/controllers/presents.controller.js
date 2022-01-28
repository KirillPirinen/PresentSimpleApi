const appError = require('../Errors/errors');
const {Form, Present, PriceRange} = require('../../db/models');

module.exports = class PresentsController {
  static checkForm = async (req, res, next) => {
    try{
      const form = await Form.findOne({where:{id:req.params.uuid}})
      if(form?.isActive) {
          res.locals.form = form;
          next()
      } else {
        next(new appError(400, "Анкета не найдена или уже неактивна"))
      }
    } catch (err) {
      next(new Error(err))
    }
  } 
  static getAllPresents = async (req, res, next) => {
    try {
      const rangesWithPresents = await PriceRange.findAll({
        attributes:['id','from','to'],
        order: [['from','ASC']],
        include:{
          model:Present,
          where:{form_id:res.locals.form.id}, 
            include:{
              model:Form,
                attributes:['name','lname','createdAt', 'email', 'phone']
          }}
        })
      if(rangesWithPresents?.length) {
          res.json(rangesWithPresents)
      } else {
        next(new appError(404, "Подарки не найдены"))
      }
      
    } catch (err) {
      next(new Error(err))
    }
  }
  static bindPresent = async (req, res, next) => {
    try {
      await Present.update({user_id:req.session.user.id, isBinded:true}, 
        {where:{id:req.body.id}})
      res.json({info:"Вы успешно забронировали, подарок. Другие пользователи не смогут выбрать его. Если вы захотите выбрать другой подарок, пожалуйста не забудьте убрать данный из планируемых"})
    } catch (err) {
      next(new Error(err))
    }
  }

  static unbindPresent = async (req, res, next) => {
    try {
      await Present.update({user_id:null, isBinded:false}, 
        {where:{id:req.params.id}})
      res.sendStatus(200)
    } catch (err) {
      next(new Error(err))
    }
  }

  static givePresent = async (req, res, next) => {
    try {
      await Present.update({isGiven:true}, 
        {where:{id:req.params.id}})
      res.sendStatus(200)
    } catch (err) {
      next(new Error(err))
    }
  }
  
}



