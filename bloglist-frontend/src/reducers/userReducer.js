import axios from 'axios'
import ACTIONS from './actionTypes'
import { setNotification } from './alertReducer'

const baseUrl = '/api/login'
const baseUserUrl = '/api/users'

export const login = (credentials) => {
  return async dispatch => {
    try {
      const request = await axios.post(baseUrl, credentials)
      const message = `${request.data.name} successfully logged in`
      dispatch({
        type: ACTIONS.LOGIN_USER,
        data: request.data
      })

      dispatch(setNotification(message, 'success'))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error'))
    }
  }
}

export const logout = () => {
  return async dispatch => {

    dispatch({
      type: ACTIONS.LOGOUT_USER
    })
  }
}

export const getUsers = () => {
  return async dispatch => {
    try {
      const request = await axios.get(baseUserUrl)
      dispatch({
        type: ACTIONS.GET_USERS,
        data: request.data
      })
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error'))
    }
  }
}


const storedUser = localStorage.getItem('user')
const initialUser = storedUser && JSON.parse(storedUser)
const initialState = {
  user: initialUser,
  users: []
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
  case ACTIONS.LOGIN_USER:
    localStorage.setItem('user', JSON.stringify(action.data))
    return {
      ...state,
      user: action.data
    }

  case ACTIONS.LOGOUT_USER:
    localStorage.clear()
    return {
      ...state,
      user: null
    }

  case ACTIONS.GET_USERS:
    return {
      ...state,
      users: action.data
    }
  default:
    return state
  }
}

export default userReducer