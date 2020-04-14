/* eslint-env react */
import React, { useEffect, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import axios from 'axios'
import SaveIcon from '@material-ui/icons/Save'
import { withSnackbar } from 'notistack'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import CenteredCircularProgress from '../Dashboard/Utilities/CenteredCircularProgress'
import { pwFormat } from '../Dashboard/Utilities/CommonUsedFunctions'

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

export async function checkTokenValid (token) {
  return axios
    .post('/api/users/checkTokenValid', { token: token })
    .then(res => {
      return res.data
    })
    .catch(console.error)
}

export async function fetchUserData (userEmail) {
  let result = ''
  await axios
    .get(`/api/users/${userEmail}/getUser`, {
      params: { changepassword: userEmail }
    })
    .then(res => {
      if (res.data.success) {
        result = res.data.data
      }
    })
    .catch(err => console.log(err))
  return result
}

export async function updatePassword (user, newPassword) {
  user.password = newPassword
  axios
    .post('/api/users/updateUser', user)
    .catch(err => console.log(err))
}

function ChangeAccountPassword (props) {
  const classes = useStyles()
  const [validToken, setValidToken] = useState(false)
  const [statusReceived, setStatusReceived] = useState(false)
  const [changeCompleted, setChangeCompleted] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [fetchedUserDetails, setFetchedUserDetails] = useState('')
  const [user] = useState({})
  const [errors, setErrors] = useState({
    password: '',
    passwordConfirm: ''
  })

  useEffect(() => {
    async function getData () {
      const response = await checkTokenValid(props.match.params.token)
      const user = response.data
      setValidToken(response.success)
      setStatusReceived(true)
      const fullUserDetails = await fetchUserData(user.email)
      setFetchedUserDetails(fullUserDetails)
    }
    getData()
  }, [props.match.params.token])

  function checkEmpty (obj) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] !== '') {
        return false
      }
    }
    return true
  }

  const handleSubmit = e => {
    e.preventDefault()
    const passwordFormat = pwFormat()
    const errors = {}

    const user = {
      password: password
    }

    errors.password = !user.password.match(passwordFormat)
      ? 'Invalid password format'
      : ''
    errors.passwordConfirm = !(user.password === passwordConfirm)
      ? 'Passwords do not match'
      : ''
    if (checkEmpty(errors)) {
      updatePassword(fetchedUserDetails, password)
      props.enqueueSnackbar('Password Successfully Changed!', {
        variant: 'success'
      })
      setChangeCompleted(true)
    } else {
      setErrors(errors)
    }
  }
  if (changeCompleted) {
    return <Redirect to={{ pathname: '/login', state: { user: user } }} />
  }
  return (
    <div>
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' className={classes.title}>
                                    Reset password
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      {statusReceived
        ? (
          <div>
            {validToken
              ? (
                <div>
                  <Container maxWidth='xs'>
                    <Grid container spacing={3}>
                      <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <Grid item xs={12}>
                          <TextField
                            onChange={e => setPassword(e.target.value)}
                            margin='normal'
                            variant='filled'
                            required
                            fullWidth
                            name='password'
                            label='New Password'
                            type='password'
                            id='password'
                            autoComplete='current-password'
                            error={errors.password !== ''}
                            helperText={errors.password ? errors.password : '8 characters, 1 uppercase/lowercase letter, 1 symbol and 1 digit'}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            onChange={e => setPasswordConfirm(e.target.value)}
                            margin='normal'
                            variant='filled'
                            required
                            fullWidth
                            name='passwordConfirm'
                            label='Confirm Password'
                            type='password'
                            id='passwordConfirm'
                            autoComplete='current-password'
                            error={errors.passwordConfirm !== ''}
                            helperText={errors.passwordConfirm}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            size='large'
                            className={classes.button}
                          >
                            <SaveIcon />
                            <Box m={0.5} />
                            Save New Password
                          </Button>
                        </Grid>
                      </form>
                    </Grid>
                  </Container>
                </div>
              )
              : (
                <Box className={classes.invalid}>
                  <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
                                The reset link you followed has expired or is invalid
                  </Typography>
                  <Link variant='body2' to='/reset' align='center'>
                                Generate new link here
                  </Link>
                </Box>
              )}
          </div>)
        : (<CenteredCircularProgress />)}
    </div>
  )
}

export default withSnackbar(ChangeAccountPassword)
