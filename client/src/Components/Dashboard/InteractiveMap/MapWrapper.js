import React, { Component } from 'react'
import InteractiveMap from './InteractiveMap'

export default class MapWrapper extends Component {
  componentDidMount () {
    // eslint-disable-next-line no-new
    this.setState({ map: new InteractiveMap(this.refs.chart) })
  }

  componentWillReceiveProps (nextProps) {
    this.state.map.update(nextProps.gender)
  }

  render () {
    return (
      <div>
        <div ref='chart' />
      </div>
    )
  }
}
