import MapWrapper from './MapWrapper'
import React, { Component } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

class Map extends Component {
  constructor () {
    super()
    this.state = { gender: 'men' }
  }

  setGender (gender) {
    this.setState({ gender })
  }

  handleButtonClick () {
    if (this.state.gender === 'men') {
      this.setState({ gender: 'women' })
    } else {
      this.setState({ gender: 'men' })
    }
  }

  render () {
    return (
      <div>
        <Box m={2} />
        <Button
          color='secondary'
          size='large'
          onClick={this.handleButtonClick}
        />

        <MapWrapper genderSetter={this.state.gender} />
      </div>
    )
  }
}

export default Map
