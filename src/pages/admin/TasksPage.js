import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles  } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import EnhancedTable from '../../components/dataTable/EnhancedTable';
import { taskActions } from '../../actions/taskAction';
import EdittaskModal from '../../components/modals/EdittaskModal';

const useStyles = makeStyles((theme) => ({
  root: {
      display: 'flex',
      marginTop: theme.spacing(2)
  }
}));

const TasksPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch()
  //create the open flag state and setState function to control the edit modal
  const [open, setOpen] = React.useState(false);
  //create the flag which decides the modal type of Add or update modal.
  const [isAdd, setIsAdd] = React.useState({isAdd: true});

  //get the current link lists from the store
  const { tasks } = useSelector(state => state.tasks);
  
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
              Add Task
          </Button>
          <Grid item sm={12} md={12}>
            <EnhancedTable feedData={tasks} setOpen={setOpen} setIsAdd={setIsAdd} pageIndex="1"/>
          </Grid>
      </Grid>
      {
        open &&
        <EdittaskModal 
          feedData={tasks} 
          open={open} 
          setOpen={setOpen} 
          isAdd={isAdd} 
          pageIndex="1"/>
      }
    </div>
  )
}

export default TasksPage;