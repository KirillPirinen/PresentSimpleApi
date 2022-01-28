const { defaults } = require('pg');
const { User, Form, Present, WishPhoto, Wish, Wishlist, Group } = require('../../db/models');
const appError = require('../Errors/errors');
const {ownerToggleStatusWish, giverToggleStatusWish} = require('../functions/mailing');
const getRange = require('../functions/rangeIdentifier');
const { checkInput } = require('../functions/validateBeforeInsert');
const MailController = require('./emailController/email.controller');

const allUserProfile = async (req, res, next) => {
  const user_id = req.session.user.id;

  try {
    const allWishes = await User.findOne({
      where: { id: user_id },
      attributes: ['name', 'lname', 'email', 'phone', 'createdAt', 'avatar'],
      include: [ { 
        model: Wishlist, include: {
          model: Wish, required: false, include: {
            model: WishPhoto, required: false
          }
        },
        attributes: ['createdAt', 'updatedAt']
      },
      { model: Group },
      { model: Form },
      { model: Present, required:false, where:{isGiven:false}, include: {
        model: Form, attributes: ['name', 'lname']
      } 
    },
      { model: Wish, required:false, where:{isGiven:false}, include: {
        model: Wishlist, include:{
           model: User, attributes: ['name', 'lname']
          }
        }
      }
        ]
    });
    res.json(allWishes);
  } catch (error) {
    next(new Error(error.message))
  }
};

const addNewWish = async (req, res, next) => {
  try {
    Object.setPrototypeOf(req.body, Object.prototype)
    const input = checkInput(req.body, ['title', 'description', 'price'], true);
    
    if(input) {
    const {price, description, title} = input;

    const pricerange_id = getRange(price);

    const user_id = req.session.user.id;

    const wishlist = await Wishlist.findOne({where: {user_id}, attributes:['id']})

    const wishlist_id = wishlist.id
      console.log({
        title,
      description,
      pricerange_id,
      wishlist_id,
      })
    const newWish = await Wish.create({
      title,
      description,
      pricerange_id,
      wishlist_id,
    });

    if(req.file) {
      const image = `uploads/${req.file.filename}`;
      const wish_id = newWish.id;
      const wishPhoto = await WishPhoto.create({ image, wish_id });
      newWish.dataValues.WishPhoto = wishPhoto;
    }

    res.json(newWish);
    } else {
      next(new appError(400, "Не заполнены необходимые поля"));
    }
  } catch (error) {
    next(new Error(error.message))
  }
};

const editWish = async (req, res, next) => {
  Object.setPrototypeOf(req.body, Object.prototype)
  const {id} = checkInput(req.body, ['id'], true)
  const input = checkInput(req.body, ['title', 'description', 'price']);

  try {
    if(input) {
      if(!id) return next(new appError(500, 'Ошибка отправки пакета'))
    
    const pricerange_id = getRange(input.price);

    const updatedWish = await Wish.findOne({where:{id}, include:{model:WishPhoto}})
    if(typeof pricerange_id === 'number') updatedWish.pricerange_id = pricerange_id;
    
    Object.keys(input).forEach(field => {
      updatedWish[field] = input[field]
    })

    await updatedWish.save()

    if(req.file) {
      const image = `uploads/${req.file.filename}`;
      const photo = await WishPhoto.findOrCreate({defaults:{wish_id:id, image}, where: { wish_id:id }})

      if(!photo[1]) {
        photo[0].image = image 
        await photo[0].save()
      }

      updatedWish.dataValues.WishPhoto = photo[0]
    }
    res.json(updatedWish)

    } else if(req.file) {

      const image = `uploads/${req.file.filename}`;
      const photo = await WishPhoto.findOrCreate({defaults:{wish_id:id, image}, where: { wish_id:id }})

      if(!photo[1]) {
        photo[0].image = image 
        await photo[0].save()
      }

      res.status(206).json(photo[0]);

    } else {
      next(new appError(400, "Поля не могут быть пустыми"))
    }
  } catch (error) {
    next(new Error(error.message))
  }
};

const deleteWish = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Wish.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    next(new Error(error.message))
  }
};

const wishToggleStatusByOwner = async (req, res, next) => {
  try {
    const id = req.params.id;
    const wish = await Wish.findOne({ where: { id }})

    const newStatus = !wish.isGiven;

    if(newStatus && wish.isBinded) {
      ownerToggleStatusWish(wish, wish.user_id)
    }

    wish.isGiven = newStatus
    wish.isBinded = false
    wish.user_id = null

    await wish.save()

    res.sendStatus(200)
  } catch (error) {
    next(new Error(error.message))
  }
}

const giveWish = async (req, res, next) => {
  try {
    const [wishlist_id] = await Wish.update({user_id:null, isBinded:false, isGiven:true}, 
      {where:{id:req.params.id}, returning:['wishlist_id']})
      
      giverToggleStatusWish(wishlist_id)

    res.sendStatus(200)
  } catch (err) {
    next(new Error(err.message))
  }
}

const unBindWish = async (req, res, next) => {
  try {
    await Wish.update({user_id:null, isBinded:false}, 
      {where:{id:req.params.id}})
    res.sendStatus(200)
  } catch (err) {
    next(new Error(err.message))
  }
}


module.exports = {
  allUserProfile,
  addNewWish,
  editWish,
  deleteWish,
  wishToggleStatusByOwner,
  unBindWish,
  giveWish
};
