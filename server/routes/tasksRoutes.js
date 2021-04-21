import express from 'express'
import {
  getTasks,
  getTasksById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/tasksController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, admin, getTasks).delete(protect, admin, deleteTask)
router
  .route('/create')
  .post(protect, admin, createTask)
router
  .route('/:id')
  .get(protect, admin, getTasksById)
  .put(protect, admin, updateTask)

export default router
