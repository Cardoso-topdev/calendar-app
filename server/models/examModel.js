import mongoose from 'mongoose';

// const videoSchema = mongoose.Schema({
//   videoId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Tasks'
//   }
// })
/**
 * Tasks Schema
 */
const TaskSchema = mongoose.Schema({
  taskType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tasktype'
  },
  name: {
    type: String,
    required: true
  },
  videos: {
    type: Array,
    required: false
  },
  spinTime: Number,
  time: Number,
  chapterNum: Number
})

/**
 * Exam Schema
 */
const ExamSchema = mongoose.Schema({
  tasks: [TaskSchema],
  name: String
})

const Exam = mongoose.model('Exam', ExamSchema)
export default Exam
