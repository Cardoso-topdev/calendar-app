import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles  } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import EnhancedTable from '../../components/dataTable/EnhancedTable';
import { useNavigate } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
      display: 'flex',
      marginTop: theme.spacing(2)
  }
}));

const ExamsPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  //create the open flag state and setState function to control the edit modal

  //get the current link lists from the store
  const { exams } = useSelector(state => state.exams);
  const handleClickOpen = useCallback(() => {
    navigate('/admin/exams/edit')
  }, [navigate]);
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
              Add Exam
          </Button>
          <Grid item sm={12} md={12}>
            <EnhancedTable feedData={exams} pageIndex="0"/>
          </Grid>
      </Grid>
    </div>
  )
}

export default ExamsPage;