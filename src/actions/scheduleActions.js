
import axios from 'axios'

import {
  API_URL,
  SCHEDULE_REQUEST,
  SCHEDULE_SET_SUCCESS, 
  SCHEDULE_GET_SUCCESS, 
  SCHEDULE_FAIL,
  USER_SETTING_SAVE_REQUEST,
  USER_SETTING_GET_REQUEST,
  messageActionTypes
} from '../helper/constants'

const setSchedules = (eventData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SCHEDULE_REQUEST
    })
    dispatch({
      type: USER_SETTING_SAVE_REQUEST,
      payload: eventData
    })

    const { data } = await axios.post(`${API_URL}/schedules`, eventData)
    dispatch({
      type: SCHEDULE_SET_SUCCESS,
      payload: data
    })
    dispatch({
      type: messageActionTypes.SET_MESSAGE,
      payload: {
        message: 'Successfully Scheduled',
        success: true
      }
    })
  } catch (error) {
    const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message
    dispatch({
      type: messageActionTypes.SET_MESSAGE,
      payload: {
        message,
       success: false
      }
    })
  }
}


const getSchdules = (email) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SCHEDULE_REQUEST
    })

    const { data } = await axios.post(`${API_URL}/schedules/get`, { email })

    dispatch({
      type: SCHEDULE_SET_SUCCESS,
      payload: data.schedule
    })

    dispatch({
      type: messageActionTypes.SET_MESSAGE,
      payload: {
        message: 'Successfully loaded',
        success: true
      }
    })

    dispatch({
      type: USER_SETTING_SAVE_REQUEST,
      payload: data.userSetting
    })
  } catch (error) {
    const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message
      dispatch({
        type: messageActionTypes.SET_MESSAGE,
        payload: {
          message,
          success: false
        }
      })
  }
}

export const scheduleAction = {
  setSchedules,
  getSchdules
}