import React from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faLinkedin, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons'

import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
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
    margin: theme.spacing(12, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  card: {
    boxShadow: 'none'
  },
  media: {
    height: 140
  },
  test: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

function handleClick () {
  console.log('asd')
}

export default function Login () {
  const classes = useStyles()

  return (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5}>
        <Grid container>
          <Grid item sm={12}>
            <Card>
              <CardMedia
                className={classes.media}
                image={logo}
              />
              <CardContent>
                <div className={classes.paper}>
                  <form className={classes.form} noValidate>
                    <TextField
                      variant='outlined'
                      margin='normal'
                      required
                      fullWidth
                      id='email'
                      label='Email Address'
                      name='email'
                      autoComplete='email'
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
                    />
                    <Typography variant='h6' gutterBottom style={{ textAlign: 'center' }}>
                      OR
                    </Typography>
                    <Grid
                      container
                    >
                      <Grid item xs={3} className={classes.test}>
                        <FontAwesomeIcon icon={faFacebook} size='4x' color='#455892' />
                      </Grid>
                      <Grid item xs={3} className={classes.test}>
                        <FontAwesomeIcon icon={faTwitter} size='4x' color='#55ADEC' />
                      </Grid>
                      <Grid item xs={3} className={classes.test}>
                        <FontAwesomeIcon icon={faLinkedin} size='4x' color='#0274B3' />
                      </Grid>
                      <Grid item xs={3} className={classes.test}>
                        <FontAwesomeIcon icon={faGoogle} size='4x' color='#E43E2B' />
                      </Grid>
                    </Grid>
                    <FormControlLabel
                      control={<Checkbox value='remember' color='primary' />}
                      label='Remember me'
                    />
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
                        <Link href='#' variant='body2'>
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link href='#' variant='body2'>
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
