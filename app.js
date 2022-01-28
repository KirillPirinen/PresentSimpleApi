require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
//const logger = require("morgan");
const {COOKIE_SECRET, COOKIE_NAME, PWD, REDISCLOUD_URL, NODE_ENV} = process.env;
//const redis = require("redis");
const session = require("express-session");
//let RedisStore = require("connect-redis")(session);
const FileStore = require('session-file-store')(session);
//let redisClient = redis.createClient( NODE_ENV === 'production' ? {url:REDISCLOUD_URL } : null);

const authRouter = require("./src/routes/auth.router");
const sentFormRouter = require("./src/routes/sentForm.router");
const errorHandler = require("./src/controllers/error.controller");
const formRouter = require("./src/routes/form.router");
const path = require("path");
const wishRouter = require("./src/routes/wishRouter");
const userRouter = require("./src/routes/userRouter");
const presentsRouter = require('./src/routes/presentsRouter');
const groupRouter = require("./src/routes/group.router");
const checkAuth = require('./src/middleware/checkAuth');
const appError = require("./src/Errors/errors");

//app.set("cookieName", 'sid'/*COOKIE_NAME*/);
app.enable('trust proxy')
//app.use(logger("dev"));

app.use(cors({ credentials: true, origin:true }));

app.use(express.json());
app.use(express.static(path.join(PWD, "public")));

//сессии
const sessionParser = session({
  // name: app.get("cookieName"),
  // secret: 'dsdsd'/*COOKIE_SECRET*/,
  // resave: false,
  // saveUninitialized: false,
  // store: new FileStore(), //new RedisStore({ client: redisClient }),
  // cookie: {
  //   secure: false,
  //   httpOnly: true,
  //   maxAge: 1e3 * 86400, // COOKIE'S LIFETIME — 1 DAY
  // },
    secret : 'somesecret',
    store : new FileStore(), // store works fine, sessions are stored
    key : 'sid',
    proxy : true, // add this when behind a reverse proxy, if you need secure cookies
    cookie : {
        secure : true,
        maxAge: 5184000000 // 2 months
    }
})

app.use(sessionParser);

//руты доступные неавторизированным пользователям
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sentform", sentFormRouter);

//приватные руты
app.use("/api/v1/form", checkAuth, formRouter);
app.use("/api/v1/group", checkAuth, groupRouter);
app.use("/api/v1/profile", checkAuth, wishRouter);
app.use('/api/v1/presents', checkAuth, presentsRouter)
app.use('/api/v1/user', checkAuth, userRouter)

//404
app.use((req,res,next)=> {
  next(new appError(404, 'Нет такой страницы'))
})

//обработчик ошибок
app.use(errorHandler);

//app.listen(process.env.SERVER_PORT, () => console.log('started'))
module.exports = {app, sessionParser};

