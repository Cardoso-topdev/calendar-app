import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Sidebar from '../../components/SideBar'
import { examsAction } from '../../actions/examsAction'
import ScheduleModal from '../../components/modals/ScheduleModal'
import { strTohtml } from '../../helper/utils'

const CalendarPage = () => {
  const weekendsVisible = useSelector(state => state.weekendsVisible)
  const dispatch = useDispatch()
  const handleDates = useCallback((rangeInfo) => {
    // dispatch(requestEvents(rangeInfo.startStr, rangeInfo.endStr))
  }, [])
  const { schedules, error } = useSelector(state => state.schedule);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSchedule, setSelectedSchdule] = useState({})
  
  useEffect(() => {
    dispatch(examsAction.getExams())
  }, [dispatch])

  const handleEventClick = useCallback((event) => {
    // setAnchorEl(null)
    // console.log(event.el.innerHTML)
    console.log(event.event)
    const schedule = schedules.filter((schedule) => schedule.id === event.event._def.publicId)
    // console.log(schedule[0])
    schedule[0].title = event.event._def.title 
    schedule[0].time = event.event._def.extendedProps.time 
    setSelectedSchdule(schedule[0])
    setAnchorEl(event.el);
  }, [schedules])

  return (
    <div className='app'>
      <Sidebar />
      <div className='app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          datesSet={handleDates}
          events={schedules}
          eventClick={handleEventClick}
        />
      </div>
      <ScheduleModal 
        selectedSchedule={selectedSchedule} 
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl} />
    </div>
  )
}

export default CalendarPage;

