import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles  } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import EnhancedTable from '../../components/dataTable/EnhancedTable';
import { tasktypeActions } from '../../actions/tasktypeAction';
import EditModal from '../../components/modals/EditModal';

const useStyles = makeStyles((theme) => ({
  root: {
      display: 'flex',
      marginTop: theme.spacing(2)
  }
}));

const TasktypesPage = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { taskTypes } = useSelector(state => state.taskTypes)
  //create the open flag state and setState function to control the edit modal
  const [open, setOpen] = React.useState(false);
  //create the flag which decides the modal type of Add or update modal.
  const [isAdd, setIsAdd] = React.useState({isAdd: true});

  //get the current link lists from the store
  
  const handleClickOpen = () => {
    setIsAdd({isAdd: true});
    setOpen(true);
  };

  return (
    <div className={classes.root}>
      <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
      >
        <Button 
            variant="contained" 
            color="secondary"
            onClick={handleClickOpen}
        >
          Add Task Type
        </Button>
        <Grid item sm={12} md={12}>
          <EnhancedTable feedData={taskTypes} setOpen={setOpen} setIsAdd={setIsAdd} pageIndex="2"/>
        </Grid>
      </Grid>
      {
        open &&
        <EditModal feedData={taskTypes} open={open} setOpen={setOpen} isAdd={isAdd} pageIndex="2"/>
      }
    </div>
  )
}

export default TasktypesPage;