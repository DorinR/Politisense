/* eslint-disable no-undef */
/* eslint-env node */
import React, { useEffect, useState } from 'react'
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
import Questionnaire from './Components/Questionnaire'
import GeneralDashboard from './Components/Dashboard/General/GeneralDashboard'
import CategoryDashboard from './Components/Dashboard/CategoryDashboard'
import BillHistoryTable from './Components/Dashboard/PastBills/BillHistoryTable'
import BudgetContainer from './Components/Dashboard/Budget/BudgetContainer'
import CompareContainer from './Components/Dashboard/Compare/CompareContainer'
import MapContainer from './Components/Map/MapContainer'
import axios from 'axios'

const App = () => {
  const [ridingCodes, setRidingCodes] = useState(null)
  const [shapeData, setShapeData] = useState('')
  const [ridingMpData, setRidingMpData] = useState('')
  useEffect(() => {
    async function fetchData () {
      return axios
        .get('/api/ridings/getRidingByRidingCode')
        .then(res => {
          if (res.data.success) {
            setRidingCodes(res.data.data)
          }
        })
        .catch(console.error)
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData () {
      return axios
        .get('/api/mapSupportData/shape/getMapSupportData')
        .then(res => {
          if (res.data.success) {
            setShapeData(res.data.data)
          }
        })
        .catch(console.error)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData () {
      return axios
        .get('/api/mapSupportData/electionResults/getMapSupportData')
        .then(res => {
          if (res.data.success) {
            setRidingMpData(res.data.data)
          }
        })
        .catch(console.error)
    }
    fetchData()
  }, [])
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
          <PrivateRoute
            path='/map' component={MapContainer}
            ridingCodes={ridingCodes}
            shapeData={shapeData}
            ridingMpData={ridingMpData}
          />
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
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('user') ? (
          <Component {...props} {...rest} />
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
