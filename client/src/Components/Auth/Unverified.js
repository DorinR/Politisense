import React from 'react'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  routerLink: {
    textDecoration: 'none',
    color: '#43D0C4'
  },
  button: {
    margin: theme.spacing(1)
  },
  title: {
    paddingTop: '50px',
    padding: theme.spacing(3, 2),
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
}))

export default function Unverified () {
  const classes = useStyles()
  return (
    <div>
      <Box className={classes.title}>
        <Typography component='h2' variant='h2' align='center' color='textPrimary' gutterBottom>
                    Please activate your account to proceed!
        </Typography>
        <Link variant='body2' to='/Activate' align='center' className={classes.routerLink}>
                    Click here to request a new activation link
        </Link>
      </Box>
    </div>
  )
}
