const route = require("express").Router();
const passport = require("../config/passport/index");

route.get("/login", (req, res) => {
  res.render("login");
});

route.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  function(req, res) {
    console.log("success");
    res.redirect("/");
  }
);

route.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = route;
