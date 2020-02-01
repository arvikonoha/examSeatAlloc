const route = require("express").Router();
const fs = require("fs");
const path = require("path");
const examDb = require("../../models/exam/index");
const examFile = require("../../models/examFile/index");
const upload = require("../../config/multer/index");

route.get("/api/exams", async (req, res) => {
  try {
    let allExams = await examDb.viewAllExams();
    if (allExams) res.json(allExams);
  } catch (error) {
    console.log(error);
  }
});

route.post("/api/exam", upload.single("exam_info"), async (req, res) => {
  try {
    let { name, date } = req.body;
    let examData = { name, date: new Date(date) };

    examData.students = await examFile.convertExamFile(
      path.join("uploads", req.file.filename)
    );
    let isUpdated = await examDb.insertExam(examData);
    if (isUpdated) {
      await fs.unlink(path.join("uploads", req.file.filename), err => {
        if (err) throw err;
        else {
          res.json(isUpdated);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

route.get("/api/exams/usn/:usn/date/:date", async (req, res) => {
  try {
    let { usn, date } = req.params;
    let examData = await examDb.findStudentExam(usn, date);
    if (examData) res.json(examData);
  } catch (error) {
    console.log(error);
  }
});

module.exports = route;
