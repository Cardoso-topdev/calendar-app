import {
  USER_SETTING_SAVE_REQUEST
} from '../helper/constants'

const initialState = {
  isLoading : false,
  userSetting     : {}
}

export const userSettingReducer = (state = initialState, action) => {
  switch(action.type) {
    case USER_SETTING_SAVE_REQUEST:
      return { 
        ...state,
        isLoading: false, 
        userSetting: {
          ...state.userSetting,
          ...action.payload
        }
      }
    default:
      return state
  }
}