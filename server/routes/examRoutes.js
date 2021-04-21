import express from 'express'
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam
} from '../controllers/examController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getExams).delete(protect, admin, deleteExam)
router
  .route('/create')
  .post(protect, admin, createExam)
router
  .route('/:id')
  .get(protect, admin, getExamById)
  .put(protect, admin, updateExam)

export default router
