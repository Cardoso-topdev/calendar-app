import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import passport from 'passport'
import cron from 'node-cron'
import connectDB from './server/config/db.js'
import userRoutes from './server/routes/userRoutes.js'
import tasksRoutes from './server/routes/tasksRoutes.js'
import tasktypeRoutes from './server/routes/tasktypeRoutes.js'
import scheduleRoutes from './server/routes/scheduleRoutes.js'
import examRoutes from './server/routes/examRoutes.js'
import { notFound, errorHandler } from './server/middleware/errorMiddleware.js'
import { emailReminder } from './server/controllers/scheduleController.js'
dotenv.config()
connectDB()

const app = express()
app.use(passport.initialize());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/tasktypes', tasktypeRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/schedules', scheduleRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
} 

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

cron.schedule('0 12 * * *', () => {
  console.log("Cron job working...")
  emailReminder()
});

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)