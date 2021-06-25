import {
  SCHEDULE_REQUEST,
  SCHEDULE_SET_SUCCESS, 
  SCHEDULE_GET_SUCCESS, 
  SCHEDULE_FAIL
} from '../helper/constants'

const initialState = {
  isLoading : false,
  schedules     : []
}

export const scheduleReducer = (state = initialState, action) => {
  switch(action.type) {
    case SCHEDULE_REQUEST:
      return { ...initialState, isLoading: true }
    case SCHEDULE_SET_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        schedules: action.payload 
      }
    case SCHEDULE_FAIL:
      return { 
        ...state,
        isLoading: false,
        error: action.payload
       }
    default:
      return state
  }
}