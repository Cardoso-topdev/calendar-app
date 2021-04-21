import axios from 'axios'

import {
  API_URL,
  EXAMS_FAIL,
  EXAMS_REQUEST,
  EXAMS_GET_SUCCESS,
  EXAMS_CREATE_SUCCESS,
  EXAMS_UPDATE_SUCCESS,
  EXAMS_DELETE_SUCCESS
} from '../helper/constants'

import { logout } from './userActions'

const getExams = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: EXAMS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()


    const { data } = await axios.get(`${API_URL}/exams`)

    dispatch({
      type: EXAMS_GET_SUCCESS,
      payload: data
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: EXAMS_FAIL,
      payload: message,
    })
  }
}

const addExam = (task) => async (dispatch, getState) => {
  try {
    dispatch({
      type: EXAMS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`${API_URL}/exams/create`, task, config)

    dispatch({
      type: EXAMS_CREATE_SUCCESS,
      payload: data
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: EXAMS_FAIL,
      payload: message,
    })
  }
}

const updateExam = (task) => async (dispatch, getState) => {
  try {
    dispatch({
      type: EXAMS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`${API_URL}/exams/${task._id}`, task, config)

    dispatch({
      type: EXAMS_UPDATE_SUCCESS,
      payload: data
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: EXAMS_FAIL,
      payload: message,
    })
  }
}



const deleteExams = (lists) => async (dispatch, getState) => {
  console.log('called', lists)
  try {
    dispatch({
      type: EXAMS_REQUEST
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      data : {
        id: lists
      }
    }

    await axios.delete(`${API_URL}/exams`, config)

    dispatch({
      type: EXAMS_DELETE_SUCCESS,
      payload: lists
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: EXAMS_FAIL,
      payload: message,
    })
  }
}

export const examsAction = {
  getExams,
  addExam,
  updateExam,
  deleteExams,
}