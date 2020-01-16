import React, { Component } from 'react'
import BarPieChart from '../BarPieCharts'
import BarChart from '../BarChart'
import D3Chart from "../D3Chart";
export default class BarChartWrapper extends Component {
  componentDidMount () {
    switch (this.props.type) {
      case 'bar-pie':
        return new BarPieChart(this.refs.chart)
      case 'bar':
        return new BarChart(this.refs.chart)
      default: return new D3Chart(this.refs.chart,this.props.categoryType)
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
