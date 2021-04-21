import asyncHandler from 'express-async-handler'
import Exam from '../models/examModel.js'

// @desc    Get all Exams
// @route   Get /api/exams/
// @access  Public
const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({})
  res.json(exams)
})

// @desc    Get single exam
// @route   GET /api/exam/:id
// @access  Public
const getExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id).populate({
    path: 'tasks',
    populate: {
      path: 'taskType',
    }
  })
  if (exam) {
    res.json(exam)
  } else {
    res.status(404)
    throw new Error('Exam not found')
  }
})

// @desc    Add Exam by Admin
// @route   POST /api/exam/create
// @access  Private/Admin
const createExam = asyncHandler(async (req, res) => {
  const exam = new Exam({...req.body})
  try {
    const createExam = await exam.save()
    res.status(201).json(createExam)
  } catch(err) {
    res.status(404)
    throw new Error(err)
  }
})

// @desc    Update Exam by Admin
// @route   PUT /api/exam/:id
// @access  Private/Admin
const updateExam = asyncHandler(async (req, res) => {
  const { id } = req.params
  const {
    name,
    tasks
  } = req.body

  console.log(tasks)

  const exam = await Exam.findById(id)

  if(exam) {
    exam.name = name
    exam.tasks = tasks
    console.log(exam)
    const updateTask = await exam.save()
    res.status(201).json(updateTask)
  } else {
    res.status(404)
    throw new Error('Exam not found')
  }
})

// @desc    delete task by Admin
// @route   delete /api/exam/:id
// @access  Private/Admin
const deleteExam = asyncHandler(async (req, res) => {
  const { body } = req

  try {
    await Exam.deleteMany({_id: { $in: body.id}})
    res.status(201).json({ message: 'Exam Removed' })
  } catch(e) {
    res.status(404)
    throw new Error('Exam Not Found')
  }
})

export {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam
}