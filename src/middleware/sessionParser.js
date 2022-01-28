const { SERVER_PORT, COOKIE_SECRET, COOKIE_NAME } = process.env;
const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();
const app = require('../../app.js')
require("dotenv").config();

app.set("cookieName", process.env.COOKIE_NAME);

const sessionParser = session({
  name: app.get("cookieName"),
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1e3 * 86400, // COOKIE'S LIFETIME — 1 DAY
  },
})

module.exports = sessionParser;
