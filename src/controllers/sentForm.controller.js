const {Form, PriceRange, Present, User} = require('../../db/models');
const appError = require('../Errors/errors');
const {validateBeforeInsert} = require('../functions/validateBeforeInsert');
const MailController = require('./emailController/email.controller')
const {initiatorMessage, recipientMessage} = require('../functions/htmlMessage');

module.exports = class SentFormController {
  static checkForm = async (req, res, next) => {
    try{
      const form = await Form.findOne({
        attributes:['id', 'name', 'lname', 'phone', 'email', 'status'],
        where:{id:req.params.uuid}})

      if(form?.status) {
        res.locals.guest = form;
        next()
      } else {
        return next(new appError(410, 'Форма не найдена или уже заполнялась'))
      }
      
    } catch(err) {
        return next(new Error('Неправильный адрес формы или сервер умер'))
    }
  }

   static getPriceRanges = async (req, res, next) => {
    try {
      const ranges = await PriceRange.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        order: [['from','ASC']]})
      if(ranges) {
        const response = {ranges}
        if(res.locals.guest) response.form = res.locals.guest
        return res.json(response)
      } else {
        return next(new appError(false, 'Нет диапазона цен'))
      }
    } catch (err) {
       return next(new Error(err))
    }
  }

  static fillingForm = async (req, res, next) => {
    try{
      const readyToPush = validateBeforeInsert(req.body, res.locals.guest.id)
      if(readyToPush.length) {
        const {length} = await Present.bulkCreate(readyToPush, {returning: ['id']}) 
        await Form.update({status:false, isActive:true}, {where:{id:res.locals.guest.id}})
        
        //уведомляем инициатора
        User.findOne({where:{id:res.locals.guest.user_id}}).then(formInitiator => {
          const html = initiatorMessage(res.locals.guest.name);
          MailController.sendEmail(formInitiator.email, "Отправленная анкета заполнена", html)
        }).catch(err => console.error(err))
        
        res.json({info:`Спасибо! Вы добавили ${length} подарков`})

      } else {
        return next(new appError(403, 'Пожалуйста добавьте хоть один подарок...'))
      }
    } catch(err) {
      return next(new Error(`Ошибка добавления подарков, попробуйте ещё раз ${err.message}`))
    }
  }

  static deliverForm = async (req, res, next) => {
    try {
      //уведомляем одаряемого
        const html = recipientMessage(res.locals.guest);
        const info = await MailController.sendEmail(res.locals.guest.email, "Похоже кто-то хочет подарить тебе подарок", html)
        if(info.hasOwnProperty('accepted')){
          return res.json({info:`Форма успешно отправлена на почтовый ящик ${res.locals.guest.email}`})
        } else {
          return next(new appError(400, `Ошибка отправки на почту ${res.locals.guest.email}, проверьте корректность адреса`))
        }
    } catch(err) {
      return next(new Error(`Ошибка отправки ${err.message}`))
    }
  }
}
