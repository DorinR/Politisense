import React, { Component } from 'react'
import BarPieChart from '../BarPieCharts'
import BarChart from '../BarChart'
import DonutChart from '../DonutChart'
import D3Chart from "../D3Chart";
import RadarChart from "../RadarChart";
import Radar from "react-d3-radar";
//billsSponsors mpsVotes

export default class BarChartWrapper extends Component {
  componentDidMount () {
    switch (this.props.type) {
      case 'bar-pie':
        return new BarPieChart(this.refs.chart,this.props.data,this.props.categories)
      case 'bar':
        return new BarChart(this.refs.chart)
      case 'donut':
        return new DonutChart(this.refs.chart,this.props.billsSponsors,this.props.mpsVotes)

      default: return new D3Chart(this.refs.chart,this.props.data,this.props.categoryType)
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
