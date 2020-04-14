import React from 'react'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  invalid: {
    padding: theme.spacing(3, 2),
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  routerLink: {
    textDecoration: 'none',
    color: '#43D0C4'
  }
}))

export default function Logout () {
  const classes = useStyles()
  return (
    <Box className={classes.invalid}>
      <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
                This page does not exist!
      </Typography>
      <Link variant='body2' to='/general' align='center' className={classes.routerLink}>
                Click here to go back to the login page
      </Link>
    </Box>
  )
}
