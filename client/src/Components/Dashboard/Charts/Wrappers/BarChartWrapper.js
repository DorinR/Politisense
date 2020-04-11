import React, { Component } from 'react'
import BarPieChart from '../BarPieCharts'
import BarChart from '../BarChart'
import D3Chart from '../D3Chart'
import BudgetChartD3 from '../BudgetChartD3'
import RadialD3Chart from '../RadialD3Chart'
export default class BarChartWrapper extends Component {
  componentDidMount () {
    switch (this.props.type) {
      case 'budget':
        return new BudgetChartD3(this.refs.chart, this.props.data)
      case 'bar-pie':
        return new BarPieChart(this.refs.chart, this.props.data, this.props.categories, this.refs.container)
      case 'bar':
        return new BarChart(this.refs.chart)
      case 'gauge':
        return new RadialD3Chart(this.refs.chart, this.props.data)
      default: return new D3Chart(this.refs.chart, this.props.data, this.props.categoryType)
    }
  }

  render () {
    return (
      <div ref='chart' id='chart' />
    )
  }
}
