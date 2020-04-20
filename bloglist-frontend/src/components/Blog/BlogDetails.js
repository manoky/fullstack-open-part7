import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import Link from '@material-ui/core/Link'
import { useHistory } from 'react-router-dom'
import Comfirm from '../Notification/Confirm'
import { useSelector, useDispatch } from 'react-redux'
import { confirmAtion, cancelAction } from '../../reducers/alertReducer'
import { remove, update, addComment } from '../../reducers/blogReducer'
import Comments from './Comments/Comments'

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  text: {
    marginLeft: 20,
  },
  area: {
    width: 450,
    marginTop: 15,
    marginBottom: 15,
  },
  comment: {
    marginTop: 40
  },
  like: {
    marginRight: 10,
    marginLeft: 10
  }
}))


const BlogDetails = ({ blog }) => {
  const [comment, setComment] = useState('')

  const alert = useSelector(state => state.alert.confirm)
  const notice = useSelector(state => state.alert.notice.type)
  const dispatch = useDispatch()

  const history = useHistory()


  const handLikes = () => {
    const updateBlog = {
      user: blog.user._id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    dispatch(update(blog.id, updateBlog))
  }

  const handleConfirm = () => {
    const message=`Are you sure you want to delete ${blog.title} by ${blog.author}`

    dispatch(confirmAtion(message))
  }

  const removeBlog = () => {
    dispatch(remove(blog))
    handleClose()
    if (notice !== 'error') {
      history.push('/')
    }
  }

  const handleClose = () => {
    dispatch(cancelAction())
  }

  const submitComment = () => {
    dispatch(addComment(blog.id, comment))
    setComment('')
  }

  const handleComment = (e) => {
    setComment(e.target.value)
  }

  const classes = useStyles()

  return (
    <div className={classes.layout}>
      <Comfirm
        open={alert.open}
        message={alert.message}
        title={'Delete blog?'}
        handleClose={handleClose}
        handleConfirm={removeBlog}
      />
      <Paper className={classes.paper}>
        <Typography variant="h5">
          {blog.title} {blog.author}
        </Typography>
        <Link href={blog.url} target="_blank">
          {blog.url}
        </Link>
        <div>
          <Chip
            variant="outlined"
            size="small"
            avatar={<Avatar>{blog.likes}</Avatar>}
            label="likes"
          />
          <IconButton
            onClick={handLikes}
            className={classes.like}
          >
            <ThumbUpIcon color="primary" />
          </IconButton>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleConfirm}
            size="small"
          >
            delete post
          </Button>
        </div>
        <Comments
          submitComment={submitComment}
          handleComment={handleComment}
          comments={blog.comments}
          comment={comment}
        />
      </Paper>
    </div>
  )
}

export default BlogDetails