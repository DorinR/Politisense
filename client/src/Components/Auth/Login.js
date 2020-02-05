import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import canadaimage from '../../assets/canada.jpg'
import logo from '../../assets/PolotisenseTentativeLogo.png'
import axios from 'axios'
import {
  FacebookLoginButton,
  GoogleLoginButton,
  TwitterLoginButton
} from 'react-social-login-buttons'
import { tokenAuthenticate } from './authenticate'

const gridStyle = {
  display: 'flex',
  justifyContent: 'center'
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url(' + canadaimage + ')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(0, 4, 0, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  social: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  routerLink: {
    textDecoration: 'none',
    color: '#43D0C4'
  },
  logo: {
    margin: theme.spacing(15, 0, 2)
  },
  quote: {
    color: '#43D0C4'
  }
}))

export function checkEmailFormat(email) {
  /* eslint-disable */
  const emailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  return email.match(emailFormat)
}

export async function fetchUser(email) {
  return await axios
    .post('http://localhost:5000/api/users/checkIfUserExists', { email: email })
    .then(res => {
      return res.data
    })
    .catch(console.error)
}

export async function handleEmailLogin(user) {
  let result = ''
  await axios
    .post('http://localhost:5000/api/users/login', user)
    .then(res => {
      result = res
    })
    .catch(err => console.error(err))
  return result
}

export async function handleSocialLogin(social) {
  return await axios
    .post('http://localhost:5000/api/users/socialLogin', { type: social })
    .then(res => {
      const token = res.data.data
      return tokenAuthenticate(token)
    })
    .then(result => {
      return result.user
    })
    .catch(console.error)
}

export default function Login(props) {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  function validateUserFromSocialProviders(type, cb) {
    let user = {}
    cb(type)
      .then(usr => {
        user = usr
        return fetchUser(user.email)
      })
      .then(res => {
        if (res.success) {
          // eslint-disable-next-line no-undef
          user = res.data
          localStorage.setItem('user', JSON.stringify(user))
          setAuthenticated(true)
        } else {
          const newUser = {
            firstname: user.displayName
              ? user.displayName.substr(0, user.displayName.indexOf(' '))
              : ' ',
            lastname: user.displayName
              ? user.displayName.substr(user.displayName.indexOf(' ') + 1)
              : ' ',
            email: user.email
          }
          props.history.push({
            pathname: '/question',
            state: { user: newUser }
          })
        }
      })
      .catch(console.error)
  }

  const handleEmailChange = e => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    const user = { email: email, password: password }
    // eslint-disable-next-line no-useless-escape
    const errors = {}
    errors.email = !checkEmailFormat(user.email) ? 'Invalid email' : ''
    errors.password =
      password === '' || password == null ? 'Please enter a password' : ''
    if (errors.email === '' && errors.password === '') {
      handleEmailLogin(user)
        .then(res => {
          if (res.data.success) {
            // eslint-disable-next-line no-undef
            const userToStore = { email: user.email }
            localStorage.setItem('user', JSON.stringify(userToStore))
            setAuthenticated(true)
          } else {
            if (res.data.type === 'email') {
              errors.email = res.data.auth
            }
            if (res.data.type === 'password') {
              errors.password = res.data.auth
            }
            setErrors(errors)
          }
        })
        .catch(console.error)
    } else {
      setErrors(errors)
    }
  }

  if (authenticated) {
    return <Redirect to={{ pathname: '/general' }} />
  }

  return (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5}>
        <Grid container>
          <Grid item sm={12}>
            <div className={classes.paper}>
              <img src={logo} alt='' className={classes.logo} />
              <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                  variant='outlined'
                  margin='normal'
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  onChange={handleEmailChange}
                  value={email}
                  error={errors.email !== ''}
                  helperText={errors.email}
                  autoFocus
                />
                <TextField
                  variant='outlined'
                  margin='normal'
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  onChange={handlePasswordChange}
                  value={password}
                  error={errors.password !== ''}
                  helperText={errors.password}
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}>
                  Log in
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      variant='body2'
                      to='/signup'
                      className={classes.routerLink}>
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      variant='body2'
                      to='/signup'
                      className={classes.routerLink}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
              <Typography
                variant='h6'
                gutterBottom
                style={{ textAlign: 'center' }}>
                OR
              </Typography>
              <div className='Wrapper' style={gridStyle}>
                <Grid container justify='center'>
                  <Grid item xs={6} className={classes.social}>
                    <FacebookLoginButton
                      onClick={() => {
                        validateUserFromSocialProviders(
                          'facebook',
                          handleSocialLogin
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.social}>
                    <TwitterLoginButton
                      onClick={() =>
                        validateUserFromSocialProviders(
                          'twitter',
                          handleSocialLogin
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.social}>
                    <GoogleLoginButton
                      type='button'
                      id='test'
                      onClick={() =>
                        validateUserFromSocialProviders(
                          'google',
                          handleSocialLogin
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
