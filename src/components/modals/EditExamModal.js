import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import uuid from 'react-uuid'

import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl
} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { taskActions } from '../../actions/taskAction';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import CreatableSelect from 'react-select/creatable';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .content-wrapper': {
      minHeight: '100px',
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: '70%'
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 200,
  },
  validatorForm: {
    width: '100%'
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));

/**
 * 
 * @param {*} param0 
 */
const EditExamModal = ({ open, setOpen, isAdd: flag, feedData, tabValue, setTasks, setIsloading }) => {
  /**
   * isAdd is a boolean that decides whether this modal is for update and add
   * if isAdd is boolean, it is an add modal
   * id: when it is an update modal, id is the id of the link to be updated
   */
  const { isAdd, id } = flag;
  const classes = useStyles();
  /**
   * Initailize the states
   */
  let initTaskname = ''
  let initSpintime = ''
  let initTime = ''
  let initChapterNum = ''
  let initvideoTaskId = ''
  let initVideos = [];

  /**
   * initialize the default value and option values for multiselect
   */
  let defaultVideos = [];
  let optionVideos = [];

  /**
   * When it is an update modal, the initial states for link, comment and tags should be
   * the ones of the link to be updated
   */
  const { tasks } = useSelector(state => state.tasks)
  if (!isAdd) {
    initTaskname = feedData[feedData.findIndex(datum => datum._id === id)].name;
    initSpintime = feedData[feedData.findIndex(datum => datum._id === id)].spinTime;
    initTime = feedData[feedData.findIndex(datum => datum._id === id)].time;
    initChapterNum = feedData[feedData.findIndex(datum => datum._id === id)].chapterNum;
    initvideoTaskId = tasks[tasks.findIndex(task => task.name === initTaskname)] && tasks[tasks.findIndex(task => task.name === initTaskname)]._id;
    initVideos = feedData[feedData.findIndex(datum => datum._id === id)].videos;
  }
  const { taskTypes } = useSelector(state => state.taskTypes)
  let filteredTaskTypes = taskTypes
  //set the initial states of name
  const [taskName, setTaskname] = useState(initTaskname);
  const [videoTaskId, setVideoTaskId] = useState(initvideoTaskId);
  const [chapterNum, setChapterNum] = useState(initChapterNum);
  const [spinTime, setSpintime] = useState(initSpintime);
  const [time, setTime] = useState(initTime);
  const [taskTypeId, setTasktypeId] = useState(filteredTaskTypes[tabValue]._id);
  const [taskTypeName, setTasktypename] = useState(filteredTaskTypes[tabValue].name);
  const [selectedVideos, setSelectedVideos] = useState(initVideos);

  optionVideos = useMemo(() => {
    return tasks && tasks.map(task => ({
      value: task._id,
      label: task.name
    }))
  }, [tasks]);

  const getVideoName = useCallback((value) => {
    const selectedTask = tasks.filter(task => task._id === value)
    return selectedTask[0] && selectedTask[0].name
  }, [tasks])
  /**
   * when it is an update modal, the selected link's tags should be provided as a default
   * tags for the multiselect
   */
  defaultVideos = useMemo(() => {
    return selectedVideos && selectedVideos.map(video => ({
      value: video.value ? video.value : video,
      label: getVideoName(video.value ? video.value : video)
    }))
  }, [selectedVideos, getVideoName]);
  /**
   * callbacks to monitor the change of the links, comment and tags
   */
  const onChangeTaskname = useCallback(
    (e) => {
      setTaskname(e.target.value);
    },
    [],
  );
  const onChangeTask = useCallback(
    (e) => {
      setVideoTaskId(e.target.value);
      const selectedTask = tasks.filter(task => task._id === e.target.value)
      setTaskname(selectedTask[0].name)
      setSpintime(selectedTask[0].spinTime)
      setTime(selectedTask[0].time)
    },
    [tasks],
  );
  const onChangeChapterNum = useCallback(
    (e) => {
      setChapterNum(e.target.value);
    },
    [],
  );
  const onChangeSpintime = useCallback(
    (e) => {
      setSpintime(e.target.value);
    },
    [],
  );
  const onChangeTime = useCallback(
    (e) => {
      setTime(e.target.value);
    },
    [],
  );
  const onChangeTasktype = useCallback(
    (e) => {
      setTasktypeId(e.target.value);
    },
    [],
  );

  const onChangeVideoSetting = useCallback((selectedVideos) => {
    setSelectedVideos(selectedVideos)
  }, [])

  /**
   * callback to control on and off state of the modal
   */
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  /**
   * callback to handle the adding or updating
   */
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let connectedVideos = [];
      //tags to be added or updated for a certain link
      connectedVideos = selectedVideos && selectedVideos.map(video => {
        return video.value
      })
      console.log(taskName)
      if (!taskName) return;
      if ((taskTypeName === "Test Assignment" ) || (spinTime && time))
        if (isAdd) {
          //Add a new link
          setTasks(state => [...state, { name: taskName, spinTime, chapterNum, time, taskType: taskTypeId, videos: connectedVideos }])
          setIsloading(false)
          // dispatch(taskActions.addTasks({name: taskName, spinTime, chapterNum, time, taskType: taskTypeId}));
        } else {
          //update the selected link
          setIsloading(false)
          setTasks(state => {
            const newState = [...state];
            const index = newState.findIndex(state => state._id === id)
            newState[index].name = taskName
            newState[index].spinTime = spinTime
            newState[index].chapterNum = chapterNum
            newState[index].time = time
            newState[index].taskType = taskTypeId
            newState[index].videos = connectedVideos
            return newState
          })
        }
      handleClose();
    },
    [handleClose, id, isAdd, spinTime, time, taskTypeId, setIsloading, taskName, chapterNum, setTasks, selectedVideos],
  );

  /**
   * title and subheader of the edit modal.
   */
  const title = 'Add Task';
  const subheader = isAdd ? `You can submit your new task` : `You can update your task.`

  return (
    <div >
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        className={classes.root}
      >
        <DialogTitle id="max-width-dialog-title">{title}</DialogTitle>
        <DialogContent className="content-wrapper">
          <DialogContentText className="subheader">
            {subheader}
          </DialogContentText>
          <ValidatorForm className={classes.form} onSubmit={handleSubmit}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Task Type</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={taskTypeId}
                onChange={onChangeTasktype}
                label="Task Type"
              >
                {filteredTaskTypes.map(taskType => (
                  <MenuItem disabled value={taskType._id} key={taskType._id}>{taskType.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextValidator
                label={taskTypeName.includes('video') ? 'Video Number' : ((tabValue === 2) ? 'Test Number' : 'Chapter Number') }
                name={taskTypeName.includes('video') ? 'Video Number' : ((tabValue === 2) ? 'Test Number' : 'Chapter Number')}
                variant="outlined"
                value={chapterNum}
                className={classes.validatorForm}
                onChange={onChangeChapterNum}
                validators={['required', 'isNumber']}
                errorMessages={['This field is required', 'Number is required']}
              />
            </FormControl>
            {taskTypeName.includes('video') ? (
              <>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Video Content</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={videoTaskId}
                    onChange={onChangeTask}
                    label="Video Content"
                  >
                    {tasks.map(task => (
                      <MenuItem value={task._id} key={task._id}>{task.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <FormControl className={classes.formControl}>
                  <TextField
                    label="Task Name"
                    name="Task Name"
                    variant="outlined"
                    value={taskName}
                    onChange={onChangeTaskname}
                    required
                  />
                </FormControl>
                {(tabValue !== 2) &&  <><FormControl className={classes.formControl}>
                  <TextValidator
                    label={taskTypeName.includes('video') ? 'Video Spin Time' : 'Number of Pages'}
                    name={taskTypeName.includes('video') ? 'Video Spin Time' : 'Number of Pages'}
                    variant="outlined"
                    value={spinTime}
                    disabled={taskTypeName === "Test Assignment" ? true : false}
                    className={classes.validatorForm}
                    onChange={onChangeSpintime}
                    validators={['required', 'isNumber']}
                    errorMessages={['This field is required', 'Number is required']}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextValidator
                    label="Time"
                    name="Time"
                    variant="outlined"
                    value={time}
                    disabled={taskTypeName === "Test Assignment" ? true : false}
                    className={classes.validatorForm}
                    onChange={onChangeTime}
                    validators={['required', 'isNumber']}
                    errorMessages={['This field is required', 'Number is required']}
                  />
                </FormControl> </>}
                <FormControl className={classes.formControl}>
                  <CreatableSelect
                    isMulti
                    onChange={onChangeVideoSetting}
                    options={optionVideos}
                    defaultValue={defaultVideos}
                  />
                </FormControl>
              </>
            )}
          </ValidatorForm>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            {isAdd ? 'Add' : 'Edit'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EditExamModal;
