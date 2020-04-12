/* eslint-disable no-undef */
/* eslint-env node */
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
import GeneralDashboard from './Components/Dashboard/General/GeneralDashboard'
import CategoryDashboard from './Components/Dashboard/CategoryDashboard'
import BillHistoryTable from './Components/Dashboard/PastBills/BillHistoryTable'
import BudgetContainer from './Components/Dashboard/Budget/BudgetContainer'
import CompareContainer from './Components/Dashboard/Compare/CompareContainer'
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
      <Navbar>
        <div>
          <Route exact path='/' render={() => <Redirect to='/login' />} />
          <PrivateRoute path='/map' component={MapContainer} />
          <PrivateRoute path='/account' component={UserAccountTabs} />
          <PrivateRoute path='/general' component={GeneralDashboard} />
          <PrivateRoute path='/categories' component={CategoryDashboard} />
          <PrivateRoute path='/votingHistory' component={BillHistoryTable} />
          <PrivateRoute path='/budget' component={BudgetContainer} />
          <PrivateRoute path='/compare' component={CompareContainer} />
        </div>
      </Navbar>
    </div>
  )

  //   async function checkUserVerified(user) {
  //       return await axios
  //           .post('/api/users/checkUserVerified', user)
  //           .then(res => {
  //               return res.data.message === 'verified'
  //           })
  //           .catch(err => console.error(err))
  //   }
  //
  // async function verified () {
  //     checkUserVerified((JSON).parse(localStorage.getItem('user'))).then(res=>{
  //         console.log(res)
  //         return res
  //     })
  // }
  //
  // function unverified () {
  //   if (localStorage.getItem('user')) {
  //     return <Unverified />
  //   } else {
  //     return <Redirect to='/login' />
  //   }
  // }
  //
  // const PrivateRoute = ({ component: Component, ...rest }) => (
  //   <Route
  //     {...rest}
  //     render={props =>
  //         verified() ? (
  //         <Component {...props} />
  //       ) : (
  //         unverified()
  //       )}
  //   />
  // )

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
