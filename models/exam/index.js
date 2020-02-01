const Exam = require("../Schema/Exam");

module.exports.insertExam = async function(examData) {
  return new Promise(async (resolve, reject) => {
    try {
      let isInserted = Exam.updateOne(
        {
          name: examData.name
        },
        examData,
        {
          upsert: true
        }
      );
      if (isInserted) {
        resolve(isInserted);
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.viewAllExams = async function() {
  return new Promise(async (resolve, reject) => {
    try {
      let allExams = await Exam.find({});
      if (allExams) {
        resolve(allExams);
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.findStudentExam = async function(usn, date) {
  return new Promise(async (resolve, reject) => {
    try {
      let studentsData = await Exam.aggregate([
        {
          $match: {
            date: new Date(date)
          }
        },
        {
          $project: {
            students: {
              $filter: {
                input: "$students",
                as: "student",
                cond: {
                  $eq: ["$$student.usn", usn]
                }
              }
            },
            _id: 0
          }
        }
      ]);
      if (studentsData) {
        let [mongoDataArray] = studentsData;
        let { students: actualStudentsArray } = mongoDataArray;
        let [actualStudentData] = actualStudentsArray;
        let { name, room } = actualStudentData;
        resolve({ name, room });
      }
    } catch (err) {
      reject(err);
    }
  });
};
