import React, { useMemo } from 'react';
import {
    TableHead,
    TableRow,
    Checkbox,
    TableCell,
    TableSortLabel
} from '@material-ui/core';
import { useSelector } from 'react-redux';

/**
 * format the table header
 */
const labelName = {
  taskType: 'Task Type',
  action: 'Edit',
  name: 'Name',
  spinTime: 'Spin Time',
  time: 'Time',
  chapterNum: 'Video Number',
  videos: 'Related Videos'
};

const EnhancedTableHead = (props) => {
  const { 
    classes, 
    onSelectAllClick, 
    order, 
    orderBy, 
    numSelected, 
    rows, 
    onRequestSort,
    tabValue
  } = props;
  const { taskTypes } = useSelector(state => state.taskTypes)
  if(tabValue !== undefined) {
    if(taskTypes[tabValue].name.includes('Read')) {
      labelName.spinTime = 'Number of Pages'
      labelName.chapterNum = 'Chapter Number'
    } else {
      labelName.spinTime = 'Spin Time'
      labelName.chapterNum = 'Video Number'
    }
  }

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headcells = useMemo(() => {
    let head = []; 
    for(let key in rows[0]) {
      if(key === '_id' || key === '__v' || key === 'tasks' || key === 'videos') continue
      if ( (tabValue === 1) && (key === 'spinTime' || key === "time" || key === "chapterNum")) continue
      head.push({
        id: key,
        numeric: false,
        disablePadding: true,
        label: labelName[key]
      })
    }
    return [{id: 'number', numeric: false, disablePadding: true, label: 'No'}, ...head]
  }, [rows])

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
            <Checkbox
                indeterminate={numSelected > 0 && numSelected < rows.length}
                checked={rows.length > 0 && numSelected === rows.length}
                onChange={onSelectAllClick}
                inputProps={{ 'aria-label': 'select all desserts' }}
            />
        </TableCell>
        {headcells.map((headCell) => (
            <TableCell
                key={headCell.id}
                align='center'
                padding={headCell.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
              >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                      ) : null
                  }
              </TableSortLabel>
          </TableCell>
        ))}
        </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;