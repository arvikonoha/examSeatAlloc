const express = require("express");
const app = express();

const passport = require("./config/passport/index");
const mongoose = require("./config/mongo/index");

app.use(require("./config/sessions/index"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  if (!req.user) res.render("login");
  else res.render("index");
});

app.use("/", require("./routes/api/exams"));
app.use("/", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Running Yo"));
