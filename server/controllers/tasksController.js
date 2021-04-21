import asyncHandler from 'express-async-handler'
import Tasks from '../models/tasksModel.js'

// @desc    Get all Tasks
// @route   Get /api/tasks/
// @access  Public
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Tasks.find({})
  res.json(tasks)
})

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
const getTasksById = asyncHandler(async (req, res) => {
  const task = await Tasks.findById(req.params.id).populate({
    path: 'taskType',
    populate: {
      path: 'taskType',
    }
  })
  if (task) {
    res.json(task)
  } else {
    res.status(404)
    throw new Error('Task not found')
  }
})

// @desc    Add Task by Admin
// @route   POST /api/task/create
// @access  Private/Admin
const createTask = asyncHandler(async (req, res) => {
  const task = new Tasks({...req.body})
  try {
    const createTask = await (await task.save()).populate({
      path: 'taskType',
      populate: {
        path: 'taskType',
      }
    }) 
    res.status(201).json(createTask)
  } catch(err) {
    res.status(404)
    throw new Error(err)
  }
})

// @desc    Update Task by Admin
// @route   PUT /api/task/:id
// @access  Private/Admin
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params
  const {
    taskType,
    name,
    spinTime,
    time
  } = req.body

  const task = await Tasks.findById(id)

  if(task) {
    task.taskType = taskType
    task.name = name
    task.spinTime = spinTime
    task.time = time
    const updateTask = await (await task.save()).populate({
      path: 'taskType',
      populate: {
        path: 'taskType',
      }
    })
    res.status(201).json(updateTask)
  } else {
    res.status(404)
    throw new Error('Task Type not found')
  }
})

// @desc    delete task by Admin
// @route   delete /api/task/:id
// @access  Private/Admin
const deleteTask = asyncHandler(async (req, res) => {
  const { body } = req

  try {
    await Tasks.deleteMany({_id: { $in: body.id}})
    res.status(201).json({ message: 'Task Removed' })
  } catch(e) {
    res.status(404)
    throw new Error('Task Not Found')
  }
})

export {
  getTasks,
  getTasksById,
  createTask,
  updateTask,
  deleteTask
}