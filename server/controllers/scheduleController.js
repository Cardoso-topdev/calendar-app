import asyncHandler from 'express-async-handler'
import request from 'request'
import Schedule from '../models/scheduleModel.js'
import Exam from '../models/examModel.js'
import Tasks from '../models/tasksModel.js'
import {
  dateToString,
  addDays
} from '../utils/lib.js'
import {
  getHead
} from '../../src/helper/utils.js'
import dateformat from 'dateformat'

const setSchedules = asyncHandler(async (req, res) => {
  const {
    body
  } = req
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
    targetTestDate: typeof (targetTestDate) === 'string' ? targetTestDate : '',
    startDate: new Date()
  }
  let finalTestDay
  try {
    const existingSchedule = await Schedule.findOne({
      email: email
    })
    if (!existingSchedule) {
      const schedule = new Schedule({
        ...dbData
      })
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
      populate: [{
        path: 'taskType'
      }]
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
      let aChapterNum = (a.taskType.name === "Test Assignment") ? 1000 + a.chapterNum : a.chapterNum
      let bChapterNum = (b.taskType.name === "Test Assignment") ? 1000 + b.chapterNum : b.chapterNum
      return aChapterNum - bChapterNum
    })

    //to get filtered task array of reading chapters and the relevant videos
    readTasks.forEach(readTask => {
      // to feed the reading chapter first
      if (readTask.taskType.name !== "Test Assignment")
        filteredTaskData.push(readTask)

      // to feed its relevant videos next
      let videoIndexes = []
      videoIndexes = readTask.videos
      if (videoIndexes.length) {
        videoIndexes.forEach((id, index) => {
          let video = videoTasks.find(video => video._id == id)
          video.chapterNum = (readTask.taskType.name !== "Test Assignment") ? ++videoChapter : -1
          filteredTaskData.push(video)
        })
      }

    })
    const wholeTime = filteredTaskData.reduce((accu, task) => (task.taskType.name && task.taskType.name === "Test Assignment") ? accu : accu + task.time, 0)
    const testAssignDays = filteredTaskData.reduce((accu, task) => (task.taskType.name === "Test Assignment") ? ++accu : accu, 0)

    let curTime = new Date()
    let daySchedule = []
    let autoWorkHours
    let availableDays = []

    if (dbData.autoTestDate) {
      let tempTm = 0
      let wholeDayCnt = 0
      let workDayIndex = curTime.getDay() == 6 ? 0 : curTime.getDay() + 1

      while (wholeTime > tempTm) {
        if (workDayIndex >= workDays.length)
          workDayIndex = 0
        if (workDays[workDayIndex].isChecked) {
          tempTm += workDays[workDayIndex].workHour * 60 + Number(workDays[workDayIndex].workMin)
          wholeDayCnt++
        }
        workDayIndex++
      }
      let j = 1

      while (availableDays.length < (wholeDayCnt + 1 + testAssignDays)) {
        if (dayIndex.includes(addDays(curTime, j).getDay())) {
          availableDays.push(dateToString(addDays(curTime, j)))
        }
        j++;
      }
      finalTestDay = dateToString(addDays(curTime, j - 1))
    } else {
      let prepDays = Math.ceil((new Date(targetTestDate).getTime() - curTime.getTime()) / (1000 * 3600 * 24));
      let i = 0

      while (i < prepDays) {
        while (dayIndex.includes(addDays(curTime, i).getDay()) && i < prepDays) {
          availableDays.push(dateToString(addDays(curTime, i)))
          i++;
        }
        i++;
      }
      finalTestDay = dateToString(addDays(curTime, i - 1))

      if (availableDays.length === 0) {
        res.status(404)
        throw new Error('No Available Days. Please pick the target test date again')
      }

      autoWorkHours = wholeTime / (availableDays.length - testAssignDays)

      if (autoWorkHours <= 0 || autoWorkHours > (8 * 60)) {
        res.status(404)
        throw new Error('No Available Days. Please pick the target test date again')
      }
    }

    let accumulatedTime = 0
    let curIndex = 0
    let dayScheduleOrder = 0
    curTime = new Date()
    let tempIdx = curTime.getDay()

    filteredTaskData.forEach((task, index) => {
      let tempHours

      if (dbData.autoTestDate) {
        while (!workDays[tempIdx].isChecked) {
          tempIdx++
          if (tempIdx >= workDays.length) {
            tempIdx = 0
          }
        }
        tempHours = (workDays && workDays[tempIdx]) ? Number(workDays[tempIdx].workHour) * 60 + Number(workDays[tempIdx].workMin) : 0
      } else {
        tempHours = autoWorkHours
      }

      if (task.chapterNum > -1) {
        accumulatedTime += task.time
        dayScheduleOrder++
        if (Math.floor(accumulatedTime) <= Math.floor(tempHours)) {
          daySchedule.push({
            id: task._id,
            title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`,
            date: availableDays[curIndex],
            time: task.time,
            type: task.taskType.name,
            spinTime: task.spinTime
          })
        } else {
          accumulatedTime -= tempHours
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
          tempIdx++
          if (tempIdx >= workDays.length) {
            tempIdx = 0
          }
          while (!workDays[tempIdx].isChecked) {
            tempIdx++
            if (tempIdx >= workDays.length) {
              tempIdx = 0
            }
          }

          if (dbData.autoTestDate) {
            tempHours = (workDays && workDays[tempIdx]) ? Number(workDays[tempIdx].workHour) * 60 + Number(workDays[tempIdx].workMin) : 0
          } else {
            tempHours = autoWorkHours
          }
          if (accumulatedTime > tempHours) {
            daySchedule.push({
              id: task._id,
              title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`,
              date: availableDays[curIndex],
              time: tempHours,
              type: task.taskType.name,
              spinTime: task.spinTime
            })
            dayScheduleOrder = 1
            curIndex += 1
            tempIdx++
            if (tempIdx >= workDays.length) {
              tempIdx = 0
            }
            while (!workDays[tempIdx].isChecked) {
              tempIdx++
              if (tempIdx >= workDays.length) {
                tempIdx = 0
              }
            }

            if (dbData.autoTestDate) {
              tempHours = (workDays && workDays[tempIdx]) ? Number(workDays[tempIdx].workHour) * 60 + Number(workDays[tempIdx].workMin) : 0
            } else {
              tempHours = autoWorkHours
            }

            accumulatedTime -= tempHours
            daySchedule.push({
              id: task._id,
              title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`,
              date: availableDays[curIndex],
              time: Math.floor(accumulatedTime),
              type: task.taskType.name,
              spinTime: task.spinTime
            })
          } else {
            daySchedule.push({
              id: task._id,
              title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`,
              date: availableDays[curIndex],
              time: Math.floor(accumulatedTime),
              type: task.taskType.name,
              spinTime: task.spinTime
            })
          }
        }
      } else {
        curIndex += 1
        daySchedule.push({
          id: task._id,
          title: `${task.name}`,
          date: availableDays[curIndex],
          time: Math.floor(tempHours),
          type: task.taskType.name,
          spinTime: tempHours
        })
      }
    })

    daySchedule.push({
      id: 1,
      title: `Exam Day`,
      date: finalTestDay,
      time: 90,
      type: "Exam Day",
      spinTime: 90
    })
    res.status(201).json(daySchedule)

  } catch (error) {
    res.status(404)
    console.log("error:", error)
    throw new Error(error)
  }

})

const emailReminder = async () => {
  try {
    const reminderSchedules = await Schedule.find({
      reminder: true
    })
    if (reminderSchedules.length === 0)
      return

    let today = new Date()
    today = dateformat(today, 'yyyy-mm-dd');

    reminderSchedules.forEach(async scheduleItem => {
      let result = await getScheduleData(scheduleItem.email)
      let bSend = false
      let sendContent = process.env.EMAIL_SEND_CONTENT
      result.schedule.forEach(materialItem => {
        if (today === materialItem.date) {
          bSend = true
          // sendContent += "title: " + materialItem.title + "(" + materialItem.time + " min)" + "\n"
        }
      })
      if (bSend) {
        console.log("Send mail to " + scheduleItem.email)
        request.post({
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + process.env.SENDGRID_API_KEY
          },
          url: "https://api.sendgrid.com/v3/mail/send",
          json: {
            personalizations: [{
              to: [{
                email: scheduleItem.email,
                name: scheduleItem.name
              }],
              subject: process.env.EMAIL_SEND_SUBJECT
            }],
            content: [{
              type: "text/plain",
              value: sendContent
            }],
            from: {
              email: "sales@securitiesce.com",
              name: "Securities Institute"
            }
          }
        }, function (error, response, body) {
          console.log("send mail error: ", error)
        });
      }
    });
  } catch (error) {
    console.log("error: ", error)
    return null
  }
}

const getScheduleData = async (email) => {
  try {
    const existingSchedule = await Schedule.findOne({
      email: email
    })

    if (!existingSchedule) {
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
    let finalTestDay

    readTasks.sort((a, b) => {
      let aChapterNum = (a.taskType.name === "Test Assignment") ? 1000 + a.chapterNum : a.chapterNum
      let bChapterNum = (b.taskType.name === "Test Assignment") ? 1000 + b.chapterNum : b.chapterNum
      return aChapterNum - bChapterNum
    })
    //to get filtered task array of reading chapters and the relevant videos
    readTasks.forEach(readTask => {
      // to feed the reading chapter first
      if (readTask.taskType.name !== "Test Assignment")
        filteredTaskData.push(readTask)

      // to feed its relevant videos next`
      let videoIndexes = []
      videoIndexes = readTask.videos
      if (videoIndexes.length) {
        videoIndexes.forEach((id, index) => {
          let video = videoTasks.find(video => video._id == id)
          video.chapterNum = (readTask.taskType.name !== "Test Assignment") ? ++videoChapter : -1
          filteredTaskData.push(video)
        })
      }

    })

    const wholeTime = filteredTaskData.reduce((accu, task) => (task.taskType.name && task.taskType.name === "Test Assignment") ? accu : accu + task.time, 0)
    const testAssignDays = filteredTaskData.reduce((accu, task) => (task.taskType.name === "Test Assignment") ? ++accu : accu, 0)

    let curTime = existingSchedule.startDate

    let daySchedule = []
    let autoWorkHours
    let availableDays = []

    if (existingSchedule.autoTestDate) {
      let wholeDays = 0
      let tempTm = 0
      let tempIdx = curTime.getDay() == 6 ? 0 : curTime.getDay() + 1

      while (wholeTime > tempTm) {
        if (tempIdx >= existingSchedule.workDays.length) {
          tempIdx = 0
        }
        if (existingSchedule.workDays[tempIdx].isChecked) {
          tempTm += existingSchedule.workDays[tempIdx].workHour * 60 + existingSchedule.workDays[tempIdx].workMin
          wholeDays++
        }
        tempIdx++
      }
      let j = 1

      while (availableDays.length < (wholeDays + 1 + testAssignDays)) {
        if (dayIndex.includes(addDays(curTime, j).getDay()))
          availableDays.push(dateToString(addDays(curTime, j)))
        j++;
      }
      finalTestDay = dateToString(addDays(curTime, j - 1))
    } else {
      let prepDays = Math.ceil((new Date(existingSchedule.targetTestDate).getTime() - curTime.getTime()) / (1000 * 3600 * 24));
      let i = 0

      while (i < prepDays) {
        while (dayIndex.includes(addDays(curTime, i).getDay()) && i < prepDays) {
          availableDays.push(dateToString(addDays(curTime, i)))
          i++;
        }
        i++;
      }
      finalTestDay = dateToString(addDays(curTime, i - 1))

      if (availableDays.length === 0) {
        res.status(404);
        throw new Error('No Available Days. Please pick the target test date again')
      }

      autoWorkHours = wholeTime / (availableDays.length - testAssignDays)

      if (autoWorkHours <= 0 || autoWorkHours > (8 * 60)) {
        res.status(404)
        throw new Error('No Available Days. Please pick the target test date again')
      }
    }

    let accumulatedTime = 0
    let curIndex = 0
    let dayScheduleOrder = 0
    curTime = new Date()
    let tempIdx = curTime.getDay()

    filteredTaskData.forEach((task, index) => {
      let tempHours

      if (existingSchedule.autoTestDate) {
        while (!existingSchedule.workDays[tempIdx].isChecked) {
          tempIdx++
          if (tempIdx >= existingSchedule.workDays.length) {
            tempIdx = 0
          }
        }
        tempHours = (existingSchedule.workDays && existingSchedule.workDays[tempIdx]) ? existingSchedule.workDays[tempIdx].workHour * 60 + existingSchedule.workDays[tempIdx].workMin : 0
      } else {
        tempHours = autoWorkHours
      }

      if (task.chapterNum > -1) {
        accumulatedTime += task.time
        dayScheduleOrder++
        if (Math.floor(accumulatedTime) <= Math.floor(tempHours)) {
          daySchedule.push({
            id: task._id,
            title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`,
            date: availableDays[curIndex],
            time: task.time,
            type: task.taskType.name,
            spinTime: task.spinTime
          })
        } else {
          accumulatedTime -= tempHours
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
          tempIdx++
          if (tempIdx >= existingSchedule.workDays.length) {
            tempIdx = 0
          }
          while (!existingSchedule.workDays[tempIdx].isChecked) {
            tempIdx++
            if (tempIdx >= existingSchedule.workDays.length) {
              tempIdx = 0
            }
          }

          if (existingSchedule.autoTestDate) {
            tempHours = (existingSchedule.workDays && existingSchedule.workDays[tempIdx]) ? existingSchedule.workDays[tempIdx].workHour * 60 + existingSchedule.workDays[tempIdx].workMin : 0
          } else {
            tempHours = autoWorkHours
          }

          if (accumulatedTime > tempHours) {
            daySchedule.push({
              id: task._id,
              title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`,
              date: availableDays[curIndex],
              time: tempHours,
              type: task.taskType.name,
              spinTime: task.spinTime
            })
            dayScheduleOrder = 1
            curIndex += 1
            tempIdx++
            if (tempIdx >= existingSchedule.workDays.length) {
              tempIdx = 0
            }
            while (!existingSchedule.workDays[tempIdx].isChecked) {
              tempIdx++
              if (tempIdx >= existingSchedule.workDays.length) {
                tempIdx = 0
              }
            }

            if (existingSchedule.autoTestDate) {
              tempHours = (existingSchedule.workDays && existingSchedule.workDays[tempIdx]) ? existingSchedule.workDays[tempIdx].workHour * 60 + existingSchedule.workDays[tempIdx].workMin : 0
            } else {
              tempHours = autoWorkHours
            }

            accumulatedTime -= tempHours
            daySchedule.push({
              id: task._id,
              title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`,
              date: availableDays[curIndex],
              time: Math.floor(accumulatedTime),
              type: task.taskType.name,
              spinTime: task.spinTime
            })
          } else {
            daySchedule.push({
              id: task._id,
              title: `${dayScheduleOrder} - ${getHead(task.taskType)} ${task.chapterNum} ${task.name}`,
              date: availableDays[curIndex],
              time: Math.floor(accumulatedTime),
              type: task.taskType.name,
              spinTime: task.spinTime
            })
          }
        }
      } else {
        curIndex += 1
        daySchedule.push({
          id: task._id,
          title: `${task.name}`,
          date: availableDays[curIndex],
          time: Math.floor(tempHours),
          type: task.taskType.name,
          spinTime: tempHours
        })
      }
    })

    daySchedule.push({
      id: 1,
      title: `Exam Day`,
      date: finalTestDay,
      time: 90,
      type: "Exam Day",
      spinTime: 90
    })

    return {
      schedule: daySchedule,
      userSetting: existingSchedule
    }
  } catch (error) {
    console.log("error: ", error)
    return null
  }
}

const getSchedules = asyncHandler(async (req, res) => {
  const {
    body
  } = req
  const {
    email
  } = body
  let result = await getScheduleData(email);
  if (result)
    res.status(201).json(result)
  else
    res.status(404)
})

export {
  emailReminder,
  setSchedules,
  getSchedules
}