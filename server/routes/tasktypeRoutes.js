import express from 'express'
import {
  getTasktypes,
  getTasktypeById,
  createTaskType,
  updateTaskType,
  deleteTaskType
} from '../controllers/tasktypeController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/').get(protect, admin, getTasktypes).delete(protect, admin, deleteTaskType)
router
  .route('/create')
  .post(protect, admin, createTaskType)
router
  .route('/:id')
  .get(protect, admin, getTasktypeById)
  .put(protect, admin, updateTaskType)

export default router
