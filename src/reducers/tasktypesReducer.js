import {
  TASK_TYPES_REQUEST,
  TASK_TYPES_GET_SUCCESS,
  TASK_TYPES_CREATE_SUCCESS,
  TASK_TYPES_UPDATE_SUCCESS,
  TASK_TYPES_DELETE_SUCCESS,
  TASK_TYPES_FAIL,
} from '../helper/constants'

const initialState = {
  isLoading : false,
  taskTypes     : []
}

export const tasktypesReducer = (state = initialState, action) => {
  switch (action.type) {
    case TASK_TYPES_REQUEST:
      return { ...state, isLoading: true }
    case TASK_TYPES_GET_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        taskTypes: action.payload 
      }
    case TASK_TYPES_CREATE_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        taskTypes: state.taskTypes.concat(action.payload)
      }
    case TASK_TYPES_UPDATE_SUCCESS:
      const newState = [...state.taskTypes]
      let updated_index = newState.findIndex(state => state._id === action.payload._id)
      newState[updated_index] = action.payload;
      return { 
        ...state,
        isLoading: false, 
        taskTypes: newState 
      }
    case TASK_TYPES_DELETE_SUCCESS:
      return { 
        ...state,
        isLoading: false, 
        taskTypes: state.taskTypes.filter(type => !action.payload.includes(type._id))
      }
    case TASK_TYPES_FAIL:
      return { 
        ...state,
        isLoading: false,
        error: action.payload
       }
    default:
      return state
  }
}
