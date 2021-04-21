import {
  TASKS_REQUEST,
  TASKS_GET_SUCCESS,
  TASKS_CREATE_SUCCESS,
  TASKS_UPDATE_SUCCESS,
  TASKS_DELETE_SUCCESS,
  TASKS_FAIL
} from '../helper/constants'

const initialState = {
  isLoading : false,
  tasks     : []
}

export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case TASKS_REQUEST:
      return { ...state, isLoading: true }
    case TASKS_GET_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        tasks: action.payload 
      }
    case TASKS_CREATE_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        tasks: state.tasks.concat(action.payload)
      }
    case TASKS_UPDATE_SUCCESS:
      const newState = [...state.tasks]
      let updated_index = newState.findIndex(state => state._id === action.payload._id)
      newState[updated_index] = action.payload;
      return { 
        ...state,
        isLoading: false, 
        tasks: newState 
      }
    case TASKS_DELETE_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        tasks: state.tasks.filter(type => !action.payload.includes(type._id))
      }
    case TASKS_FAIL:
      return { 
        ...state,
        isLoading: false,
        error: action.payload
       }
    default:
      return state
  }
}
