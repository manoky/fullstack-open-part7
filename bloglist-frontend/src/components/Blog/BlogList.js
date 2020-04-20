import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Blog from './Blog'

const useStyles = makeStyles((theme) => ({

  paper: {
    padding: theme.spacing(2),
    width: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button: {
    marginTop: 20
  }
}))

const BlogList = ({ user }) => {
  const blogs = useSelector(state => state.blogs)
  const classes = useStyles()
  const history = useHistory()

  return (
    <TableContainer component={Paper} className={classes.paper}>
      <Table>
        <TableBody>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
        </TableBody>
      </Table>
      {user && (
        <Button
          variant="contained"
          color="primary"
          onClick={ () => history.push('/create')}
          className={classes.button}
        >
          Add new blog
        </Button>
      )}

    </TableContainer>
  )
}

export default BlogList