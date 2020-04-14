import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import Activate from './Components/Auth/Activate'
import ActivateForm from './Components/Auth/ActivateForm'
import Reset from './Components/Auth/Reset'
import ResetForm from './Components/Auth/ResetForm'
import Logout from './Components/Logout'
import UserAccountTabs from './Components/Dashboard/UserAccount/UserAccountTabs'
import Questionnaire from './Components/Questionnaire'
import MyMP from './Components/MyMP/MyMP'
import GeneralDashboard from './Components/Dashboard/General/GeneralDashboard'
import Sidebar from './Components/Navbar/Navbar'
import NotFound from './Components/NotFound'
import CompareContainer from './Components/Dashboard/Compare/CompareContainer'
import IssuedBillsByCategory from './Components/MyMP/IssuedBillsByCategory'
import MapContainer from './Components/Map/MapContainer'
import PrivateRoute from './Components/Auth/PrivateRoute'
import axios from 'axios'

const App = () => {
  const [ridingCodes, setRidingCodes] = useState(null)
  const [shapeData, setShapeData] = useState('')
  const [ridingMpData, setRidingMpData] = useState('')
  useEffect(() => {
    async function fetchData () {
      return axios
        .get('/api/ridings/getRidingByRidingCode')
        .then((res) => {
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
        .then((res) => {
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
        .then((res) => {
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
      <Route exact path='/signup' component={SignUp} />
      <Route exact path='/activate' component={ActivateForm} />
      <Route exact path='/activate/:token' component={Activate} />
      <Route exact path='/reset' component={Reset} />
      <Route exact path='/reset/:token' component={ResetForm} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/logout' component={Logout} />
    </div>
  )

  const DefaultContainer = () => (
    <div>
      <Sidebar>
        <div>
          <Route exact path='/' render={() => <Redirect to='/login' />} />

          <PrivateRoute
            path='/map'
            component={MapContainer}
            ridingCodes={ridingCodes}
            shapeData={shapeData}
            ridingMpData={ridingMpData}
          />
          <PrivateRoute path='/account' component={UserAccountTabs} />
          <PrivateRoute path='/general' component={GeneralDashboard} />
          <PrivateRoute path='/myRepresentative' component={MyMP} />
          <PrivateRoute path='/compare' component={CompareContainer} />
          <PrivateRoute path='/performance' component={IssuedBillsByCategory} />
        </div>
      </Sidebar>
    </div>
  )

  return (
    <Router>
      <Switch>
        <Route exact path='/' render={() => <Redirect to='/login' />} />
        <Route exact path='/(login)' component={LoginContainer} />
        <Route exact path='/logout' component={LoginContainer} />
        <Route exact path='/signup' component={LoginContainer} />
        <Route exact path='/activate' component={LoginContainer} />
        <Route exact path='/activate/:token' component={LoginContainer} />
        <Route exact path='/reset' component={LoginContainer} />
        <Route exact path='/reset/:token' component={LoginContainer} />
        <Route exact path='/question' component={Questionnaire} />
        <Route exact path='/map' component={DefaultContainer} />
        <Route exact path='/account' component={DefaultContainer} />
        <Route exact path='/general' component={DefaultContainer} />
        <Route exact path='/myRepresentative' component={DefaultContainer} />
        <Route exact path='/compare' component={DefaultContainer} />
        <Route exact path='/performance' component={DefaultContainer} />
        <Route exact path='/404' component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default App
