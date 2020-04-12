
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import axios from 'axios'
import {checkUserExists} from "../Dashboard/Utilities/CommonUsedFunctions";

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

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
    width: '100%',
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
  }
}))

export async function generateActivationLink (email) {
  return axios.post('/api/users/generateActivationLink', { email: email }).then(res => {
    return res
  })
}

export default function Reset () {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [validForm, setValidForm] = useState(false)
  const [errors, setErrors] = useState({
    email: ''
  })
  const [openSuccess, setOpenSuccess] = useState(false)

  const handleClickSuccess = () => {
    setOpenSuccess(true)
  }

  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSuccess(false)
  }

  useEffect(() => {
    if (email) {
      setValidForm(true)
    } else {
      setValidForm(false)
    }
  }, [email])

  const handleSubmit = e => {
    e.preventDefault()
    const user = {
      email: email
    }
    // eslint-disable-next-line no-useless-escape
    const emailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const errors = {}
    errors.email = !user.email.match(emailFormat) ? 'Invalid email' : ''
    if (
      errors.email === ''
    ) {
      checkUserExists(email).then(res => {
        generateActivationLink(email).then(
          handleClickSuccess()
        )
      })
    }
    setErrors(errors)
  }
  return (
    <div>
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' className={classes.title}>
                            Activation link
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
          <Alert onClose={handleCloseSuccess} severity='success'>
                        Activation link email has been sent
          </Alert>
        </Snackbar>
        <div className={classes.paper}>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={e => setEmail(e.target.value)}
                  variant='outlined'
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  error={errors.email !== ''}
                  helperText={errors.email}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              disabled={!validForm}
            >
                            Send activation link email
            </Button>
            <Grid container justify='flex-end'>
              <Grid item>
                <Link variant='body2' to='/login' className={classes.routerLink}>
                                    Return to login page
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  )
}
