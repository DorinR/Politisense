import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import Navbar from './Components/Navbar'
import Questions from './Components/Questions'
import Dashboard from './Components/Dashboard/Dashboard'
import Map from './Components/Map'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { isLoggedin: true }
  }

  render () {
    return (
      <div>
        {(this.state.isLoggedin)
          ? <Router>
            <Navbar>
              <div>
                <Switch>
                  <Route exact path='/' component={Login} />
                  {/* <Route path='/login' component={Login} /> */}
                  <Route path='/signup' component={SignUp} />
                  <Route path='/questions' component={Questions} />
                  <Route path='/dashboard' component={Dashboard} />
                  <Route path='/map' component={Map} />
                </Switch>
              </div>
            </Navbar></Router>
          : <Router>
            <div>
              <Switch>
                <Route exact path='/' component={Login} />
              </Switch>
            </div>
          </Router>}
      </div>
    )
  }
}

export default App
