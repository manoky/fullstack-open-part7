import React from 'react'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import Comment from './Comment'

const useStyles = makeStyles(() => ({
  comment: {
    marginTop: 40
  },
  area: {
    width: 450,
    marginTop: 15,
    marginBottom: 15,
  },
  list: {
    marginTop: 30
  },
  item: {
    marginTop: 15
  }
}))

const Comments = ({
  handleComment,
  submitComment,
  comments,
  comment
}) => {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.comment}>
        <Typography variant="h5">
          Comments
        </Typography>
        <TextareaAutosize
          className={classes.area}
          aria-label="comment textarea"
          rowsMin={4}
          placeholder="add a comment"
          onChange={handleComment}
          value={comment}
        />
      </div>
      <Button
        variant="contained"
        color="default"
        onClick={submitComment}
        size="small"
      >
        submit
      </Button>
      <List className={classes.list}>
        {comments && (
          comments.map(comment => (
            <Comment
              key={comment._id}
              comment={comment}
              style={classes.item}
            />
          ))
        )}
      </List>
    </div>
  )
}

export default Comments