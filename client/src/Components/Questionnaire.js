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
import { fetchCategories, formattingCategory } from './Dashboard/Utilities/CommonUsedFunctions'

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
  center: {
    textAlign: 'center'
  }
}))

function getSteps () {
  return ['Voting Issue', 'Area of Interest', 'Postal Code']
}

async function validateRiding (postalCode) {
  return axios.post('/api/users/setRiding', {
    postalCode: postalCode
  })
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
      return null
    })
    .catch(e => {
      return null
    })
}

export default function HorizontalLinearStepper (props) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()
  // eslint-disable-next-line no-unused-vars
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

  const [options, setOptions] = useState([])
  React.useEffect(() => {
    async function getCategoryList () {
      const categories = await fetchCategories()
      setOptions(categories)
    }
    getCategoryList()
  }, [])

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
                  {options ? options.map((option, key) => (
                    <FormControlLabel
                      key={key}
                      value={option}
                      control={<Radio />}
                      label={formattingCategory(option)}
                    />)
                  )
                    : ''}
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
                        label={formattingCategory(option)}
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
  const [riding, setRiding] = React.useState(null)
  const [user] = React.useState(props.location.state.user)

  const handleSubmit = e => {
    e.preventDefault()
    if (riding) {
      const userToSignup = user
      userToSignup.postalCode = postalCode
      userToSignup.riding = riding
      userToSignup.categories = [category1, category2]

      // eslint-disable-next-line no-undef
      localStorage.setItem('user', JSON.stringify(userToSignup))
      axios.post('/api/users/signup', userToSignup)
      props.history.push('/general')
    }
  }

  const checkValidPostalCode = async () => {
    const postalCodeFormat = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
    const errors = {}
    errors.postalCode = !postalCode.match(postalCodeFormat)
      ? 'Invalid postal code'
      : ''
    let valid = errors.postalCode === ''
    if (valid) {
      const rdn = await validateRiding(postalCode)
      if (rdn) {
        setRiding(rdn)
      } else {
        errors.postalCode = 'Invalid postal code'
      }
      valid = valid && rdn
    }
    setErrors(errors)
    return valid
  }

  const handleNext = async () => {
    let valid = true
    if (activeStep === steps.length - 2) {
      valid = category2
    }
    if (activeStep === steps.length - 1) {
      valid = await checkValidPostalCode()
    }
    if (valid) {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep === steps.length - 2) {
      setCatergory2('')
    }
    const history = {}
    if (activeStep === 0 && user && user.firstname !== ' ') {
      history.pathname = '/signup'
      history.state = { user: user }
    } else if (activeStep === 0) {
      history.pathname = '/login'
    }

    if (Object.keys(history).length > 0) {
      props.history.push(history)
    } else {
      setActiveStep(prevActiveStep => prevActiveStep - 1)
    }
  }

  const handleReset = () => {
    setActiveStep(0)
    setPostalCode('')
  }

  if (!props.location.state) {
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
              {steps.map(label => {
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
            <div className={classes.center}>
              {activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    You're almost done! Once you confirm, we will send you an email with a link to activate your account!
                  </Typography>
                  <div className={classes.actions}>
                    <Button
                      className={classes.button}
                      onClick={handleReset}
                      variant='contained'
                      color='primary'
                    >
                      Redo registration
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
