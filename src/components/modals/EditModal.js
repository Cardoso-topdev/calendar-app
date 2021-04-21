import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
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
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

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

const modalDescription = ['exam', 'task', 'task type'];

/**
 * 
 * @param {*} param0 
 */
const EditModal = ({open, setOpen, isAdd: flag, feedData, pageIndex}) => {
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
    let initData = ''
    
    /**
     * When it is an update modal, the initial states for link, comment and tags should be
     * the ones of the link to be updated
     */
    if(!isAdd) {
        initData = feedData[feedData.findIndex(datum => datum._id === id)].name;
    }
    //set the initial states of name
    const [data, setData] = useState(initData);
    // const [comment, setComment] = useState(initComment);
    // const { tags } = useSelector(state => state.tags);
    const dispatch = useDispatch();

    /**
     * callbacks to monitor the change of the links, comment and tags
     */
    const onChangeData = useCallback(
        (e) => {
            setData(e.target.value);
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
            console.log('called')
            e.preventDefault();
            if(!data) return;
            if(isAdd) {
                //Add a new link
                dispatch(tasktypeActions.addTasktypes({name: data}));
            } else {
                //update the selected link
                dispatch(tasktypeActions.updateTasktypes({_id: id, name : data}));
            }
            handleClose();
        },
        [data, dispatch, handleClose, id, isAdd],
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
                          <FormControl className={classes.formControl}>
                              <TextValidator 
                                  label={modalDescription[Number(pageIndex)]}
                                  name={modalDescription[Number(pageIndex)]}
                                  variant="outlined"
                                  value={data}
                                  className={classes.validatorForm}
                                  onChange={onChangeData}
                                  validators={['required']}
                                  errorMessages={['This field is required']}
                              />
                          </FormControl>
                        </ValidatorForm>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" color="primary" variant="contained" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </DialogActions>
            </Dialog>
        </div>
    )
}

export default EditModal;
