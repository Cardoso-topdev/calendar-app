import asyncHandler from 'express-async-handler'
import request from 'request'
import Schedule from '../models/scheduleModel.js'
import Exam from '../models/examModel.js'
import Tasks from '../models/tasksModel.js'
import { dateToString, addDays } from '../utils/lib.js'
import { getHead } from '../../src/helper/utils.js'
import dateformat from 'dateformat'

const setSchedules = asyncHandler(async (req, res) => {
  const {body} = req
  const { 
    username, 
    email, 
    selectedExamId: examId, 
    workDays, 
    workHours, 
    reminder, 
    sync, 
    targetTestDate,
    autoTestDate
  } = body
  let dayIndex = (workDays.filter(day => day.isChecked)).map(day => Number(day.id))
  const dbData = {
    username: username, 
    email,
    selectedExamId: examId,
    workDays,
    reminder,
    sync,
    workHours,
    autoTestDate: autoTestDate,
    targetTestDate: typeof(targetTestDate) === 'string' ? targetTestDate : '',
    startDate: new Date()
  }
  
  try {
    const existingSchedule = await Schedule.findOne({email: email})
    if(!existingSchedule) {
      const schedule = new Schedule({...dbData})
      await schedule.save()
    } else {
      existingSchedule.user = username
      existingSchedule.selectedExamId = examId
      existingSchedule.workDays = workDays
      existingSchedule.reminder = reminder
      existingSchedule.sync = sync
      existingSchedule.workHours = workHours
      existingSchedule.autoTestDate = dbData.autoTestDate
      existingSchedule.targetTestDate = dbData.targetTestDate
      existingSchedule.startDate = dbData.startDate
      await existingSchedule.save()
    }

    const exam = await Exam.findById(examId).populate({
      path: 'tasks',
      populate: [
        {
          path: 'taskType'
        }
      ]
    })
    const videoTasks = await Tasks.find({}).populate({
      path: 'taskType',
      populate: {
        path: 'taskType',
      }
    })

    
    // const 
    const readTasks = exam.tasks 
    let filteredTaskData = []
    let videoChapter = 0;
    
    readTasks.sort((a, b) => {
      let aChapterNum = ( a.taskType.name === "Test Assignment") ? 1000 + a.chapterNum : a.chapterNum
      let bChapterNum = ( b.taskType.name === "Test Assignment") ? 1000 + b.chapterNum : b.chapterNum
      return aChapterNum - bChapterNum
    })

    //to get filtered task array of reading chapters and the relevant videos
    readTasks.forEach(readTask => {
      // to feed the reading chapter first
      if ( readTask.taskType.name !== "Test Assignment")
        filteredTaskData.push(readTask)

      // to feed its relevant videos next
      let videoIndexes = []
      videoIndexes = readTask.videos
      if(videoIndexes.length) {
        videoIndexes.forEach((id, index) => {
          let video = videoTasks.find(video => video._id == id)
          video.chapterNum = ( readTask.taskType.name !== "Test Assignment") ? ++videoChapter : -1
          filteredTaskData.push(video)
        })
      }

    })
    const wholeTime = filteredTaskData.reduce((accu, task) => (task.taskType.name && task.taskType.name === "Test Assignment")? accu : accu + task.time, 0)
    const testAssignDays = filteredTaskData.reduce((accu, task) => (task.taskType.name === "Test Assignment")? ++accu : accu , 0)

    let curTime = new Date()
    let daySchedule = []
    let workHoursPerday = workHours
    let availableDays
    
    if(dbData.autoTestDate) {
      const wholeDays = Math.ceil(wholeTime / workHoursPerday)
      availableDays = []
      let j = 0
  
      while(availableDays.length < (wholeDays + 1 + testAssignDays)) {
        if ( dayIndex.includes(addDays(curTime, j).getDay()))
          availableDays.push(dateToString(addDays(curTime, j)))
        j ++;
      }
    } else {
      let prepDays = Math.ceil((new Date(targetTestDate).getTime() - curTime.getTime()) / (1000 * 3600 * 24));
      availableDays = []
      let i = 0
      
      while(i < prepDays) {
        while(dayIndex.includes(addDays(curTime, i).getDay()) && i < prepDays) {
          availableDays.push(dateToString(addDays(curTime, i)))
          i ++;
        }
        i ++;
      }

      if(availableDays.length === 0) {
        res.status(404)
        throw new Error('No Available Days. Please pick the target test date again')
      }

      workHoursPerday = wholeTime / (availableDays.length - testAssignDays)

      if(workHoursPerday <= 0 || workHoursPerday > (8 * 60)) {
        res.status(404)
        throw new Error('No Available Days. Please pick the target test date again')
      }
    }

    let accumulatedTime = 0
    let curIndex = 0
    let dayScheduleOrder = 0
  
    filteredTaskData.forEach((task, index) => {
      if (task.chapterNum > -1){
        accumulatedTime += task.time
        dayScheduleOrder ++
        if(Math.floor(accumulatedTime) <= Math.floor(workHoursPerday)) {
          daySchedule.push({
            id: task._id,
            title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`, 
            date: availableDays[curIndex],
            time: task.time,
            type: task.taskType.name,
            spinTime: task.spinTime
          })
        } else {
          accumulatedTime -= workHoursPerday
          daySchedule.push({
            id: task._id,
            title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`, 
            date: availableDays[curIndex],
            time: Math.floor(task.time - accumulatedTime),
            type: task.taskType.name,
            spinTime: task.spinTime
          })
          dayScheduleOrder = 1
          curIndex += 1
          daySchedule.push({
            id: task._id,
            title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`, 
            date: availableDays[curIndex],
            time: Math.floor(accumulatedTime),
            type: task.taskType.name,
            spinTime: task.spinTime
          })
        }
      } else {
        curIndex += 1
        daySchedule.push({
          id: task._id,
          title: `${task.name}`, 
          date: availableDays[curIndex],
          time: Math.floor(workHoursPerday),
          type: task.taskType.name,
          spinTime: workHoursPerday
        })
      }
    })

    res.status(201).json(daySchedule)

  } catch(error) {
    res.status(404)
    throw new Error(error)
  }

})

// schedule: [
//   {
//     id: 606c053831603d2748d579c2,
//     title: '1 - Chapter 1 Futures  Forwards',
//     date: '2021-04-20',
//     time: 38,
//     type: 'Read chapter and take chapter test',
//     spinTime: 15
//   },

const emailReminder = async () => {
  const reminderSchedules = await Schedule.find({reminder: true})
  if ( reminderSchedules.length === 0)
    return
  
  let today = new Date()
  today = dateformat(today, 'yyyy-mm-dd');

  reminderSchedules.forEach(async scheduleItem => {
    let result = await getScheduleData(scheduleItem.email)
    let bSend = false
    let sendContent = "You have to study these materials today. \n"
    result.schedule.forEach( materialItem => {
      if ( today === materialItem.date){
        bSend = true
        sendContent += "title: " + materialItem.title + "(" + materialItem.time + " min)" + "\n"
      }
    })
    if ( bSend) {
      request.post({ headers: {
        'content-type' : 'application/json',
        'Authorization' : 'Bearer SG.VtB5V1sqR8S6a9Q1O5dqqw.ssMEEtsEMqMnNWqMOFAXwlFMue8KYsCa9INd-ZaoVzs'
      }
      , url: "https://api.sendgrid.com/v3/mail/send", json:{
      personalizations: [
          {
              to: [
                  {
                      email: scheduleItem.email,
                      name: scheduleItem.name
                  }
              ],
              subject: "Study materials"
          }
        ],
        content: [
            {
                type: "text/plain",
                value: sendContent
            }
        ],
        from: {
            email: "sales@securitiesce.com",
            name: "Calendar App"
        }
      } }
      , function(error, response, body){
      }); 
    }
  });
}

const getScheduleData = async (email) => {
  try {
    const existingSchedule = await Schedule.findOne({email: email})

    if(!existingSchedule) {
      res.status(404)
      throw new Error('No saved schedule')
    }
    let dayIndex = (existingSchedule.workDays.filter(day => day.isChecked)).map(day => Number(day.id))

    const exam = await Exam.findById(existingSchedule.selectedExamId).populate({
      path: 'tasks',
      populate: {
        path: 'taskType',
      }
    })

    const videoTasks = await Tasks.find({}).populate({
      path: 'taskType',
      populate: {
        path: 'taskType',
      }
    })


    // const 
    const readTasks = exam.tasks
    let filteredTaskData = []
    let videoChapter = 0;
  
    readTasks.sort((a, b) => {
      let aChapterNum = ( a.taskType.name === "Test Assignment") ? 1000 + a.chapterNum : a.chapterNum
      let bChapterNum = ( b.taskType.name === "Test Assignment") ? 1000 + b.chapterNum : b.chapterNum
      return aChapterNum - bChapterNum
    })
    //to get filtered task array of reading chapters and the relevant videos
    readTasks.forEach(readTask => {
      // to feed the reading chapter first
      if ( readTask.taskType.name !== "Test Assignment")
        filteredTaskData.push(readTask)

      // to feed its relevant videos next
      let videoIndexes = []
      videoIndexes = readTask.videos
      if(videoIndexes.length) {
        videoIndexes.forEach((id, index) => {
          let video = videoTasks.find(video => video._id == id)
          video.chapterNum = ( readTask.taskType.name !== "Test Assignment") ? ++videoChapter : -1
          filteredTaskData.push(video)
        })
      }

    })
  
    const wholeTime = filteredTaskData.reduce((accu, task) => (task.taskType.name && task.taskType.name === "Test Assignment")? accu : accu + task.time, 0)
    const testAssignDays = filteredTaskData.reduce((accu, task) => (task.taskType.name === "Test Assignment")? ++accu : accu , 0)

    let curTime = existingSchedule.startDate
    let daySchedule = []
    let workHoursPerday = existingSchedule.workHours
    let availableDays

    if(existingSchedule.autoTestDate) {
      const wholeDays = Math.ceil(wholeTime / workHoursPerday)
      availableDays = []
      let j = 0
  
      while(availableDays.length < (wholeDays + 1 + testAssignDays)) {
        if ( dayIndex.includes(addDays(curTime, j).getDay()))
          availableDays.push(dateToString(addDays(curTime, j)))
        j ++;
      }
    } else {
      let prepDays = Math.ceil((new Date(existingSchedule.targetTestDate).getTime() - curTime.getTime()) / (1000 * 3600 * 24));
      availableDays = []
      let i = 0
      
      while(i < prepDays) {
        while(dayIndex.includes(addDays(curTime, i).getDay()) && i < prepDays) {
          availableDays.push(dateToString(addDays(curTime, i)))
          i ++;
        }
        i ++;
      }
      
      if(availableDays.length === 0) {
        res.status(404);
        throw new Error('No Available Days. Please pick the target test date again')
      }

      workHoursPerday = wholeTime / (availableDays.length - testAssignDays)

      if(workHoursPerday <= 0 || workHoursPerday > (8 * 60)) {
        res.status(404)
        throw new Error('No Available Days. Please pick the target test date again')
      }

    }

    let accumulatedTime = 0
    let curIndex = 0
    let dayScheduleOrder = 0

    filteredTaskData.forEach((task, index) => {
      if (task.chapterNum > -1){
        accumulatedTime += task.time
        dayScheduleOrder ++
        if(Math.floor(accumulatedTime) <= Math.floor(workHoursPerday)) {
          daySchedule.push({
            id: task._id,
            title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`, 
            date: availableDays[curIndex],
            time: task.time,
            type: task.taskType.name,
            spinTime: task.spinTime
          })
        } else {
          accumulatedTime -= workHoursPerday
          daySchedule.push({
            id: task._id,
            title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`, 
            date: availableDays[curIndex],
            time: Math.floor(task.time - accumulatedTime),
            type: task.taskType.name,
            spinTime: task.spinTime
          })
          dayScheduleOrder = 1
          curIndex += 1
          daySchedule.push({
            id: task._id,
            title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`, 
            date: availableDays[curIndex],
            time: Math.floor(accumulatedTime),
            type: task.taskType.name,
            spinTime: task.spinTime
          })
        }
      } else {
        curIndex += 1
        daySchedule.push({
          id: task._id,
          title: `${task.name}`, 
          date: availableDays[curIndex],
          time: Math.floor(workHoursPerday),
          type: task.taskType.name,
          spinTime: workHoursPerday
        })
      }
    })

    return {
      schedule: daySchedule, 
      userSetting: existingSchedule
    }
  } catch ( error ) {
    return null
  }
}

const getSchedules = asyncHandler(async (req, res) => {
  const { body } = req
  const { email }= body
  let result = await getScheduleData(email);
  if ( result )
    res.status(201).json(result)
  else 
    res.status(404)
})

export {
  emailReminder,
  setSchedules,
  getSchedules
}