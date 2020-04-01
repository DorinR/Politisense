import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  centering: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
}))

export default function CenteredCircularProgress () {
  const classes = useStyles()

  return (
    <div className={classes.centering}>
      <CircularProgress />
    </div>
  )
}
