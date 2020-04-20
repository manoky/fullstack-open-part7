import ACTIONS from './actionTypes'


let timer
export const setNotification = (message,type, time = 5000) => {
  return async dispatch => {
    await dispatch({
      type: ACTIONS.SET_ALERT,
      data: message,
      severity: type
    })

    clearTimeout(timer)

    timer = setTimeout(() => {
      dispatch({
        type: ACTIONS.CLEAR_ALERT
      })
    }, time)
  }
}

export const confirmAtion = (message) => {
  return dispatch => {
    dispatch({
      type: ACTIONS.CONFIRM_ACTION,
      data: message
    })
  }
}

export const cancelAction = () => {
  return dispatch => {
    dispatch({
      type: ACTIONS.CANCEL_ACTION
    })
  }
}

const initialState = {
  notice: {
    type: '',
    message: ''
  },
  confirm: {
    open: false,
    message: ''
  }
}

const alertReducer = (state = initialState, action) => {
  switch(action.type) {
  case ACTIONS.SET_ALERT:
    return {
      ...state,
      notice: {
        type: action.severity,
        message: action.data
      }
    }

  case ACTIONS.CLEAR_ALERT:
    return {
      ...state,
      notice: {
        type: '',
        message: ''
      }
    }

  case ACTIONS.CONFIRM_ACTION:
    return {
      ...state,
      confirm: {
        open: true,
        message: action.data
      }
    }

  case ACTIONS.CANCEL_ACTION:
    return {
      ...state,
      confirm: {
        open: false,
        message: ''
      }
    }

  default:
    return state
  }
}

export default alertReducer