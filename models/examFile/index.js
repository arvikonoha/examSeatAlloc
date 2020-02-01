const excelToJson = require("convert-excel-to-json");

module.exports.convertExamFile = async function(fileLocation) {
  return new Promise((resolve, reject) => {
    let results = excelToJson({
      sourceFile: fileLocation,
      columnToKey: {
        A: "usn",
        B: "name",
        C: "room"
      },
      sheets: ["sheet1"]
    });

    let { sheet1: examRows } = results;
    let students = [];

    examRows.map(data => {
      let { name, usn, room } = data;
      let student = { name, usn, room };
      students.push(student);
    });

    resolve(students);
  });
};
