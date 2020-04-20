import axios from 'axios'
import ACTIONS from './actionTypes'
import { setNotification } from './alertReducer'

const user = localStorage.getItem('user')
const userToken = user && JSON.parse(user).token


const token = `bearer ${userToken}`

const baseUrl = '/api/blogs'

const baseApi = axios.create({
  headers: {
    Authorization: token
  }
})

export const getBlogs =  () => {
  return async dispatch => {
    try {
      const request = await baseApi.get(baseUrl)
      dispatch({
        type: ACTIONS.INIT_BLOGS,
        data: request.data
      })
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error'))
    }
  }
}

export const create = (blog) => {
  return async dispatch => {
    try {
      await baseApi.post(baseUrl, blog)
      const message = `${blog.title} successfully created`

      dispatch(
        setNotification(message, 'success')
      )
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error'))
    }
  }
}

export const createSuccess = (blog) => {
  return dispatch => {
    dispatch({
      type: ACTIONS.CREATE_BLOG,
      data: blog.data
    })
  }
}

export const update = (id, blog) => {
  return async dispatch => {
    try {
      await baseApi.put(`${baseUrl}/${id}`, blog)
      const message = `You liked ${blog.title}`

      dispatch(
        setNotification(message, 'success')
      )
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error'))
    }
  }
}

export const upadateSuccess = (blog) => {
  return dispatch => {
    dispatch({
      type: ACTIONS.UPDATE_BLOG,
      data: blog.data
    })
  }
}

export const remove = (blog) => {
  return async dispatch => {
    try {
      await baseApi.delete(`${baseUrl}/${blog.id}`)

      dispatch(setNotification(`${blog.title} by ${blog.author} is removed`, 'success'))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error'))
    }
  }
}

export const removeSuccess = (blog) => {
  return dispatch => {
    dispatch({
      type: ACTIONS.DELETE_BLOG,
      data: blog.data
    })
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    try {
      await baseApi.post(
        `${baseUrl}/${id}/comments`, { comment }
      )


      dispatch(setNotification('Comment added'))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error'))
    }
  }
}

export const addCommentSuccess = (blog) => {
  return dispatch => {
    dispatch({
      type: ACTIONS.ADD_COMMENT,
      data: blog.data.comment,
      id: blog.data.id
    })
  }
}



const blogsReducer = (state = [], action) => {
  switch(action.type) {
  case ACTIONS.INIT_BLOGS:
    return action.data

  case ACTIONS.CREATE_BLOG:
    return [...state, action.data]

  case ACTIONS.UPDATE_BLOG:
    return state.map(blog =>
      blog.id === action.data.id
        ? action.data
        : blog
    )

  case ACTIONS.DELETE_BLOG:
    return state.filter(blog => blog.id !== action.data)

  case ACTIONS.ADD_COMMENT:
    return state.map(blog => {
      return blog.id === action.id
        ? {
          ...blog,
          comments:[...blog.comments, action.data]
        }
        : blog
    })

  default:
    return state
  }
}

export default blogsReducer