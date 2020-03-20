import React, { Component } from 'react'
import BarPieChart from '../BarPieCharts'
import BarChart from '../BarChart'
import DonutChart from '../DonutChart'
import D3Chart from '../D3Chart'
import BudgetChartD3 from '../BudgetChartD3'
import D3GaugeChart from "../D3GaugeChart";
export default class BarChartWrapper extends Component {
  componentDidMount () {
    switch (this.props.type) {
      case 'budget':
        return new BudgetChartD3(this.refs.chart, this.props.data)
      case 'bar-pie':
        return new BarPieChart(this.refs.chart,this.props.data, this.props.categories,  this.refs.container,)
      case 'bar':
        return new BarChart(this.refs.chart)
      case 'donut':
        return new DonutChart(this.refs.chart, this.props.data)
      case 'gauge':
        return new D3GaugeChart(this.refs.chart,this.props.data)
      default: return new D3Chart(this.refs.chart, this.props.data, this.props.categoryType)
    }
  }

  render () {
    return (
      <div ref={"container"}>
        <div ref='chart' id={'chart'} />
      </div>
    )
  }
}
