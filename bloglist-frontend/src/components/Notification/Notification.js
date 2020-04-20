import React from 'react'
import Alert from '@material-ui/lab/Alert'

const Notification = ({ alert, style }) => {
  if (!alert.message) {
    return null
  }

  return (
    <Alert
      severity={alert.type}
      className={style}
    >
      {alert.message}
    </Alert>
  )
}

export default Notification