const session = require("express-session");

const MongoStore = require("connect-mongo")(session);

module.exports = session({
  secret: "kitty kat",
  resave: "false",
  saveUninitialized: "false",
  store: new MongoStore({
    url:
      "mongodb+srv://arvi:cbaz6173@mycluster-u2rgd.mongodb.net/test?retryWrites=true&w=majority",
    touch: 2 * 60 * 60
  })
});
