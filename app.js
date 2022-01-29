require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const {COOKIE_SECRET, COOKIE_NAME, PWD, NODE_DEV} = process.env;
const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();
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

app.set("cookieName", COOKIE_NAME);
app.use(logger("dev"));
app.set('trust proxy')
app.use(cors({ credentials: true, origin: NODE_DEV ? true : 'https://presentsimple.web.app' }));

app.use(express.json());
app.use(express.static(path.join(PWD, "public")));

//сессии
const sessionParser = session({
  name: app.get("cookieName"),
  secret: COOKIE_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new RedisStore({ client: redisClient }),
  proxy: true,
  cookie: {
    sameSite: NODE_DEV ? 'lax' : 'none',
    secure: NODE_DEV ? false : true,
    httpOnly: true,
    maxAge: 1e3 * 86400,
  },
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

module.exports = {app, sessionParser};

