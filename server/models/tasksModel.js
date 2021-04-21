import mongoose from 'mongoose';

/**
 * Exam Schema
 */
const TasksSchema = mongoose.Schema({
  taskType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tasktype'
  },
  name: String,
  spinTime: Number,
  time: Number
})

const Tasks = mongoose.model('Task', TasksSchema)
export default Tasks
