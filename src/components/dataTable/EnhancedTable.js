import React, { useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  TableRow,
  Checkbox
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';


/**
 * 
 * @param {object} a  
 * @param {object} b 
 * @param {string} orderBy 
 * a, b: the subsequent objects of the certain array to be sorted
 * orderBy: the item by which an array is going to be sorted
 */
const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * 
 * @param {array} feedData the array of the given links
 * @param {fn} onUpdateClick update callback to be passed to the link table
 */
const createData = (feedData, onUpdateClick) => {
  if (feedData && feedData.length > 0 && feedData[0].chapterNum) {
    feedData.sort((a, b) => a.chapterNum - b.chapterNum)
  }
  return feedData && feedData.map((type) => {
    //action part is an icon for an update
    return {
      ...type,
      action: <IconButton onClick={() => onUpdateClick(type._id)}>
        <EditIcon />
      </IconButton>
    }
  })
};

/**
 * 
 * @param {string} order 
 * @param {string} orderBy 
 * to return a callback to sort the data
 */
const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
    '& .link-url': {
      '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline'
      }
    }
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
}));

const EnhancedTable = ({ setOpen, setIsAdd, feedData, pageIndex, tabValue, setTasks, setIsloading }) => {
  const navigate = useNavigate()
  /**
   * 
   * @param {number} id
   * when the user clicks the update button, it triggers the update modal. 
   */
  const onUpdateClick = useCallback((id) => {
    if (pageIndex === '0') {
      navigate(`/admin/exams/edit `, { state: { id: id } })
    } else {
      setIsAdd({ isAdd: false, id: id });
      setOpen(true);
    }
  }, [setIsAdd, setOpen, pageIndex, navigate])

  const classes = useStyles();
  /**
   * get the currnet links state and dispatch function from the redux store
   */

  // const dispatch = useDispatch();
  /**
   * create the data for the data table from the current links data
   */
  const { taskTypes } = useSelector(state => state.taskTypes)
  let filteredTaskTypes = taskTypes.filter( (item, idx) => (idx !== 1) )
  // console.log("taskTypes: ", filteredTaskTypes, feedData, tabValue)
  if (tabValue !== undefined) {
    feedData = feedData.filter(data => data.taskType === filteredTaskTypes[tabValue]._id)
  }
  const rows = useMemo(() => createData(feedData, onUpdateClick), [feedData, onUpdateClick]);

  const getTasktypeName = useCallback((id) => {
    const seletedType = filteredTaskTypes.filter(type => type._id === id)
    return seletedType[0] && seletedType[0].name
  }, [filteredTaskTypes])
  /**
   * set the initial order type(as an initail, descending type)
   * 
   */
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('count');
  /**
   * the array of selected link's id
   */
  const [selected, setSelected] = React.useState([]);
  /**
   * 
   * @param {*} property 
   */
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  /**
   * 
   * @param {javascript event} event 
   * callback to control the state when all the links are selected
   */
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  /**
   * 
   * @param {id} id
   * when the user checks the links, its index is included in the selected arrray. 
   */
  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <div className={classes.root}>
      {
        rows.length > 0 &&
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected} setSelected={setSelected} pageIndex={pageIndex} setTasks={setTasks} tabValue={tabValue} setIsloading={setIsloading} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rows={rows}
                tabValue={tabValue}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id + '_' + index}
                        selected={isItemSelected}
                      >
                        <TableCell
                          padding="checkbox"
                          onClick={(event) => handleClick(row._id)}
                        >
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell align="center">{index + 1}</TableCell>
                        {
                          Object.entries(row).map(item => {
                            if (item[0] === '_id' || item[0] === '__v' || item[0] === 'tasks' || item[0] === 'videos') return null
                            if ( tabValue === 1 && (item[0] === 'spinTime' || item[0] === 'time' || item[0] === 'chapterNum')) return null
                            if (item[0] === 'taskType') {
                              return (
                                <TableCell align="center" key={item[0]}>{getTasktypeName(item[1])}</TableCell>
                              )
                            } else if (item[0] === 'chapterNum' && (filteredTaskTypes[tabValue].name !== "Test Assignment")) {
                              return (
                                <TableCell align="center" key={item[0]}>{filteredTaskTypes[tabValue].name.includes('video') ? `Video ${item[1]}` : `Chapter ${item[1]}`}</TableCell>
                              )
                            } else {
                              return (
                                <TableCell align="center" key={item[0]}>{item[1]}</TableCell>
                              )
                            }
                          })
                        }
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      }
    </div>
  );
}

export default EnhancedTable;