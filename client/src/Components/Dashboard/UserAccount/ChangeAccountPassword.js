import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import axios from 'axios'
import SaveIcon from '@material-ui/icons/Save'
import { withSnackbar } from 'notistack'
import bcrypt from 'bcryptjs'

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
    width: '80%', // Fix IE 11 issue.
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
    .get(`/api/users/${userEmail}/getUser`, {
      params: { changepassword: userEmail }
    })
    .then(res => {
      if (res.data.success) {
        const user = res.data.data
        result = user
      }
    })
    .catch(err => console.log(err))
  return result
}

export async function updatePassword(user, newPassword) {
  user.password = newPassword
  axios
    .post('/api/users/updateUser', user)
    .then(res => {
      if (res.data.success) {
        console.log('password update was successful')
      }
    })
    .catch(err => console.log(err))
}

function ChangeAccountPassword(props) {
  const classes = useStyles()
  const [changeCompleted, setChangeCompleted] = useState(false)
  const [
    userEnteredPreviousPassword,
    setUserEnteredPreviousPassword
  ] = useState('')
  const [previousPasswordFromDb, setPreviousPasswordFromDb] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [fetchedUserDetails, setFetchedUserDetails] = useState('')
  const [user] = useState({})
  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    previousPassword: '',
    userEnteredPreviousPassword: ''
  })

  useEffect(() => {
    async function getData() {
      // eslint-disable-next-line no-undef
      const user = JSON.parse(localStorage.getItem('user'))
      const fullUserDetails = await fetchUserData(user.email)
      setFetchedUserDetails(fullUserDetails)
      const { password } = fullUserDetails
      setPreviousPasswordFromDb(password)
    }
    getData()
  }, [])

  function checkEmpty(obj) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] !== '') {
        return false
      }
    }
    return true
  }

  const handleSubmit = e => {
    e.preventDefault()

    const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const errors = {}

    const user = {
      password: password
    }

    errors.userEnteredPreviousPassword = !bcrypt.compareSync(
      userEnteredPreviousPassword,
      previousPasswordFromDb
    )
      ? 'incorrect password'
      : ''

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
    return <Redirect to={{ pathname: '/dashboard', state: { user: user } }} />
  }
  return (
    <div>
      <Container maxWidth='sm'>
        <Grid container spacing={3}>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <TextField
                onChange={e => setUserEnteredPreviousPassword(e.target.value)}
                margin='normal'
                variant='filled'
                required
                fullWidth
                name='userEnteredPreviousPassword'
                label='Previous Password'
                type='password'
                id='userEnteredPreviousPassword'
                error={errors.userEnteredPreviousPassword !== ''}
                helperText={errors.userEnteredPreviousPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={e => setPassword(e.target.value)}
                margin='normal'
                variant='filled'
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
                className={classes.button}>
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
}

export default withSnackbar(ChangeAccountPassword)
