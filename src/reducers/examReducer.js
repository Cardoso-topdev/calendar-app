import { hashById } from '../helper/utils'

import {
  RECEIVE_EVENTS,
  RECEIVE_EXAMS,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  EXAMS_FAIL,
  EXAMS_REQUEST,
  EXAMS_GET_SUCCESS,
  EXAMS_CREATE_SUCCESS,
  EXAMS_UPDATE_SUCCESS,
  EXAMS_DELETE_SUCCESS,
  messageActionTypes
 } from '../helper/constants'

const initialState = {
  isLoading : false,
  exams     : []
}

export const examsReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXAMS_REQUEST:
      return { ...state, isLoading: true }
    case EXAMS_GET_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        exams: action.payload 
      }
    case EXAMS_CREATE_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        exams: state.exams.concat(action.payload)
      }
    case EXAMS_UPDATE_SUCCESS:
      const newState = [...state.exams]
      let updated_index = newState.findIndex(state => state._id === action.payload._id)
      newState[updated_index] = action.payload;
      return { 
        ...state,
        isLoading: false, 
        exams: newState 
      }
    case EXAMS_DELETE_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        exams: state.exams.filter(exam => !action.payload.includes(exam._id))
      }

    case EXAMS_FAIL:
      return { 
        ...state,
        isLoading: false,
        error: action.payload
       }
    default:
      return state
  }
}
