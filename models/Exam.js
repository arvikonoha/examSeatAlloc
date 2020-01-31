const mongoose = require('mongoose')

const ExamSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  students:[
    {
      name: {
        type:String,
        required: true
      },
      usn: {
        type: String,
        required: true,
      },
      room: {
        type: String,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    required: true
  }
})

const Exam = module.exports = mongoose.model('Exam',ExamSchema)