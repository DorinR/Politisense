import React, { Component } from 'react'
import CanadaMap from './CanadaMap'

const divStyle = {
  marginTop: 70,
  marginLeft: 100
}
const headerStyle = {
  marginLeft: 450,
  fontSize: 40
}
export default class ChartWrapper extends Component {
  componentDidMount () {
    // eslint-disable-next-line no-new
    new CanadaMap(this.refs.chart)
  }

  render () {
    return (
      <div>
        <h1 style={headerStyle}> Map of Canada </h1>
        <div style={divStyle} ref='chart' />
      </div>)
  }
}
