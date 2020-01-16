/* eslint-disable no-undef */
/* eslint-env node */
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import Navbar from './Components/Navbar'
import Logout from './Components/Logout'
import UserAccountTabs from './Components/Dashboard/UserAccount/UserAccountTabs'
import MapWrapper from './Components/Dashboard/MapWrapper'
import DashboardTabs from './Components/Dashboard/DashboardTabs'
import Questionnaire from './Components/Questionnaire'
import HeadToHeadComparison from "./Components/Dashboard/HeadToHeadComparison";
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
         <Route exact path='/testing1' component={HeadToHeadComparison} />

          <Route component={DefaultContainer} />
      </Switch>
    </Router>
  )
}

export default App
