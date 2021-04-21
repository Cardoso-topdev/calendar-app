import { useCallback, useEffect, useMemo, useState } from 'react';
// import 'date-fns';
import { useDispatch, useSelector } from 'react-redux'
import { scheduleAction } from '../actions/scheduleActions'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { weeks } from '../helper/constants'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Grid, Typography } from '@material-ui/core';
import { getTimeFromMins, getTimeFromHours } from '../helper/utils'
import LoadModal from './modals/LoadModal';

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'Monda'
  },
  forminput: {
    width: '90%',
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
  select : {
    paddingLeft: 5
  },
  button : {
    margin: 10
  }
}));

const Sidebar = () => {
  const dispatch = useDispatch()
  const { exams } = useSelector((state) => state.exams)
  const { userSetting } = useSelector((state) => state.userSetting);
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  // const [errorText, setErrortext] = useState('');
  const [selectedExamId, setSelectedexamId] = useState('')
  const [availableDays, setAvailabledays] = useState([])
  const [hours, setHours] = useState('');
  const [mins, setMins] = useState('');
  const [testDate, setTestdate] = useState('')
  const [autoTestDate, setautoTestdate] = useState('true')
  const [reminder, setReminder] = useState(userSetting.reminder)
  const [sync, setSync] = useState(userSetting.sync)
  const [submitted, setSubmitted] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const classes = useStyles()
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUsername(userSetting.username ? userSetting.username : '');
    setEmail(userSetting.email ? userSetting.email : '');
    setSelectedexamId(userSetting.selectedExamId ? userSetting.selectedExamId : '');
    setAvailabledays(userSetting.workDays ? userSetting.workDays : weeks);
    setHours(userSetting.workHours ? getTimeFromHours(userSetting.workHours): 0);
    setMins(userSetting.workHours ? getTimeFromMins(userSetting.workHours): 0);
    setTestdate(userSetting.targetTestDate ? new Date(userSetting.targetTestDate) : new Date());
    setautoTestdate(userSetting.autoTestDate ? 'true' : 'false');
    setReminder(userSetting.reminder ? userSetting.reminder : false);
    setSync(userSetting.sync ? userSetting.sync : false);
  }, [userSetting]);

  const handleUsername = useCallback((e) => {
    setSubmitted(false);
    setUsername(e.target.value)
  }, [])

  const wholeSpentTime = useMemo(() => {
    if(selectedExamId === '') return ''
    const selectedExam = exams.filter(exam => exam._id === selectedExamId)
    return selectedExam.length > 0 && selectedExam[0].tasks.reduce((accu, task) => {
      return accu + task.time
    }, 0)
  }, [exams, selectedExamId])


  const handleEmail = useCallback((e) => {
    setEmail(e.target.value)
    setSubmitted(false);
  }, [])

  const formatTime = useCallback((time) => {
    let hrs = Math.floor(time / 60)
    let mins = Math.floor(time % 60)
    let $hrs = hrs > 1 ? 'hours' : (hrs === 0 ? '' : 'hour')
    let $min = 'minutes'
    return `${hrs} ${$hrs} ${mins} ${$min}`
  }, [])

  const handleExamchange = useCallback((e) => {
    setSelectedexamId(e.target.value)
    setSubmitted(false);
  }, [])

  const handleAllChecked = useCallback((event) => {
    let availabledays = availableDays
   
    availabledays.forEach(day => day.isChecked = event.target.checked) 
    setAvailabledays([...availableDays])
    setSubmitted(false);
  }, [availableDays])

  const handleCheckChieldElement = useCallback((event) => {
    let availabledays = availableDays
    availabledays.forEach(day => {
      if (day.value === event.target.value)
        day.isChecked =  event.target.checked
      })
    setAvailabledays([...availableDays])
    setSubmitted(false);
  }, [availableDays])

  const handleTestdate = useCallback((e) => {
    setautoTestdate(e.target.value)
    setSubmitted(false);
  }, [])

  const handleSetDate = useCallback((date) => {
    setTestdate(date)
    setSubmitted(false);
  }, [])
  
  const handleReminder = useCallback((e) => {
    setReminder(e.target.checked)
    setSubmitted(false);
  }, [])

  const handleSync = useCallback((e) => {
    setSync(e.target.checked)
    setSubmitted(false);
  }, [])

  const handleHours = useCallback((e) => {
    setHours(e.target.value)
    setSubmitted(false);
  }, [])
  const handleMins = useCallback((e) => {
    setMins(e.target.value)
    setSubmitted(false);
  }, [])
  
  const loadHandler = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const submitHandler = useCallback((e) => {
    e.preventDefault()
    // let workDays = availableDays.filter(day => day.isChecked);
    // if(!workDays.length) return
    let workHours = Number(hours) * 60 + Number(mins)
    let targetTestDate = testDate
    let auto = autoTestDate === 'true' ? true : false
    let data = {
      username, email, selectedExamId, workDays: availableDays, workHours, reminder, sync, targetTestDate, autoTestDate : auto
    }
    dispatch(scheduleAction.setSchedules(data))
    
    setSubmitted(true)
    
  }, [dispatch, selectedExamId, availableDays, reminder, sync, hours, username, email, autoTestDate, testDate, mins])

  return (
    <div className='app-sidebar'>
      <ValidatorForm onSubmit={submitHandler} className={classes.root}>
        <div className="app-sidebar-logo">
          <a href="https://securitiesce.com">
            <img src="https://securitiesce.com/media/securitiesce_logo.png" alt=""/>
          </a>
        </div>
        <div className="app-sidebar-section">
          <h2>Username</h2>
          <TextValidator 
            id="username" 
            value={username} 
            onChange={handleUsername} 
            className={classes.forminput}
            validators={['required']}
            errorMessages={['This field is required']}
          />
        </div>
        <div className="app-sidebar-section">
          <h2>Email</h2>
          <TextValidator 
            id="email" 
            value={email} 
            onChange={handleEmail} 
            className={classes.forminput}
            validators={['required', 'isEmail']}
            errorMessages={['This field is required', 'Email is not valid']}
          />
        </div>
        <div className='app-sidebar-section'>
          <h2>Exams</h2>
          <FormControl className={classes.forminput}>
            <InputLabel id="demo-simple-select-label"></InputLabel>
            <Select
              className={classes.select}
              required
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedExamId}
              onChange={handleExamchange}
            >
              {exams && exams.map((exam, id) => (
                <MenuItem value={exam._id} key={exam._id}>{ exam.name }</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='app-sidebar-section'>
          <h2>Available Days</h2>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleAllChecked}
                name="checkall"
                color="primary"
              />
            }
            label="Check/Uncheck all"
          />
          <ul>
            {
              availableDays && availableDays.map((day, id) => {
                return (
                  <li key={id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={day.isChecked}
                          onChange={handleCheckChieldElement}
                          value={day.value}
                          color="primary"
                        />
                      }
                      label={day.value}
                    />
                  </li>)
              })
            }
          </ul>
        </div>
        <div className='app-sidebar-section'>
          <h2>Test Date</h2>
          <FormControl component="fieldset">
            <FormLabel component="legend"></FormLabel>
            <RadioGroup aria-label="gender" name="gender1" value={autoTestDate} onChange={handleTestdate} >
              <FormControlLabel value="true" control={<Radio color="primary"/>} label="Auto Test Date" />
              {autoTestDate === 'true' && (
                  <>
                    
                    <div className='app-sidebar-section subsection'>
                      <h2>Hours per day</h2>
                      <Grid container>
                        <Grid item xs={6}>
                          <TextValidator 
                            label="HH"
                            name="HH"
                            value={hours} 
                            onChange={handleHours} 
                            className={classes.forminput}
                            validators={['required', 'isNumber', 'minNumber:0', 'maxNumber:24']}
                            errorMessages={['This field is required', 'Input must be number', 'Invalid Number', 'Invalid Number']}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextValidator
                            label="MM" 
                            name="MM"
                            value={mins} 
                            onChange={handleMins} 
                            className={classes.forminput}
                            validators={['required', 'isNumber', 'minNumber:0', 'maxNumber:59']}
                            errorMessages={['This field is required', 'Input must be number', 'Invalid Number', 'Invalid Number']}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </>
              )}
              <FormControlLabel value="false" control={<Radio color="primary"/>} label="Your Test Date" />
              {autoTestDate === 'false' && (
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    // label="Test Date"
                    value={testDate}
                    onChange={handleSetDate}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    style={{margin: '0 2em'}}
                  />
                  </MuiPickersUtilsProvider>
                </div>
              )}
            </RadioGroup>
          </FormControl>

        </div>
        <div className='app-sidebar-section'>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleReminder}
                checked={reminder}
                name="checkedB"
                color="primary"
              />
            }
            label="Email Reminder"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleSync}
                checked={sync}
                name="checkedB"
                color="primary"
              />
            }
            label="Sync to Google or other calendar"
          />
        </div>
        <div className="app-sidebar-section flex-center">
          <Button variant="contained" color="primary" className={classes.button} disabled={loaded} onClick={loadHandler}>
            Load
          </Button>
          <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={submitted}>
            Schedule
          </Button>
        </div>
      </ValidatorForm>
      <LoadModal 
        open={ open }
        setOpen={ setOpen }
        // loadData={ loadData }
      />
    </div>
  )
}

export default Sidebar;