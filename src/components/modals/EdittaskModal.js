import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
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
import { tasktypeActions } from '../../actions/tasktypeAction';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { taskActions } from '../../actions/taskAction';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

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

const modalDescription = ['exam', 'task', 'task type'];

/**
 * 
 * @param {*} param0 
 */
const EdittaskModal = ({ open, setOpen, isAdd: flag, feedData, pageIndex }) => {
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
  let initTasktype_id = ''

  /**
   * When it is an update modal, the initial states for link, comment and tags should be
   * the ones of the link to be updated
   */
  if (!isAdd) {
    initTaskname = feedData[feedData.findIndex(datum => datum._id === id)].name;
    initSpintime = feedData[feedData.findIndex(datum => datum._id === id)].spinTime || "";
    initTime = feedData[feedData.findIndex(datum => datum._id === id)].time || "";
    initTasktype_id = feedData[feedData.findIndex(datum => datum._id === id)].taskType;
  }
  //set the initial states of name
  const [taskName, setTaskname] = useState(initTaskname);
  const [spinTime, setSpintime] = useState(initSpintime);
  const [time, setTime] = useState(initTime);
  const [taskTypeId, setTasktypeId] = useState(initTasktype_id);
  const dispatch = useDispatch();
  const { taskTypes } = useSelector(state => state.taskTypes)
  const [taskTypeName, setTypeName] = useState("")

  useEffect( () => {
    taskTypes.forEach(item => {
      if ( item._id === taskTypeId){
        setTypeName(item.name)
        console.log(taskTypeName)
      }
    });
  }, [])

  /**
   * callbacks to monitor the change of the links, comment and tags
   */
  const onChangeTaskname = useCallback(
    (e) => {
      setTaskname(e.target.value);
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
      taskTypes.forEach(item => {
        if ( item._id === e.target.value){
          setTypeName(item.name)
        }
      });
    },
    [],
  );

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
      if (!taskName) return;
      if ((taskTypeName === "Test Assignment" ) || (spinTime && time))
        if (isAdd) {
          //Add a new link
          dispatch(taskActions.addTasks({ name: taskName, spinTime, time, taskType: taskTypeId }));
        } else {
          //update the selected link
          dispatch(taskActions.updateTasks({ _id: id, name: taskName, spinTime, time, taskType: taskTypeId }));
        }
      handleClose();
    },
    [dispatch, handleClose, id, isAdd, spinTime, time, taskTypeId, taskName],
  );

  /**
   * title and subheader of the edit modal.
   */
  const title = isAdd ? `Add ${modalDescription[Number(pageIndex)]}` : `Update ${modalDescription[Number(pageIndex)]}`;
  const subheader = isAdd ? `You can submit your new ${modalDescription[Number(pageIndex)]}.` : `You can update your ${modalDescription[Number(pageIndex)]}.`

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
                {taskTypes.map(taskType => (
                  <MenuItem value={taskType._id} key={taskType._id}>{taskType.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <FormControl className={classes.formControl}>
              <TextValidator
                label="Spin Time"
                name="Spin Time"
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
                disabled={taskTypeName === "Test Assignment" ? true : false}
                value={time}
                onChange={onChangeTime}
                className={classes.validatorForm}
                validators={['required', 'isNumber']}
                errorMessages={['This field is required', 'Number is required']}
              />
            </FormControl>
          </ValidatorForm>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Submit
                        </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EdittaskModal;
