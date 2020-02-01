let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let auth = require("../../models/auth/index");

passport.use(
  new LocalStrategy(async function(username, password, done) {
    try {
      let user = await auth.findUser(username);
      console.log(user);
      if (password && password === user.password) return done(null, user);
      else return done(new Error("Invalid credentials"), null);
    } catch (error) {
      console.log(error);
    }
  })
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  try {
    let user = await auth.findUserById(id);
    if (user)
      done(null, {
        _id: 1,
        name: "aravind"
      });
  } catch (err) {
    console.log(err);
  }
});

module.exports = passport;
