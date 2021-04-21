import { makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ListIcon from '@material-ui/icons/List';
import TitleIcon from '@material-ui/icons/Title';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    marginTop: 10,
    marginBottom: 10,
  },
  typography: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
}));

const ScheduleModal = ({anchorEl, setAnchorEl, selectedSchedule}) => {
  const classes = useStyles()
  const closeModal = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={closeModal}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        className={classes.root}
      >
        <Typography className={classes.typography} variant="h3">
          <TitleIcon />{selectedSchedule.title}
        </Typography>
        <Typography className={classes.typography}>
          <ListIcon /> {selectedSchedule.type}
        </Typography>
        <Typography className={classes.typography}>
          <AccessTimeIcon/> {selectedSchedule.time} mins
        </Typography>
        {/* sfsdf */}
      </Popover>
    </>
  );
}

export default ScheduleModal;