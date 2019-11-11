import React, { Component } from 'react'
import BarPieChart from '../BarPieCharts'
import BarChart from '../BarChart'
import DonutChart from '../DonutChart'
// import {D3Chart} from '../D3Chart'
export default class BarChartWrapper extends Component {
  componentDidMount () {
    switch (this.props.type) {
      case 'bar-pie':
        return new BarPieChart(this.refs.chart)
        break
      case 'bar':
        return new BarChart(this.refs.chart)
        break
      default: return new DonutChart(this.refs.chart)
    }
  }

  render () {
    return (
      <div>
        <div ref='chart' />
      </div>
    )
  }
}
