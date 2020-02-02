/* eslint-disable no-undef */
/* eslint-env node */
import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Login from './component/auth/Login'
import SignUp from './component/auth/SignUp'
import Navbar from './component/Navbar'
import Logout from './component/Logout'
import UserAccountTabs from './component/dashboard/UserAccount/UserAccountTabs'
import MapWrapper from './component/dashboard/MapWrapper'
import DashboardTabs from './component/dashboard/DashboardTabs'
import Questionnaire from './component/Questionnaire'
import HeadToHeadComparison from './component/dashboard/HeadToHeadComparison'

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
      <Navbar>
        <div>
          <Route exact path='/' render={() => <Redirect to='/login' />} />
          <PrivateRoute path='/dashboard' component={DashboardTabs} />
          <PrivateRoute path='/logout' component={Logout} />
          <PrivateRoute path='/map' component={MapWrapper} />
          <PrivateRoute path='/account' component={UserAccountTabs} />
          <PrivateRoute path='/headToHeadComparison' component={HeadToHeadComparison} />

        </div>
      </Navbar>
    </div>
  )

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('user') ? (<Component {...props} />) : (<Redirect to='/login' />)}
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
