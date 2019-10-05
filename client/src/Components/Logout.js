import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  componentDidMount = () => {
    localStorage.clear();
    this.setState({
      redirect: true
    })
  }

  render() {
    return (
      <div>
        <Redirect to='/'/>
      </div>
    );
  }
}

export default Logout;