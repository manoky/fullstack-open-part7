import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { create } from '../../reducers/blogReducer'

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


const BlogForm = () => {

  const [blog, setBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const alert = useSelector(state => state.alert.notice.type)
  const history = useHistory()

  useEffect(() => {
    if (alert === 'success') {
      history.push('/')
      setBlog({ title: '', author: '', url: '' })
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert])

  const classes = useStyles()
  const dispatch = useDispatch()

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(create(blog))

  }

  const setBlogProperties = name => ({ target }) => {
    setBlog({ ...blog, [name]: target.value })
  }

  const {
    title,
    author,
    url
  } = blog

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h4" align="center">
        Create new post
      </Typography>
      <form
        onSubmit={handleSubmit}
        className={classes.form}
      >
        <TextField
          label="Title"
          variant="outlined"
          value={title}
          onChange={setBlogProperties('title')}
          name="title"
          fullWidth
          className={classes.input}
        />
        <TextField
          label="Author"
          variant="outlined"
          value={author}
          onChange={setBlogProperties('author')}
          name="author"
          fullWidth
          className={classes.input}
        />
        <TextField
          label="URL"
          variant="outlined"
          value={url}
          onChange={setBlogProperties('url')}
          name="url"
          fullWidth
          className={classes.input}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Create
        </Button>

      </form>
    </Paper>
  )
}

export default BlogForm