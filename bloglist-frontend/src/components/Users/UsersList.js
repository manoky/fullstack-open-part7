import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getUsers } from '../../reducers/userReducer'
import User from './User'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(2),
    width: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))


const UsersList = ({ users }) => {

  const dispatch = useDispatch()

  const history = useHistory()

  const handleRedirect = (user) => {
    history.push(`/users/${user.id}`)
  }

  useEffect(() => {
    dispatch(getUsers())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5">
          Users
        </Typography>
        <List component="nav" aria-label="user information">
          <ListItem>
            <ListItemText primary="Name" />
            <ListItemText primary="Blogs created" />
          </ListItem>
          {users.map(user => (
            <User
              key={user.id}
              user={user}
              handleClick={handleRedirect}
            />
          ))}
        </List>
      </Paper>
    </div>
  )
}

export default UsersList