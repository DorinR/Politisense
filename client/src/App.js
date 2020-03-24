/* eslint-disable no-undef */
/* eslint-env node */
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import Logout from './Components/Logout'
import UserAccountTabs from './Components/Dashboard/UserAccount/UserAccountTabs'
import MapWrapper from './Components/Dashboard/MapWrapper'
import Questionnaire from './Components/Questionnaire'
import MyMP from './Components/MyMP/MyMP'
import GeneralDashboard from './Components/Dashboard/General/GeneralDashboard'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useMediaQuery } from '@material-ui/core'
import Sidebar from './Components/Navbar/Navbar'
import Topbar from './Components/Navbar/Topbar'
import CompareContainer from './Components/Dashboard/Compare/CompareContainer'
import IssuedBillsByCategory from './Components/MyMP/IssuedBillsByCategory'
const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 220
  },
  content: {
    flexGrow: 1,
    height: '100%',
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -220
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}))

const App = () => {
  const classes = useStyles()
  const theme = useTheme()

  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  })
  const [openSidebar, setOpenSidebar] = useState(true)
  const handleSidebarOpen = () => {
    setOpenSidebar(true)
  }
  const handleSidebarClose = () => {
    setOpenSidebar(false)
  }

  const LoginContainer = () => (
    <div className='container'>
      <Route exact path='/' render={() => <Redirect to='/login' />} />
      <Route path='/signup' component={SignUp} />
      <Route path='/login' component={Login} />
    </div>
  )
  const DefaultContainer = () => (
    <div>
      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: isDesktop || true
        })}
      >
        <Sidebar
          onClose={handleSidebarClose}
          open={openSidebar}
          variant={isDesktop ? 'persistent' : 'temporary'}
          onSidebarOpen={handleSidebarOpen}
        />
        <Topbar
          onSidebarOpen={handleSidebarOpen}
        />

        <div className={clsx(classes.content, {
          [classes.contentShift]: openSidebar
        })}
        >
          <Route exact path='/' render={() => <Redirect to='/login' />} />
          <PrivateRoute path='/logout' component={Logout} />
          <PrivateRoute path='/map' component={MapWrapper} />
          <PrivateRoute path='/account' component={UserAccountTabs} />
          <PrivateRoute path='/general' component={GeneralDashboard} />
          <PrivateRoute path='/myRepresentative' component={MyMP} />
          <PrivateRoute path='/compare' component={CompareContainer} />
          <PrivateRoute path='/performance' component={IssuedBillsByCategory} />
        </div>
      </div>
    </div>
  )

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('user') ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' /> // eslint-disable-next-line
        )}
    />
  )

  return (
    <Router>
      <Switch>
        <Route exact path='/(login)' component={LoginContainer} />
        <Route exact path='/signup' component={LoginContainer} />
        <Route exact path='/question' component={Questionnaire} />
        <Route component={DefaultContainer} />
      </Switch>
    </Router>
  )
}

export default App
