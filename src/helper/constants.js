import PersonIcon from '@material-ui/icons/Person';
import LaptopChromebookIcon from '@material-ui/icons/LaptopChromebook';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SortIcon from '@material-ui/icons/Sort';

export const weeks = [
  {id: 1, value: "Monday",    isChecked: false, workHour: 0, workMin: 0},
  {id: 2, value: "Tuesday",   isChecked: false, workHour: 0, workMin: 0},
  {id: 3, value: "Wednesday", isChecked: false, workHour: 0, workMin: 0},
  {id: 4, value: "Thursday",  isChecked: false, workHour: 0, workMin: 0},
  {id: 5, value: "Friday",    isChecked: false, workHour: 0, workMin: 0},
  {id: 6, value: "Saturday",  isChecked: false, workHour: 0, workMin: 0},
  {id: 0, value: "Sunday",    isChecked: false, workHour: 0, workMin: 0},
]

export const menuLists = [
  // {
  //   name: "Students",
  //   icon: <PersonIcon />,
  //   link: "/admin/students"
  // },
  {
    name: "Exams",
    icon: <LaptopChromebookIcon />,
    link: "/admin/exams"
  },
  {
    name: "Video Tasks",
    icon: <AssignmentIcon />,
    link: "/admin/tasks"
  },
  {
    name: "Task Type",
    icon: <SortIcon />,
    link: "/admin/tasktypes"
  },
]

export const API_URL = '/api'


export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST'
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL'
export const USER_LOGOUT = 'USER_LOGOUT'

export const TASK_TYPES_REQUEST = 'TASK_TYPES_REQUEST'
export const TASK_TYPES_GET_SUCCESS = 'TASK_TYPES_GET_SUCCESS'
export const TASK_TYPES_CREATE_SUCCESS = 'TASK_TYPES_CREATE_SUCCESS'
export const TASK_TYPES_UPDATE_SUCCESS = 'TASK_TYPES_UPDATE_SUCCESS'
export const TASK_TYPES_DELETE_SUCCESS = 'TASK_TYPES_DELETE_SUCCESS'
export const TASK_TYPES_FAIL = 'TASK_TYPES_FAIL'

export const TASKS_REQUEST = 'TASKS_REQUEST'
export const TASKS_GET_SUCCESS = 'TASKS_GET_SUCCESS'
export const TASKS_CREATE_SUCCESS = 'TASKS_CREATE_SUCCESS'
export const TASKS_UPDATE_SUCCESS = 'TASKS_UPDATE_SUCCESS'
export const TASKS_DELETE_SUCCESS = 'TASKS_DELETE_SUCCESS'
export const TASKS_FAIL = 'TASKS_FAIL'

export const EXAMS_REQUEST = 'EXAMS_REQUEST'
export const EXAMS_GET_SUCCESS = 'EXAMS_SUCCESS'
export const EXAMS_CREATE_SUCCESS = 'EXAMS_CREATE_SUCCESS'
export const EXAMS_UPDATE_SUCCESS = 'EXAMS_UPDATE_SUCCESS'
export const EXAMS_DELETE_SUCCESS = 'EXAMS_DELETE_SUCCESS'
export const EXAMS_FAIL = 'EXAMS_FAIL'

export const SCHEDULE_REQUEST = 'SCHEDULE_REQUEST'
export const SCHEDULE_SET_SUCCESS = 'SCHEDULE_SET_SUCCESS'
export const SCHEDULE_GET_SUCCESS = 'SCHEDULE_GET_SUCCESS'
export const SCHEDULE_FAIL = 'SCHEDULE_FAIL'

export const USER_SETTING_SAVE_REQUEST = "USER_SETTING_SAVE_REQUEST"
export const USER_SETTING_GET_REQUEST = "USER_SETTING_GET_REQUEST"

export const messageActionTypes = {
  SET_MESSAGE      : 'SET_MESSAGE',
  CLEAR_MESSAGE    : 'CLEAR_MESSAGE'
}