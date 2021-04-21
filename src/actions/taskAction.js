import axios from 'axios'

import {
  API_URL,
  TASKS_REQUEST,
  TASKS_GET_SUCCESS,
  TASKS_CREATE_SUCCESS,
  TASKS_UPDATE_SUCCESS,
  TASKS_DELETE_SUCCESS,
  TASKS_FAIL
} from '../helper/constants'

import { logout } from './userActions'

const getTasks = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TASKS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`${API_URL}/tasks`, config)
    dispatch({
      type: TASKS_GET_SUCCESS,
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
      type: TASKS_FAIL,
      payload: message,
    })
  }
}

const addTasks = (task) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TASKS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`${API_URL}/tasks/create`, task, config)

    dispatch({
      type: TASKS_CREATE_SUCCESS,
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
      type: TASKS_FAIL,
      payload: message,
    })
  }
}

const updateTasks = (task) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TASKS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`${API_URL}/tasks/${task._id}`, task, config)

    dispatch({
      type: TASKS_UPDATE_SUCCESS,
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
      type: TASKS_FAIL,
      payload: message,
    })
  }
}

const deleteTasks = (lists) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TASKS_REQUEST
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

    await axios.delete(`${API_URL}/tasks`, config)

    dispatch({
      type: TASKS_DELETE_SUCCESS,
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
      type: TASKS_FAIL,
      payload: message,
    })
  }
}

export const taskActions = {
  getTasks,
  addTasks,
  updateTasks,
  deleteTasks
}