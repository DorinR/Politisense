import React, { useEffect, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faLinkedin,
  faTwitter,
  faGoogle
} from '@fortawesome/free-brands-svg-icons'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import canadaimage from '../../assets/canada.jpg'
import logo from '../../assets/PolotisenseTentativeLogo.png'
import { Box } from '@material-ui/core'
import axios from 'axios'

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

export default function Login(props) {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })

  useEffect(() => {
    if (props.location.state !== undefined) {
      setMessage('Your account has been successfully created!')
    }
  })

  const handleEmailChange = e => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    const user = { email: email, password: password }
    const emailFormat = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    const errors = {}
    errors.email = !user.email.match(emailFormat) ? 'Invalid email' : ''
    errors.password =
      password === '' || password == null ? 'Please enter a password' : ''
    if (errors.email === '' && errors.password === '') {
      axios
        .post('http://localhost:5000/api/users/login', user)
        .then(res => {
          if (res.data.success) {
            setAuthenticated(true)
            localStorage.setItem('user', JSON.stringify(user))
          } else {
            console.log('fail')
          }
        })
        .catch(e => console.log(e))
    } else {
      setErrors(errors)
      console.log(errors)
    }
  }
  return authenticated ? (
    <Redirect to='/dashboard' />
  ) : (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5}>
        <Grid container>
          <Grid item sm={12}>
            <div className={classes.paper}>
              <img src={logo} alt='' className={classes.logo} />
              <form className={classes.form} noValidate onSubmit={handleSubmit}>
                {message ? (
                  <Box className={classes.quote}>{message}</Box>
                ) : null}
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
                <Typography
                  variant='h6'
                  gutterBottom
                  style={{ textAlign: 'center' }}
                >
                  OR
                </Typography>
                <Grid container>
                  <Grid item xs={3} className={classes.social}>
                    <FontAwesomeIcon
                      icon={faFacebook}
                      size='4x'
                      color='#455892'
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.social}>
                    <FontAwesomeIcon
                      icon={faTwitter}
                      size='4x'
                      color='#55ADEC'
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.social}>
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      size='4x'
                      color='#0274B3'
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.social}>
                    <FontAwesomeIcon
                      icon={faGoogle}
                      size='4x'
                      color='#E43E2B'
                    />
                  </Grid>
                </Grid>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                >
                  Log in
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      variant='body2'
                      to='/signup'
                      className={classes.routerLink}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      variant='body2'
                      to='/signup'
                      className={classes.routerLink}
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
