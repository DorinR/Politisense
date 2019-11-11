import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import { Redirect } from 'react-router'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  root: {
    width: '100%'
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    flexGrow: 1,
    textAlign: 'center'
  },
  pos: {
    marginBottom: 12
  },
  pad: {
    marginTop: 10
  },
  test: {
    textAlign: 'center'
  }
}))

function getSteps () {
  return ['Voting Issue', 'Area of Interest', 'Postal Code']
}

export async function setRiding (postalCode) {
  const result = await axios
    .post('http://localhost:5000/api/users/setRiding', {
      postalCode: postalCode
    })
    .then(res => {
      return res
    })
    .catch(e => {
      console.error(e)
    })
  return result
}

export default function HorizontalLinearStepper (props) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()
  // eslint-disable-next-line no-unused-vars
  const [options, setOptions] = useState(['Economics', 'Social Issues', 'Healthcare'])
  const [category1, setCatergory1] = useState('Economics')
  const [category2, setCatergory2] = useState('')
  const [errors, setErrors] = useState({ postalCode: '' })
  const [postalCode, setPostalCode] = useState('')

  const handleChangeCategory1 = event => {
    setCatergory1(event.target.value)
  }

  const handleChangeCategory2 = event => {
    setCatergory2(event.target.value)
  }

  function getStepContent (step) {
    switch (step) {
      case 0:
        return (
          <Card className={classes.card}>
            <CardContent>
              <FormControl component='fieldset' className={classes.formControl}>
                <FormLabel component='legend'>
                  What issue brings you out to vote?
                </FormLabel>
                <RadioGroup
                  aria-label='issue'
                  name='issue'
                  value={category1}
                  onChange={handleChangeCategory1}
                >
                  <FormControlLabel
                    value='Economics'
                    control={<Radio />}
                    label='Economics'
                  />
                  <FormControlLabel
                    value='Social Issues'
                    control={<Radio />}
                    label='Social Issues'
                  />
                  <FormControlLabel
                    value='Healthcare'
                    control={<Radio />}
                    label='Healthcare'
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        )
      case 1:
        return (
          <Card className={classes.card}>
            <CardContent>
              <FormControl component='fieldset' className={classes.formControl}>
                <FormLabel component='legend'>
                  What issue would you like to know more about?
                </FormLabel>
                <RadioGroup
                  aria-label='issue'
                  name='issue'
                  value={category2}
                  onChange={handleChangeCategory2}
                >
                  {options &&
                    options.map(option =>
                      option !== category1 ? (
                        <FormControlLabel
                          value={option}
                          control={<Radio />}
                          label={option}
                          key={option}
                        />
                      ) : null
                    )}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <form noValidate>
            <TextField
              onChange={e => setPostalCode(e.target.value)}
              variant='outlined'
              required
              fullWidth
              id='postal_code'
              label='Postal Code'
              name='postalCode'
              error={errors.postalCode !== ''}
              helperText={errors.postalCode}
            />
          </form>
        )
      default:
        return 'Unknown step'
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (postalCode) {
      setRiding(postalCode)
        .then(res => {
          if (res.data.success) {
            const userToSignup = props.location.state.user
            userToSignup.postalCode = postalCode
            userToSignup.riding = res.data.data
            userToSignup.category1 = category1
            userToSignup.category2 = category2
            // eslint-disable-next-line no-undef
            localStorage.setItem('user', JSON.stringify(userToSignup))
            axios.post('http://localhost:5000/api/users/signup', userToSignup)
            props.history.push('/dashboard')
          } else {
            console.log('Could not fetch riding')
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  const checkValidPostalCode = () => {
    const postalCodeFormat = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
    const errors = {}
    errors.postalCode = !postalCode.match(postalCodeFormat)
      ? 'Invalid postal code'
      : ''
    setErrors(errors)
    return errors.postalCode === ''
  }

  const handleNext = () => {
    let valid = true
    if (activeStep === steps.length - 2) {
      valid = category2
    }
    if (activeStep === steps.length - 1) {
      valid = checkValidPostalCode()
    }
    if (valid) {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep === steps.length - 2) {
      setCatergory2('')
    }
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    setPostalCode('')
  }

  if (props.location.state === undefined) {
    return <Redirect to='/login' />
  }

  return (
    <div className={classes.root}>
      <div>
        <div>
          <AppBar position='static'>
            <Toolbar>
              <Typography variant='h6' className={classes.title}>
                Questionnaire
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
      </div>
      <div className={classes.pad}>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={8}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {}
                const labelProps = {}
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </Grid>
        </Grid>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={3}>
            <div className={classes.test}>
              {activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    Registration completed. You're all set!
                  </Typography>
                  <div className={classes.actions}>
                    <Button
                      className={classes.button}
                      onClick={handleReset}
                    >Reset
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      variant='contained'
                      color='primary'
                      className={classes.button}
                    >
                    Confirm information
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className={classes.question}>
                    <div className={classes.instructions}>
                      {getStepContent(activeStep)}
                    </div>
                  </div>
                  <div className={classes.actions}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleNext}
                      className={classes.button}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
