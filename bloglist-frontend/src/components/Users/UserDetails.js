import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  form: {
    width: 450,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  paper: {
    padding: theme.spacing(2),
    width: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  input: {
    margin: theme.spacing(1, 0, 0, 0),
  },
  button: {
    margin: theme.spacing(3, 0, 2),
  }
}))


const UserDetails = ({ user }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      {user.blogs.length === 0 ?
        <div>This user has not added any blog post yet</div>
        :
        user.blogs.map(blog => (
          <div key={blog.id}>
            <ListItem >
              <ListItemText primary={blog.title} />
            </ListItem>
            <Divider />
          </div>
        ))}
    </Paper>
  )
}
export default UserDetails