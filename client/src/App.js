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
import Map from './Components/Dashboard/InteractiveMap/Map'
const drawerWidth = 220
const drawerWidthXlMode = 250

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%'
  },
  shiftContent: {
    paddingLeft: drawerWidth
  },
  content: {
    flexGrow: 1,
    height: '100%',
    padding: theme.spacing(3),
    overflow: 'auto',

    // transition: theme.transitions.create('margin', {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen
    // }),
    // marginLeft: -drawerWidth
  },
  //
  // content: {
  //   flexGrow: 1,
  //   height: '100vh',
  //   overflow: 'auto',
  // }

  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  shiftContentXLMode: {
    paddingLeft: drawerWidthXlMode + 10
  },
  contentXlMode: {
    flexGrow: 1,
    height: '100%',
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidthXlMode
  }

}))

const App = () => {

  const LoginContainer = () => (
    <div className='container'>
      <Route exact path='/' render={() => <Redirect to='/login' />} />
      <Route path='/signup' component={SignUp} />
      <Route path='/login' component={Login} />
    </div>
  )
  const DefaultContainer = () => (
    <div>
      {/*<div*/}
      {/*  // className={clsx({*/}
      {/*  //   [classes.root]: true,*/}
      {/*  //   [classes.shiftContent]: isDesktop,*/}
      {/*  //   [classes.shiftContentXLMode]: isxlScreen*/}
      {/*  // })}*/}
      {/*>*/}
        <Sidebar
          // onClose={handleSidebarClose}
          // open={openSidebar}
          // variant={isxlScreen ? 'persistent' : isDesktop && !mobileVersion ? 'persistent' : 'temporary'}
          // onSidebarOpen={handleSidebarOpen}
        >
        {/*<Topbar onSidebarOpen={handleSidebarOpen} />*/}

        <div
          // className={clsx(classes.content, {
          //   [classes.contentShift]: isDesktop && openSidebar,
          //   [classes.shiftContentXLMode]: isxlScreen && openSidebar
          // })}
        >
          <Route exact path='/' render={() => <Redirect to='/login' />} />
          <PrivateRoute path='/logout' component={Logout} />
          <PrivateRoute path='/map' component={Map} />
          <PrivateRoute path='/account' component={UserAccountTabs} />
          <PrivateRoute path='/general' component={GeneralDashboard} />
          <PrivateRoute path='/myRepresentative' component={MyMP} />
          <PrivateRoute path='/compare' component={CompareContainer} />
          <PrivateRoute path='/performance' component={IssuedBillsByCategory} />
        </div>
        </Sidebar>
      </div>
    // </div>
  )

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(
        props
      ) =>// eslint-disable-next-line
        localStorage.getItem('user') ? (
          <Component {...props} />
        ) : (<Redirect to='/login' />)}
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
