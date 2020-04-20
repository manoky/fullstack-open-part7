import { combineReducers } from 'redux'
import blogsReducer from './blogReducer'
import userReducer from './userReducer'
import alertReducer from './alertReducer'


const reducer = combineReducers({
  blogs: blogsReducer,
  user:  userReducer,
  alert: alertReducer
})

export default reducer