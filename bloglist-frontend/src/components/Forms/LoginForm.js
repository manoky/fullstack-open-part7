import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { login } from '../../reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center'
  },
  input: {
    width: '100%'
  }
}))

const LoginForm = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  const alert = useSelector(state => state.alert.notice)

  const handleLogin = (e) => {

    e.preventDefault()
    if (!username && !password) return
    dispatch(login({ username, password }))
    if(alert.type !== 'error') {
      history.push('/')
    }
  }


  const classes = useStyles()

  return (
    <div className={classes.center}>
      <form onSubmit={handleLogin} className={classes.root} noValidate autoComplete="off">
        <h2> Login </h2>
        <div className={classes.input}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={({target}) => setUsername(target.value)}
            name="username"
            className={classes.input}
          />
        </div>
        <div className={classes.input}>
          <TextField
            label="Password"
            variant="outlined"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            name="password"
            type="password"
            className={classes.input}
          />
        </div>
        <div className={classes.input}>
          <Button
            color="primary"
            id="login"
            variant="contained"
            type="submit"
            fullWidth
          >
            login
          </Button>
        </div>
      </form>
    </div>
  )
}


export default LoginForm