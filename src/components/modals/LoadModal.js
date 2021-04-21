import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Slide
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { scheduleAction } from '../../actions/scheduleActions';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
      '& .content-wrapper' : {
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LoadModal = ({open, setOpen, loadData}) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const { isLoading } = useSelector(state => state.schedule)

    /**
     * delete confirm function
     */
    // const confirm = useCallback(() => {
    //     //When the user confirms to delete the links, the actual delete method triggers
    //     // and then the modal fades
    //     loadData();
    //     setOpen(false);
    // }, [loadData, setOpen]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onChangeEmail = useCallback((e) => {
      setEmail(e.target.value)
    }, [])

    const handleSubmit = useCallback((e) => {
      e.preventDefault()
      if(email === '') return 
      dispatch(scheduleAction.getSchdules(email))
      if(!isLoading) {
        handleClose()
      }
    }, [handleClose, email, dispatch, isLoading])

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                className={classes.root}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Load</DialogTitle>
                <DialogContent className="content-wrapper">
                    <DialogContentText className="subheader">
                        Do you want to load the saved schedule with your email?
                    </DialogContentText>
                    <>
                      <ValidatorForm className={classes.form} onSubmit={handleSubmit}>
                        <FormControl className={classes.formControl}>
                          <TextValidator 
                              label="Email"
                              name="Email"
                              variant="outlined"
                              value={email}
                              className={classes.validatorForm}
                              onChange={onChangeEmail}
                              validators={['required', 'isEmail']}
                              errorMessages={['This field is required', 'Email is required']}
                          />
                        </FormControl>
                      </ValidatorForm>
                    </>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        No
                    </Button>
                    <Button type="submit" onClick={handleSubmit} color="primary" variant="contained">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default LoadModal