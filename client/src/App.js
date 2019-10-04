import React, { Component, useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import Navbar from './Components/Navbar'
import Questions from './Components/Questions'
import Dashboard from './Components/Dashboard/Dashboard'
import Map from './Components/Map'

function App () {
  const [login, setLogin] = useState(true)

  return (
    <div>
      {(login)
        ?
          <Navbar>
            <div>
              <Router>
              <Switch>
                {/* this is in the case of the user is logged in */}
                <Route path='/'  component={Dashboard} />
                <Route path='/login' component={Dashboard} />
                <Route path='/signup' component={SignUp} />
                <Route path='/questions' component={Questions} />
                <Route path='/dashboard' component={Dashboard} />
                <Route path='/map' component={Map} />
              </Switch>
              </Router>
            </div>
          </Navbar>
        :
          <div>
            <Router>
              <Switch>
                {/* this is in the case of the user is not logged in */}
                <Route exact path='/' component={Login} />
                <Route path='/login' component={Login} />
                <Route path='/signup' component={SignUp} />
                <Route path='/questions' component={Questions} />
                <Route path='/dashboard' component={Dashboard} />
                <Route path='/map' component={Map} />
              </Switch>
            </Router>
          </div>





      }
    </div>
  )
}

export default App
