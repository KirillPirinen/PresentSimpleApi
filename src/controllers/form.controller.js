const { User, Form, Sequelize } = require("../../db/models");
const {Op} = Sequelize;
const {checkInput} = require('../functions/validateBeforeInsert')
const appError = require('../Errors/errors');
const { uuid } = require('uuidv4');

const searchEnd = (req, res, next) => {
    setTimeout(()=>{
      if(res.locals.answer) {
        return res.json(res.locals.answer)
       } else {
        return res.json({info:'Ничего не найдено'})
       }
    }, 5000)
}

const findForms = async (req, res, next) => {
  const {phone, email} = res.locals.input 

  try {
    const formsInDataBase = await Form.findAll({ 
      where: {
        [Op.or]: [
            {email:{[Op.like]:email}},
            {phone:{[Op.like]:`%${phone}`}} 
            ]},
      order: [['isActive','DESC']],
      }); 
      
      if(formsInDataBase.length) {
        res.locals.answer = Object.assign({forms:formsInDataBase}, res.locals.answer || {});
      }  

      next()

  } catch (error) {
    next(new Error(`Ошибка поиска:${error.message}` ))
  }

}

const checkInputsMiddleware = (req, res, next) => {
  const {email, phone} = checkInput(req.body, ['email', 'phone'])

  if(email) {
    res.locals.input = {email}
    res.locals.input.phone = phone ? phone.slice(1) : undefined
    next()

  } else {
    next(new appError(406, 'Вы не ввели данных для поиска'))
  }
}

const findUser = async (req, res, next) => {
    const {phone, email} = res.locals.input    

    try {
      const personInDataBase = await User.findOne({
        attributes: {exclude: ['updatedAt', 'password']}, 
        where: {[Op.or]: [
          {email:{[Op.like]:email}},
          {phone:{[Op.like]:`%${phone}`}} 
          ]}
      });

      if(personInDataBase) {
        res.locals.answer = Object.assign({user:personInDataBase}, res.locals.answer || {});
      }  

      next()
  
    } catch (error) {
      next(new Error(`Ошибка поиска:${error.message}` ))
    }

}

const addNewForm = async (req, res, next) => {
  const input = checkInput(req.body, ['name', 'lname', 'email'], true)
  if (input) {
    if(req.body.phone) input.phone = req.body.phone
    try {
      const form = await Form.create({id:uuid(), ...input, user_id:req.session.user.id});
      return res.json(form);
    } catch (error) {
      next(new Error(`Произошла ошибка добавления:${error.message}`))
    }
  } else {
    next(new appError(400, 'Вы не ввели все необходимые данные для создания анкеты'))
  }
};

const deleteForm = async (req, res, next) => {
  try {
    const id = req.params.uuid;
    await Form.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    next(new Error(error.message))
  }
};

module.exports = {
  findUser,
  addNewForm,
  checkInputsMiddleware,
  findForms,
  searchEnd,
  deleteForm
};
