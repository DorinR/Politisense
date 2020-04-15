import React from 'react'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ViewAccountDetails from './ViewAccountDetails'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import ChangeAccountPassword from './ChangeAccountPassword'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import axios from 'axios'
import { Redirect } from 'react-router'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(8, 0, 6)
  },
  button: {
    justifyContent: 'center'
  }
}))

export async function deleteAccount () {

}

export default function FullWidthTabs () {
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = React.useState(0)
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseDelete = () => {
    setOpen(false)
    // eslint-disable-next-line no-undef
    const user = JSON.parse(localStorage.getItem('user'))
    return axios
      .post('/api/users/deleteAccount', { email: user.email })
      .then(res => {
        return <Redirect to='/login' />
      })
      .catch(console.error)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = index => {
    setValue(index)
  }

  return (
    <Grid container>
      <Container maxWidth='sm'>
        <div className={classes.content}>
          <AppBar position='static' color='default'>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor='primary'
              textColor='primary'
              variant='fullWidth'
              aria-label='full width tabs example'
            >
              <Tab label='View Account Details' {...a11yProps(0)} />
              <Tab label='Change Password' {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <ViewAccountDetails />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <ChangeAccountPassword />
            </TabPanel>
          </SwipeableViews>
          <Grid container justify='center'>
            <Button
              variant='contained'
              color='secondary'
              className={classes.button}
              onClick={handleClickOpen}
            >
                Delete My Account
            </Button>
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>Are you sure you want to delete your account?</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                  This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                  Cancel
              </Button>
              <Button onClick={handleCloseDelete} color='primary' autoFocus>
                  Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Container>
    </Grid>

  )
}
