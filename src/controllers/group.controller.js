const { Group, Sequelize:{Op}, Wish, UserGroup, 
        User, WishPhoto, Wishlist } = require("../../db/models");
const appError = require('../Errors/errors');
const { checkInput } = require("../functions/validateBeforeInsert");

const checkWish = async (req, res, next) => {
  const { wish_id } = req.body;
  try {
    const wish = await Wish.findOne({where:{[Op.and]:[{id:wish_id},{isBinded:false}]}})
    if(wish) {
      res.locals.wish = wish;
      return next()
    } else {
      return res.status(303).json({info:"Извините, кто-то уже забронировал этот подарок. Выберете другой"})
    }
  } catch (err) {
    return next(new Error(err.message))
  }
}

const allWishes = async (req, res, next) => {
  const { user_id } = req.params;
  try{
    const wishes = await Wishlist.findOne({
      where: { user_id },
      attributes:['createdAt', 'updatedAt', 'user_id'],
      include: [
        {model:Wish, required:false, where:{isGiven:false}, include: [{model: Group}, {model:WishPhoto}] }, 
        {model:User, attributes:['name', 'lname', 'avatar']}
      ],
      required: false,
      order: [[Wish, "pricerange_id", "ASC"]],
    });
    if(wishes.user_id === req.session.user.id) return next(new appError(303, 'Просмотр собственных подарков доступен в личном кабинете'))
    res.status(200).json(wishes)
  } catch (err) {
    next(new Error(err.message))
  }
};

const addAlone = async (req, res, next) => {
  try {
    res.locals.wish.isBinded = true
    res.locals.wish.user_id = req.session.user.id
    await res.locals.wish.save()
    return res.status(200).json({info:"Вы успешно забронировали, подарок. Другие пользователи не смогут выбрать его. Если вы захотите выбрать другой подарок, пожалуйста не забудьте убрать данный из планируемых"})
  } catch (error) {
    return next(new Error(error.message));
  }
};

const addGroup = async (req, res, next) => {
  const input = checkInput(req.body, ['maxusers', 'name', 'wish_id'], true)
  if(!input) return next(new appError(400, "Не заполнены необходимые поля"));
  try {
    const group = await Group.create({
      ...input,
      admin_id:req.session.user.id,
      currentusers: 1,
    });

    await UserGroup.create({
      user_id: req.session.user.id,
      group_id: group.id,
    });

    res.locals.wish.isBinded = true

    await res.locals.wish.save()

    return res.status(200).json({ info: "Вы успешно создали группу", group });
  } catch (error) {
    return next(new Error(error.message))
  }
};

const joinGroup = async (req, res, next) => {
  const { wish_id } = req.body;

  try {
    const groupFind = await Group.findOne({ 
      where: { wish_id }, 
      include:{model:User},
    });
    
    if(!groupFind) return next(new appError(403, 'Группа не найдена'))
    else {
      const sameuser = groupFind.Users.find(e=>e.id===req.session.user.id)
      if(sameuser) return next(new appError(403, 'Вы уже вступили в эту группу'))
    }

    if ( (groupFind.currentusers + 1) <= groupFind.maxusers) {

      await Promise.all([
        groupFind.increment('currentusers'),
        UserGroup.create({user_id:req.session.user.id, group_id:groupFind.id})
      ])

      return res.json({info: "Вы успешно вступили в группу"});

    } else {
      next(new appError(403, 'Достигнуто максимальное количество участников'))
    };

  } catch (error) {
    next(new Error(error.message))
  }
};

const getGroupInfo = async (req, res, next) => {
  const {id} = req.params;
  try {

    const group = await Group.findOne({where:{id}, include:[
      {model:User, through:{attributes:[]}, attributes: ['name', 'lname', 'id', 'email', 'avatar'],
      },
      {model:Wish, 
        include:{model:Wishlist, attributes:['id'],
          include:{model:User, attributes:['name', 'lname', 'id', 'email', 'avatar']}
        }
      }
    ]})

    if(group) {
      if(group.Users.some(user => user.id === req.session.user.id)) return res.json(group)
      else return next(new appError(303, 'Вы не состоите в данной группе'))
    } else {
      next(new appError(403, 'Группа не найдена'))
    }

  } catch (error) {
    return next(new Error(error.message));
  }
};

const deleteGroup = async (req, res, next) => {
  if(res.locals.group) {
    const [count] = await Wish.update({isBinded:false},{where:{id:res.locals.group.wish_id}})
    if(count) {
      await res.locals.group.destroy()
    } else {
      return next(new appError(400, 'Не удалось высвободить подарок, отмена удаления группы'))
    }
    return res.json({info:'Группа успешно удалена'})
  } else {
    return next(new appError(400, 'Ощибка удаления группы'))
  }
}

const checkRights = async (req, res, next) => {
  const id = Number(req.params.id);
  try{
    const group = await Group.findOne({where:{id}, 
      include:{model: User,
      as: 'Admin',}})
      if(group?.Admin?.id === req.session.user.id) {
        res.locals.group = group;
        next()
      } else {
        return next(new appError(403, 'Вы не администратор группы'))
      }
  } catch (err) {
    return next(new Error(err.message))
  }

}


const editGroup = async (req, res, next) => {
  const input = checkInput(req.body, ['name', 'admin_id', 'maxusers'])
  if(input) {
    if(res.locals.group) {

    if(input.maxusers && +input.maxusers < +res.locals.group.currentusers ) {
      return next(new appError(403, 'Нельзя установить максимальное количество участников меньше текущего'))
    }

      Object.keys(input).forEach(field => {
        res.locals.group[field] = input[field]
      })

      try {
        await res.locals.group.save()
      } catch (err) {
        return next(new Error(err.message))
      }

      return res.sendStatus(200)
    }
  } else {
    next(new appError(403, 'Вы ничего не изменили'))
  }
}

const leaveGroup = async (req, res, next) => {
  const group_id = req.params.id;
  try {

   await Promise.all([
      UserGroup.destroy({where:{[Op.and]:[{group_id},{user_id:req.session.user.id}]}}),
      Group.decrement("currentusers", {where: {id:group_id}})
    ])

    return res.json({info:'Вы успешно вышли из группы'})
  } catch (err) {
    next(new Error(err.message))
  }
}

module.exports = {
  checkWish,
  addGroup,
  addAlone,
  joinGroup,
  allWishes,
  getGroupInfo,
  deleteGroup,
  editGroup,
  checkRights,
  leaveGroup
};
