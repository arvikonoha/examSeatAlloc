const route = require("express").Router()
const Exam = require("../../models/Exam")

route.get("/exams", (req, res) => {
  Exam.find({})
    .then(data => res.json(data))
    .catch(err => console.error(err));
})

module.exports = route