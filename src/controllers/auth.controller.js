const bcrypt = require("bcrypt");
const { User, Sequelize, Wishlist, ResetPassword } = require("../../db/models");
const Op = Sequelize.Op;
const { checkInput } = require("../functions/validateBeforeInsert");
const appError = require("../Errors/errors");
const MailController = require("./emailController/email.controller");
const { changePassword } = require("../functions/htmlResetPassword");
const { uuid } = require("uuidv4");
const {OAuth2Client} = require("google-auth-library");
const stringGenerator = require('../functions/stringGenerator')

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID
})

const googleAuth = async (req, res, next) => {

  const { token } = req.body;

  let ticket;

  try {
    ticket = await googleClient.verifyIdToken({
      idToken:token,
      audient: `${process.env.GOOGLE_CLIENT_ID}`,
    });
    ticket = ticket.getPayload()
  } catch(err) {
    return next(new appError(400, `Ошибка Google авторизации ${err.message}`))
  }

    const {email, picture:avatar, given_name:name, family_name:lname} = ticket;
    const personInDataBase = await User.findOne({where:{ email }});

    if(personInDataBase) {

      req.session.user = {
        id: personInDataBase.id,
        name: personInDataBase.name,
        lname: personInDataBase.lname,
      };

      res.json(
        {
          info:`Вы успешно авторизировались с почты ${email}`,
          id:personInDataBase.id,
          name:personInDataBase.name,
          lname:personInDataBase.lname
        }
      )

  } else {
    try {
      const randomPass = stringGenerator(5)
      const hashPassword = await bcrypt.hash(randomPass, 4);
      const newUser = await User.create({
        name,
        lname,
        avatar,
        email,
        password: hashPassword,
      });

      const html = `<p>Ваш пароль врмененный пароль: <b>${randomPass}</b>, просим Вас сменить его как можно скорее</p>`
      await MailController.sendEmail(email, "Ваш пароль от сервиса Present Simple", html)

      const wishlist = await Wishlist.create({user_id:newUser.id})

      req.session.user = {
        id: newUser.id,
        name: newUser.name,
        lname:newUser.lname
      };

      return res.json({
        id: newUser.id, name: newUser.name,
        info:`Вы успешно зарегистрировались с помощью Google аккаунта, на вашу почту ${email} направлен временный пароль, просим Вас изменить его как можно скорее, а также добавить Ваш телефон в свой профиль, так другим пользователям будет проще найти ваш список желаний`
      });
    } catch (error) {
      return next(new appError(404, error.message))
    }
  }
  
}

const signUp = async (req, res, next) => {
  const input = checkInput(
    req.body,
    ["password", "email", "name", "lname"],
    true
  );

  if (input) {
    //если инпут валиден
    input.phone = req.body.phone.slice(1) || null;
    try {
      const personInDataBase = await User.findOne({
        where: {
          [Op.or]: [
            { email: { [Op.like]: input.email } },
            { phone: { [Op.like]: `%${input.phone}` } },
          ],
        },
      });
      //проверка на наличие такого в базе
      if (personInDataBase) {
        const reg = new RegExp(input.phone);
        const coincidence =
          personInDataBase.email === input.email
            ? "c такой почтой"
            : reg.test(personInDataBase.phone)
            ? `с таким телефоном (ваша почта: ${personInDataBase.email})`
            : "с такими данными";
        return res.status(403).json({info:`Пользователь ${coincidence} уже существует авторизируйтесь`})
      }
    } catch (err) {
      return next(new Error(err));
    }
    //создаём пользователя
    if (input.phone && input.phone.length !== 11)
      return next(new appError(411, "Телефон должен быть длиной 11 символов"));
    try {
      let { email, phone, password, lname, name } = input;
      const hashPassword = await bcrypt.hash(password, 4);
      const newUser = await User.create({
        name,
        lname,
        phone,
        email,
        password: hashPassword,
      });

      const wishlist = await Wishlist.create({user_id:newUser.id})

      req.session.user = {
        id: newUser.id,
        name: newUser.name,
        lname: newUser.lname,
      };

      return res.json({
        id: newUser.id, name: newUser.name, lname:newUser.lname
      });

    } catch (error) {
      return next(new appError(404, error.message))
    }
  } else {
    return next(
      new appError(500, "Вы не ввели всех необходимых данных для регистрации")
    );
  }
};

const signIn = async (req, res, next) => {
  const input = checkInput(req.body, ["password", "email"], true);
  if (input) {
    const { email, password } = input;
    try {
      const currentUser = await User.findOne({ where: { email } });
      if (currentUser) {
        if (await bcrypt.compare(password, currentUser.password)) {
          req.session.user = {
            id: currentUser.id,
            name: currentUser.name,
            lname: currentUser.lname,
          };
          return res.json({ id: currentUser.id, name: currentUser.name, lname:currentUser.lname});
        } else {
          next(new appError(401, "Неверный пароль"));
        }
      } else {
        next(new appError(401, "Пользователь не найден"));
      }
    } catch (error) {
      next(new Error(error));
    }
  } else {
    next(new appError(400, "Не заполнены необходимые поля"));
  }
};

const signOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.sendStatus(500);

    res.clearCookie(req.app.get("cookieName"));

    return res.sendStatus(200);
  });
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.session?.user?.id },
      attributes: ["name", "lname", "id", "email", "phone"],
    });
    return res.json(user);
  } catch (error) {
    return res.sendStatus(500);
  }
};

const checkEmail = async (req, res, next) => {
  try {
    const input = checkInput(req.body, ['email'], true)
    if(!input) return next(new appError(403, 'Поле не может быть пустым'))
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return next(new appError(403, 'Пользователя с указанной почтой не существует'))
    } else {
      const link = await ResetPassword.create({ id: uuid(), user_id: user.id });
      const time = 1e3 * 86400;
      const html = changePassword(user, link.id, time);
      
      await MailController.sendEmail(
        user.email,
        "Ссылка для восстановления пароля на Present Simple",
        html
      );

      setTimeout(() => {
        link.destroy();
      }, time);

      return res.json({
        info:
          `Письмо с дальнейшими инструкциями отправлено на электронную почту ${user.email}`,
      });
    }
  } catch (error) {
    return next(new Error(error.message))
  }
};

const ResetPasswordBack = async (req, res, next) => {
  
  if(!req.session.restorePassword) {
    return next(new appError(403, 'Восстановление невозможно. Ссылка устарела или несуществует'))
  }

  const input = checkInput(req.body, ["password"], true);

  if (input.password) {
    //если инпут валиден
    try {
      const hashPassword = await bcrypt.hash(input.password, 4);

      await User.update({password:hashPassword}, {where:{id:req.session.restorePassword}})

      res.clearCookie(req.app.get("cookieName"));

      return res.status(200).json({info:'Пароль успешно изменён'}) 

    } catch (error) {
      return next(new Error(error.message))
    }
  } else {
    return next(new appError(403, 'Поле пароль не можеть быть пустым'))
  }
};

const checkLink = async (req, res, next) => {
  const {uuid} = req.params;
  if(req.session.restorePassword) {
    return res.sendStatus(200)
  } else {
    try {
      const link = await ResetPassword.findOne({where: { id: uuid }});
      if(link) {
        req.session.restorePassword = link.user_id
        res.sendStatus(200)
        link.destroy()
      } else {
        res.clearCookie(req.app.get("cookieName"));
        return next(new appError(403, 'Ссылка неактивна или несуществует'))
      }
    } catch (err) {
      return next(new Error(err.message))
    }
  }
}

module.exports = {
  signIn,
  signOut,
  signUp,
  checkAuth,
  checkEmail,
  ResetPasswordBack,
  googleAuth,
  checkLink
};
