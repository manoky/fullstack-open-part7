import React from 'react'
import { useHistory } from 'react-router-dom'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Tooltip from '@material-ui/core/Tooltip'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton'


const NavBar = ({ handleLogout, user, style }) => {
  const history = useHistory()

  return (
    <AppBar position="absolute">
      <Toolbar>
        <Typography variant="h6" className={style}>
          <IconButton color="inherit" onClick={ () => history.push('/')}>
            <HomeIcon fontSize="large" />
          </IconButton>
        </Typography>
        <Button color="inherit" onClick={ () => history.push('/')}>
            Blogs
        </Button>
        <Button color="inherit" onClick={ () => history.push('/users')}>
            Users
        </Button>
        {user ? (
          <>
            <Tooltip title={user && `${user.name} logged in`}>
              <AccountCircle />
            </Tooltip>
            <Button color="inherit"onClick={handleLogout}>
                Logout
            </Button>
          </>
        ) : (
          <Button color="inherit"onClick={ () => history.push('/login')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar