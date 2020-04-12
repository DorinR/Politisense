import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Login, {checkUserVerified} from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import Activate from './Components/Auth/Activate'
import ActivateForm from './Components/Auth/ActivateForm'
import Navbar from './Components/Navbar'
import Logout from './Components/Logout'
import UserAccountTabs from './Components/Dashboard/UserAccount/UserAccountTabs'
import Questionnaire from './Components/Questionnaire'
import MyMP from './Components/MyMP/MyMP'
import GeneralDashboard from './Components/Dashboard/General/GeneralDashboard'
import Sidebar from './Components/Navbar/Navbar'
import CompareContainer from './Components/Dashboard/Compare/CompareContainer'
import IssuedBillsByCategory from './Components/MyMP/IssuedBillsByCategory'
import MapContainer from './Components/Map/MapContainer'
import PrivateRoute from "./Components/Auth/PrivateRoute";
import axios from "axios";

const App = () => {
  const LoginContainer = () => (
    <div className='container'>
      <Route exact path='/' render={() => <Redirect to='/login' />} />
      <Route path='/signup' component={SignUp} />
      <Route exact path='/activate' component={ActivateForm} />
      <Route exact path='/activate/:token' component={Activate} />
      <Route path='/login' component={Login} />
      <Route path='/logout' component={Logout} />
    </div>
  )
  const DefaultContainer = () => (
    <div>
      <Sidebar>
        <div>
          <Route exact path='/' render={() => <Redirect to='/login' />} />
          <PrivateRoute path='/map' component={MapContainer} />
          <PrivateRoute path='/account' component={UserAccountTabs} />
          <PrivateRoute path='/general' component={GeneralDashboard} />
          <PrivateRoute path='/myRepresentative' component={MyMP} />
          <PrivateRoute path='/compare' component={CompareContainer} />
          <PrivateRoute path='/performance' component={IssuedBillsByCategory} />
        </div>
      </Sidebar>
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
        <Route path='/logout' component={LoginContainer} />
        <Route exact path='/signup' component={LoginContainer} />
        <Route exact path='/activate' component={LoginContainer} />
        <Route exact path='/activate/:token' component={LoginContainer} />
        <Route exact path='/question' component={Questionnaire} />
        <Route component={DefaultContainer} />
      </Switch>
    </Router>
  )
}

export default App
