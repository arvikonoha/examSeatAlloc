const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://arvi:cbaz6173@mycluster-u2rgd.mongodb.net/test?retryWrites=true&w=majority", {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("Mongo connected"))
  .catch(err => console.error(err));

const passport = require("./config/passport/index");
const LocalStrategy = require("passport-local").Strategy;

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// session is used to maintain the state of client on the server-side, it is reccomended to store the state on a database

// resave prevents the resave of state unless some chansges happen, saveUninitialized is false so that state is not saved unless there is some data to save

app.use(
  session({
    secret: "kitty kat",
    resave: "false",
    saveUninitialized: "false",
    store: new MongoStore({
      url: "mongodb+srv://arvi:12345@example-bubfa.mongodb.net/test?retryWrites=true&w=majority",
      touch: 2 * 60 * 60
    })
  })
);

// touch is used to check on user after the given time

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// for extrating data out of req , in the form of json data

app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

let User = mongoose.model(
  "User",
  mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

const Exam = require("./models/Exam");

const excelToJson = require("convert-excel-to-json");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".xls");
  }
});
const upload = multer({
  storage
});

const path = require("path");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  if (req.user === undefined) res.render("login");
  else res.render("index");
});

app.post("/", upload.single("exam_info"), (req, res) => {
  let results = excelToJson({
    sourceFile: path.join(__dirname, "uploads", req.file.filename)
  });
  let fields = [Object.values(results.Sheet1[0])];
  let examData = {};
  examData.name = req.body.name;
  examData.date = new Date(req.body.date);
  examData.students = [];

  let targetData = [...[Object.values(results.Sheet1.slice(1))]];

  targetData.map(dataSet => {
    dataSet.map(data => {
      fields.map(field => {
        let student = {};
        let codeForA = 65;
        field.map(fData => {
          student[fData] = data[String.fromCharCode(codeForA)];
          ++codeForA;
        });
        examData.students.push(student);
      });
    });
  });

  Exam.updateOne({
      name: req.body.name
    }, examData, {
      upsert: true
    })
    .then(data => res.json(data))
    .catch(err => console.error(err));
});

app.get("/usn/:usnId/date/:dateId", (req, res) => {
  Exam.aggregate([
      // Get just the docs that contain a shapes element where color is 'red'
      {
        $match: {
          $and: [{
              "students.usn": req.params.usnId
            },
            {
              date: new Date(req.params.dateId)
            }
          ]
        }
      },
      {
        $project: {
          students: {
            $filter: {
              input: "$students",
              as: "student",
              cond: {
                $eq: ["$$student.usn", req.params.usnId]
              }
            }
          },
          _id: 0
        }
      }
    ])
    .then(data => {
      console.log(data);
      res.json(data[0].students[0]);
    })
    .catch(err => console.error(err));
});

app.use("/", require('./routes/api/exams'));

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  function (req, res) {
    console.log("success");
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Running Yo"));