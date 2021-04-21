import axios from 'axios'

import {
  API_URL,
  TASK_TYPES_FAIL,
  TASK_TYPES_REQUEST,
  TASK_TYPES_GET_SUCCESS,
  TASK_TYPES_CREATE_SUCCESS,
  TASK_TYPES_UPDATE_SUCCESS,
  TASK_TYPES_DELETE_SUCCESS
} from '../helper/constants'

import { logout } from './userActions'

const getTasktypes = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TASK_TYPES_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`${API_URL}/tasktypes`, config)

    dispatch({
      type: TASK_TYPES_GET_SUCCESS,
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
      type: TASK_TYPES_FAIL,
      payload: message,
    })
  }
}

const addTasktypes = (tasktype) => async (dispatch, getState) => {
  console.log(tasktype)
  try {
    dispatch({
      type: TASK_TYPES_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`${API_URL}/tasktypes/create`,  tasktype, config)

    dispatch({
      type: TASK_TYPES_CREATE_SUCCESS,
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
      type: TASK_TYPES_FAIL,
      payload: message,
    })
  }
}

const updateTasktypes = (tasktype) => async (dispatch, getState) => {
  console.log(tasktype);
  try {
    dispatch({
      type: TASK_TYPES_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`${API_URL}/tasktypes/${tasktype._id}`, tasktype, config)

    dispatch({
      type: TASK_TYPES_UPDATE_SUCCESS,
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
      type: TASK_TYPES_FAIL,
      payload: message,
    })
  }
}

const deleteTasktypes = (lists) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TASK_TYPES_REQUEST
    })

    const {
      userLogin: { userInfo },
    } = getState()
    console.log(userInfo.token)

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      data: {
        id: lists
      }
    }
    console.log(config)

    await axios.delete(`${API_URL}/tasktypes/`, config)

    dispatch({
      type: TASK_TYPES_DELETE_SUCCESS,
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
      type: TASK_TYPES_FAIL,
      payload: message,
    })
  }
}

export const tasktypeActions = {
  getTasktypes,
  addTasktypes,
  updateTasktypes,
  deleteTasktypes
}