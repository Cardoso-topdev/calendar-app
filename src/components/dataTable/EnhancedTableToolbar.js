import React, {useCallback, useMemo} from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Toolbar,
    Typography,
    Tooltip
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { tasktypeActions } from '../../actions/tasktypeAction';
import ConfirmModal from '../ConfirmModal';
import { taskActions } from '../../actions/taskAction';
import { examsAction } from '../../actions/examsAction';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    }
}));
  
const EnhancedTableToolbar = (props) => {
    //creat the classes of the toolbar
    const classes = useToolbarStyles();
    //the current selected lists: array of the selected lists'id
    const { numSelected, setSelected, pageIndex, tabValue, setTasks, setIsloading } = props;
    //the boolean to control the on and off state of the confirm modal
    const [open, setOpen] = React.useState(false);
    
    const dispatch = useDispatch();
    /**
     * when the delete button is clicked, it dipatches delete action to the reducer.
     */
    const deleteFn = useCallback(
        () => {
            if(pageIndex === "2") {
              dispatch(tasktypeActions.deleteTasktypes(numSelected))
            }
            if(pageIndex === "1") {
              dispatch(taskActions.deleteTasks(numSelected))
            }
            if(pageIndex === "0") {
              dispatch(examsAction.deleteExams(numSelected))
            }
            if(tabValue !== undefined) {
                setTasks(state => {
                    return state.filter(state => !numSelected.includes(state._id))
                })
                setIsloading(false)
                
            }
        },
        [numSelected, dispatch, pageIndex, tabValue, setTasks, setIsloading],
    )

    const title = useMemo(() => {
        if(pageIndex === '0') return 'Exams'
        if(pageIndex === '1') return 'Tasks'
        if(pageIndex === '2') return 'Task Types'
    }, [pageIndex])
    
    //to open the confirm modal to ask the user's confirmation on the delete action.
    const handleDelete = () => {
        setOpen(true);
    }
    return (
        <>
            <Toolbar
                className={clsx(classes.root, {
                [classes.highlight]: numSelected.length > 0,
                })}
            >
                {numSelected.length > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected.length} selected
                </Typography>
                ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {title}
                </Typography>
                )}
        
                {numSelected.length > 0 ? (
                  // <Tooltip>
                    <IconButton aria-label="deleted" onClick={handleDelete}>
                      <DeleteIcon />
                    </IconButton>
                  // </Tooltip>
                ) : (
                  // <Tooltip>
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
                  // </Tooltip>
                )}
            </Toolbar>
            <ConfirmModal 
                open={ open }
                setOpen={ setOpen }
                deleteFn={ deleteFn }
            />
        </>
    );
};

export default EnhancedTableToolbar;