import React, { useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faLinkedin, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import canadaimage from '../../assets/canada.jpg'
import logo from '../../assets/PolotisenseTentativeLogo.png'

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
  }
}))

export default function Login () {
  const classes = useStyles()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  function login (username, password) {
    const credentials = { username: username, password: password }
    // localStorage.setItem()
    if (credentials.username === 'user' && credentials.password === 'test') {
      setAuthenticated(true)
      window.confirm("successfully logged in")
      localStorage.setItem('user', JSON.stringify(credentials))
    }
    window.confirm("The username and password you entered did not match our records. Please double-check and try again.")

  }
  const handleSubmit = (e) => {
    e.preventDefault()
    login(username, password)
    setUsername('')
    setPassword('')
  }
  return (
    authenticated
      ? (<Redirect to='/dashboard' />)
      : (
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
                      onChange={handleUsernameChange}
                      value={username}
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
                    />
                    <Typography variant='h6' gutterBottom style={{ textAlign: 'center' }}>
                      OR
                    </Typography>
                    <Grid
                      container
                    >
                      <Grid item xs={3} className={classes.social}>
                        <FontAwesomeIcon icon={faFacebook} size='4x' color='#455892' />
                      </Grid>
                      <Grid item xs={3} className={classes.social}>
                        <FontAwesomeIcon icon={faTwitter} size='4x' color='#55ADEC' />
                      </Grid>
                      <Grid item xs={3} className={classes.social}>
                        <FontAwesomeIcon icon={faLinkedin} size='4x' color='#0274B3' />
                      </Grid>
                      <Grid item xs={3} className={classes.social}>
                        <FontAwesomeIcon icon={faGoogle} size='4x' color='#E43E2B' />
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
                        <Link variant='body2' to='/signup' className={classes.routerLink}>
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link variant='body2' to='/signup' className={classes.routerLink}>
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>)
  )
}
