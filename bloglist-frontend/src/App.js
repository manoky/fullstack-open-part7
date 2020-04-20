import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useRouteMatch, useHistory } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import { getBlogs } from './reducers/blogReducer'
import { logout } from './reducers/userReducer'
import { setNotification } from './reducers/alertReducer'
import io from 'socket.io-client'
import NavBar from './components/NavBar'
import Notification from './components/Notification/Notification'
import Routes from './components/Routes/Routes'
import {
  createSuccess,
  upadateSuccess,
  removeSuccess,
  addCommentSuccess
} from './reducers/blogReducer'


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  alert: {
    width: 700,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 15
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
    paddingTop: 50
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}))


const App = () => {

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user.user)
  const users = useSelector(state => state.user.users)
  const alert = useSelector(state => state.alert.notice)
  const history = useHistory()


  useEffect(() => {
    dispatch(getBlogs())
    const socket = io('/blog')
    socket.on('created', (data) => dispatch(createSuccess(data)))
    socket.on('updated', (data) => dispatch(upadateSuccess(data)))
    socket.on('deleted', (data) => dispatch(removeSuccess(data)))
    socket.on('commented', (data) => dispatch(addCommentSuccess(data)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    const message = `${user.name} logged out`
    dispatch(setNotification(message, 'error'))
    dispatch(logout())
    history.push('/')
  }

  const classes = useStyles()
  const match = useRouteMatch('/blogs/:id')
  const userMatch = useRouteMatch('/users/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const foundUser = userMatch
    ? users.find(user => user.id === userMatch.params.id)
    : null

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="sm">
        <NavBar
          handleLogout={handleLogout}
          style={classes.title}
          user={user}
        />
        <Notification alert={alert} style={classes.alert} />
        <Routes
          user={user}
          users={users}
          foundUser={foundUser}
          blog={blog}
        />
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <em>
            <Typography variant="body1">
              Blog app, fullstack open 2020.
            </Typography>
          </em>
        </Container>
      </footer>
    </div>
  )
}

export default App