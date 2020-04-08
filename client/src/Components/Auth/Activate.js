import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import axios from 'axios'

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
  title: {
    flexGrow: 1,
    textAlign: 'center'
  },
  routerLink: {
    textDecoration: 'none',
    color: '#43D0C4'
  },
  button: {
    margin: theme.spacing(1)
  },
  invalid: {
    padding: theme.spacing(3, 2),
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
}))

export async function activateAccount (token) {
  console.log(token)
  let result = ''
  await axios.post('/api/users/activateAccount', { token: token }).then(res => {
    result = res
    console.log(res)
  })
  return result
}

export default function Activate (props) {
  const classes = useStyles()

  useEffect(() => {
    activateAccount(props.match.params.token)
  }, [])
  return (
    <div>
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' className={classes.title}>
                            Account activation
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Box className={classes.invalid}>
        <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
                    Your account has been verified and activated!
        </Typography>
        <Link variant='body2' to='/login' align='center'>
                    Click here to login
        </Link>
      </Box>
    </div>
  )
}
