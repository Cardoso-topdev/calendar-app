import asyncHandler from 'express-async-handler'
import Tasktype from '../models/taskTypeModel.js'

// @desc    Get all Tasktypes
// @route   Get /api/tasktypes/
// @access  Public
const getTasktypes = asyncHandler(async (req, res) => {
  const taskTypes = await Tasktype.find({})
  res.json(taskTypes)
})

// @desc    Get single taskType
// @route   GET /api/tasktypes/:id
// @access  Public
const getTasktypeById = asyncHandler(async (req, res) => {
  const taskType = await Tasktype.findById(req.params.id)
  if (taskType) {
    res.json(taskType)
  } else {
    res.status(404)
    throw new Error('Task Type not found')
  }
})

// @desc    Add Task Type by Admin
// @route   POST /api/tasktypes/create
// @access  Private/Admin
const createTaskType = asyncHandler(async (req, res) => {
  const taskType = new Tasktype({...req.body})
  try {
    const createTasktype = await taskType.save()
    res.status(201).json(createTasktype)
  } catch(err) {
    res.status(404)
    throw new Error(err)
  }
})

// @desc    Update Task Type by Admin
// @route   PUT /api/tasktype/:id
// @access  Private/Admin
const updateTaskType = asyncHandler(async (req, res) => {
  const { id } = req.params
  const {
    name
  } = req.body

  const taskType = await Tasktype.findById(id)

  if(taskType) {
    taskType.name = name
    const updateTaskType = await taskType.save()
    res.status(201).json(updateTaskType)
  } else {
    res.status(404)
    throw new Error('Task Type not found')
  }
})

// @desc    delete SubCategory by Admin
// @route   delete /api/tasktypes/:id
// @access  Private/Admin
const deleteTaskType = asyncHandler(async (req, res) => {
  const { body } = req
  try {
    await Tasktype.deleteMany({_id: { $in: body.id}})
    res.status(201).json({ message: 'Task Type Removed' })
  } catch(e) {
    res.status(404)
    throw new Error('Task Type Not Found')
  }
})

export {
  getTasktypes,
  getTasktypeById,
  createTaskType,
  updateTaskType,
  deleteTaskType
}