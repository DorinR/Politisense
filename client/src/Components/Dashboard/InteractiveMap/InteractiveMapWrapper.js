import React, { Component } from 'react'
import InteractiveMap from './InteractiveMap'

export default class ChartWrapper extends Component {
  componentDidMount () {
    // eslint-disable-next-line no-new
    new InteractiveMap(this.refs.map)
  }

  render () {
    return (
      <div>
        <div ref='map' />
      </div>

    )
  }
}
