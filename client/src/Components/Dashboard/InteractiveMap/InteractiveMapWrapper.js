import React, { Component } from 'react'
import InteractiveMap from './InteractiveMap'

const divStyle = {
  marginTop: 70,
  marginLeft: 100
}
export default class ChartWrapper extends Component {
  componentDidMount () {
    // eslint-disable-next-line no-new
    new InteractiveMap(this.refs.chart)
  }

  render () {
    return (
      <div>
        <div style={divStyle} ref='chart' />
      </div>
    )
  }
}
