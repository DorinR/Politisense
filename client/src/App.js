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
import Questionnaire from './Components/Questionnaire'
import GeneralDashboard from './Components/Dashboard/GeneralDashboard'
import CategoryDashboard from './Components/Dashboard/CategoryDashboard'
import BillHistoryTable from './Components/Dashboard/PastBills/BillHistoryTable'
import BudgetContainer from './Components/Dashboard/Budget/BudgetContainer'
//import PollsMainPage from './Components/Dashboard/Polls/PollsMainPage'
import LegislativeActivities from './Components/Dashboard/Polls/LegislativeActivities'

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
          <PrivateRoute path='/logout' component={Logout} />
          <PrivateRoute path='/map' component={MapWrapper} />
          <PrivateRoute path='/polls' component={LegislativeActivities} />
          <PrivateRoute path='/account' component={UserAccountTabs} />
          <PrivateRoute path='/general' component={GeneralDashboard} />
          <PrivateRoute path='/categories' component={CategoryDashboard} />
          <PrivateRoute path='/votingHistory' component={BillHistoryTable} />
          <PrivateRoute path='/budget' component={BudgetContainer} />
        </div>
      </Navbar>
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
