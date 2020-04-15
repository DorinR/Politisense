import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  info: {
    marginTop: 20,
    marginBottom: 20
  }
}))

export default function PollsNavbar () {
  const classes = useStyles()

  return (
    <Alert severity='info' className={classes.info}>Please reload the page after voting to see results </Alert>
  )
}
