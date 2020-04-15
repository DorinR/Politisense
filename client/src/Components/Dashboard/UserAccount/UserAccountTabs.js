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
  card: {
    height: 350
  },
  search: {
    marginBottom: '30px',
    backgroundColor: 'white'
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  content: {
    padding: theme.spacing(8, 0, 6)
  },
  prime: {
    marginTop: '30px',
    marginBottom: '30px',
    width: '45%'
  },
  help: {
    cursor: 'pointer'
  },
  cardHeader: {
    backgroundColor: '#00BCD4',
    color: 'white',
    height: '100px'
  },
  image: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(4)
  }
}))

// const useStyles = makeStyles(theme => ({
//   root: {
//     backgroundColor: theme.palette.background.paper,
//     width: 500,
//     marginTop: 30,
//     marginLeft: 20
//   }
// }))

export default function FullWidthTabs () {
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = index => {
    setValue(index)
  }

  return (
      <Grid container>
        <Container maxWidth="sm">
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
              <Container>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                >
                  Delete Account
                </Button>
              </Container>
          </div>
        </Container>
      </Grid>

  )
}
