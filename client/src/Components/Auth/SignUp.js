import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
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

export async function signupAPICall (user) {
  let result = ''
  await axios
    .post('http://localhost:5000/api/users/checkIfUserExists', user)
    .then(res => {
      result = res
    })
  return result
}

export default function SignUp () {
  const classes = useStyles()
  const [registered, setRegistered] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [validForm, setValidForm] = useState(false)
  const [user, setUser] = useState({})
  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })

  function checkIfFormIsValid () {
    if (firstname && lastname && email && password && passwordConfirm) {
      setValidForm(true)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    const user = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password
    }
    setUser(user)
    const nameFormat = /^[a-z ,.'-]+$/i
    // eslint-disable-next-line no-useless-escape
    const emailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const errors = {}
    const nameError = 'Invalid name format, Please use only letters or hyphens'
    errors.firstname = !user.firstname.match(nameFormat)
      ? nameError
      : ''
    errors.lastname = !user.lastname.match(nameFormat)
      ? nameError
      : ''
    errors.email = !user.email.match(emailFormat) ? 'Invalid email' : ''
    errors.password = !user.password.match(passwordFormat)
      ? 'Invalid password format, please use at least 8 characters, comprised of alphanumeric characters'
      : ''
    errors.passwordConfirm = !(user.password === passwordConfirm)
      ? 'Passwords do not match, please re-enter confirmation password'
      : ''
    if (errors.firstname === '' &&
        errors.lastname === '' &&
        errors.email === '' &&
        errors.password === '' &&
        errors.passwordConfirm === '') {
      signupAPICall(user).then(res => {
        if (res.data.success === false) {
          setRegistered(true)
        } else {
          errors.email = 'Already taken'
          setErrors(errors)
          return <Redirect to={{ pathname: '/signup', state: { user: '' } }} />
        }
      })
    } else {
      setErrors(errors)
    }
  }
  if (registered) {
    // eslint-disable-next-line no-undef
    localStorage.setItem('user', JSON.stringify(user.email))
    return <Redirect to={{ pathname: '/question', state: { user: user } }} />
  }
  return (
    <div>
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' className={classes.title}>
              Sign Up
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit}
            onChange={checkIfFormIsValid}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={e => setFirstname(e.target.value)}
                  autoComplete='fname'
                  name='firstname'
                  variant='outlined'
                  required
                  fullWidth
                  id='firstName'
                  label='First Name'
                  error={errors.firstname !== ''}
                  helperText={errors.firstname}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={e => setLastname(e.target.value)}
                  variant='outlined'
                  required
                  fullWidth
                  id='lastName'
                  label='Last Name'
                  name='lastname'
                  autoComplete='lname'
                  error={errors.lastname !== ''}
                  helperText={errors.lastname}
                />
              </Grid>
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={e => setPassword(e.target.value)}
                  variant='outlined'
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  placeholder="8 characters, at least one letter and one digit"
                  autoComplete='current-password'
                  error={errors.password !== ''}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={e => setPasswordConfirm(e.target.value)}
                  variant='outlined'
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
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              disabled={!validForm}
            >
              CONTINUE WITH SIGN UP
            </Button>
            <Grid container justify='flex-end'>
              <Grid item>
                <Link variant='body2' to='/' className={classes.routerLink}>
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  )
}
