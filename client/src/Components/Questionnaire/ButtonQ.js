import React from 'react'

import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
}))

export default function ButtonQ () {
  const classes = useStyles()

  return (
    <Grid container component='main' className={classes.root}>
      <Button variant='outlined' color='secondary' className={classes.button}>
            Next
      </Button>
    </Grid>

  )
}
