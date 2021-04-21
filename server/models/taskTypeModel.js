import mongoose from 'mongoose'

/**
 * Exam Schema
 */
const TasktypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

const Tasktype = mongoose.model('Tasktype', TasktypeSchema)
export default Tasktype
