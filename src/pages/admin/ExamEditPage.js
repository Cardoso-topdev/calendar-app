import { Button, FormControl, TextField, Typography, Grid, useTheme } from '@material-ui/core';
import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { examsAction } from '../../actions/examsAction';
import EnhancedTable from '../../components/dataTable/EnhancedTable';
import SwipeableViews from 'react-swipeable-views';
import EditModal from '../../components/modals/EditModal';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import EditExamModal from '../../components/modals/EditExamModal';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(2)
  },
  title : {
    fontSize: '1.25em'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: '20px 0',
    // width: '100%', 
  },
  examName : {
    width: '30%'
  },
  submitBtn : {
    maxWidth: '150px',
    alignSelf: 'flex-end'
  },
  tabPanel: {
    flexGrow: 1,
    width: '100%',
    marginTop: '15px',
    // backgroundColor: theme.palette.background.paper,
  }
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}


const ExamEditPage = () => {
  const { state } = useLocation()
  const navigate= useNavigate()
  const classes = useStyles()
  const theme = useTheme();
  const { exams } = useSelector(state => state.exams)
  const { taskTypes } = useSelector(state => state.taskTypes)
  const dispatch = useDispatch()
  
  const selectedExam = useMemo(() => {
    if(!state) return null
    const exam_ =  exams.filter(exam => exam._id === state.id)
    return exam_[0]
  }, [state, exams])

  const [ examName, setExamname] = useState(selectedExam ? selectedExam.name : '')
  const [ tasks, setTasks] = useState(selectedExam ? selectedExam.tasks : [])

  const title = useMemo(() => {
    if(!state) return 'Add Exam'
    return 'Edit Exam'
  }, [state])

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsloading] = React.useState(true);
  //create the flag which decides the modal type of Add or update modal.
  const [isAdd, setIsAdd] = React.useState({isAdd: true});

  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  //get the current link lists from the store
  
  const handleClickOpen = () => {
    setIsAdd({isAdd: true});
    setOpen(true);
  };

  const onChangeExamName = useCallback((e) => {
    setExamname(e.target.value)
    setIsloading(false)
  }, [])

  const handleSave = useCallback((e) => {
    e.preventDefault()
    if(!state) {
      dispatch(examsAction.addExam({name: examName, tasks: tasks}))
      navigate('/admin/exams')
      setIsloading(true)
    } else {
      dispatch(examsAction.updateExam({_id: state.id, name: examName, tasks: tasks}))
      setIsloading(true)
    }
  }, [dispatch, examName, tasks, state, navigate])

  return (
    <>
      <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
        {title}
      </Typography>
      <form className={classes.form}>
        <FormControl className={classes.formControl}>
          <TextField 
              label="Exam name"
              name="Exam name"
              variant="outlined"
              value={examName}
              className={classes.examName}
              onChange={onChangeExamName}
              required
          />
        </FormControl>

        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
          className={classes.root}
        >
          <Button 
              variant="contained" 
              color="secondary"
              onClick={handleClickOpen}
          >
            Add Task
          </Button>
          <Grid item sm={12} md={12} className={classes.tabPanel}>
            <AppBar position="static" color="default">
              <Tabs
                value={tabValue}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {
                  taskTypes.filter((item, idx) => (idx !== 1)).map((type, index) => (
                    <Tab label={type.name} {...a11yProps(index)} key={type._id}/>
                  ))
                }
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={tabValue}
              onChangeIndex={handleChangeIndex}
            >
              {
                taskTypes.filter((item, idx) => (idx !== 1)).map((type, index) => (
                  <TabPanel value={tabValue} index={index} key={type._id}>
                    <EnhancedTable 
                      feedData={tasks} 
                      setOpen={setOpen} 
                      setIsAdd={setIsAdd} 
                      tabValue={tabValue} 
                      setTasks={setTasks} 
                      setIsloading={setIsloading}/>
                  </TabPanel>
                ))
              }
            </SwipeableViews>
          </Grid>
        </Grid>
        <Button color="primary" variant="contained" onClick={handleSave} className={classes.submitBtn} disabled={isLoading}>
            Save
        </Button>
      </form>
      {
        open &&
        <EditExamModal feedData={tasks} open={open} setOpen={setOpen} isAdd={isAdd} tabValue={tabValue} setTasks={setTasks} setIsloading={setIsloading}/>
      }
    </>
  )
}

export default ExamEditPage;