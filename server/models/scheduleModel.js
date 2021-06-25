import mongoose from 'mongoose';

const workdaySchema = mongoose.Schema({
  id: Number,
  value: String,
  isChecked: Boolean,
  workHour: Number,
  workMin: Number
})

/**
 * Exam Schema
 */
const ScheduleSchema = mongoose.Schema({
  username: String,
  email: String,
  workDays: [workdaySchema],
  reminder: Boolean,
  sync: Boolean,
  targetTestDate: {
    type: Date,
    required: false
  },
  autoTestDate: Boolean,
  selectedExamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  workHours: Number,
  startDate: Date
})

const Schedule = mongoose.model('Schedule', ScheduleSchema)
export default Schedule
