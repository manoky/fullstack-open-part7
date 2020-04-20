import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'


const User = ({ user, handleClick }) => {

  return (
    <>
      <ListItem button onClick={() => handleClick(user)}>
        <ListItemText primary={user.name} />
        <ListItemText primary={user.blogs.length} />
      </ListItem>
      <Divider />
    </>
  )
}

export default User