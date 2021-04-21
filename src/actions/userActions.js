import axios from 'axios'
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  messageActionTypes
} from '../helper/constants'


export const login = (email, password) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    )
     
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    dispatch({
      type: messageActionTypes.SET_MESSAGE,
      payload: {
        message: 'Successfully Signed In',
        success: true
      }
    })


  } catch (error) {
    dispatch({
      type: messageActionTypes.SET_MESSAGE,
      payload:
        { message: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        success: false}
    })
  }
}

export const logout = () => (dispatch, getState) => {
  dispatch({ type: USER_LOGOUT })
  document.location.href = '/signin'
}