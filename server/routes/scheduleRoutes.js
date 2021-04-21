import express from 'express'
import {
  setSchedules,
  getSchedules
} from '../controllers/scheduleController.js'

const router = express.Router()

router.route('/').post(setSchedules) 
router.route('/get').post(getSchedules) 

export default router
