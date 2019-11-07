import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import axios from 'axios'
import SaveIcon from '@material-ui/icons/Save'
import Icon from '@material-ui/core/Icon'

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
  }
}))

export async function fetchUserData(userEmail) {
  let result = ''
  await axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        let user = res.data.data
        result = user
      }
    })
    .catch(err => console.log(err))
  console.log(result)
  return result
}

export default function UserAccount() {
  const classes = useStyles()
  // const [registered, setRegistered] = useState(false)
  const [changeCompleted, setChangeCompleted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [previousPassword, setPreviousPassword] = useState('')
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
    passwordConfirm: '',
    previousPassword: ''
  })

  useEffect(() => {
    async function getData() {
      let user = JSON.parse(localStorage.getItem('user'))
      let { email } = user
      let fullUserDetails = await fetchUserData(email)
      let { firstname, lastname } = fullUserDetails
      setFirstname(firstname)
      setLastname(lastname)
    }
    getData()
  })

  function checkEmpty(obj) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] !== '') {
        return false
      }
    }
    return true
  }
  function checkForm() {
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
    const emailFormat = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const errors = {}
    errors.firstname = !user.firstname.match(nameFormat)
      ? 'Invalid name format'
      : ''
    errors.lastname = !user.lastname.match(nameFormat)
      ? 'Invalid name format'
      : ''
    errors.email = !user.email.match(emailFormat) ? 'Invalid email' : ''
    errors.password = !user.password.match(passwordFormat)
      ? 'Invalid password format'
      : ''
    errors.passwordConfirm = !(user.password === passwordConfirm)
      ? 'Passwords do not match'
      : ''
    if (checkEmpty(errors)) {
      setChangeCompleted(true)
    } else {
      setErrors(errors)
    }
  }
  if (changeCompleted) {
    return <Redirect to={{ pathname: '/dashboard', state: { user: user } }} />
  }
  return (
    <div>
      <Box p={5}>
        <Container maxWidth='sm'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Box m={1}>
                  <Typography>Change Account Details</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name='firstname'
                variant='outlined'
                fullWidth
                id='firstName'
                label='Current First Name'
                InputProps={{
                  readOnly: true
                }}
                value={firstname}
                variant='filled'
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                onChange={e => setFirstname(e.target.value)}
                autoComplete='fname'
                name='firstname'
                variant='outlined'
                required
                fullWidth
                id='firstName'
                label='New First Name'
                error={errors.firstname !== ''}
                helperText={errors.firstname}
                autoFocus
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name='lastName'
                variant='filled'
                fullWidth
                id='lastName'
                label='Current Last Name'
                InputProps={{
                  readOnly: true
                }}
                value={lastname}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                onChange={e => setLastname(e.target.value)}
                variant='outlined'
                required
                fullWidth
                id='lastName'
                label='New Last Name'
                name='lastname'
                autoComplete='lname'
                error={errors.lastname !== ''}
                helperText={errors.lastname}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Box m={1}>
                  <Typography>Change Password</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={e => setPreviousPassword(e.target.value)}
                variant='outlined'
                required
                fullWidth
                name='previousPassword'
                label='Previous Password'
                type='password'
                id='previousPassword'
                error={errors.previousPassword !== ''}
                helperText={errors.previousPassword}
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
            <Grid item xs={12}>
              <Button
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
          </Grid>
        </Container>
      </Box>
    </div>
  )
}
