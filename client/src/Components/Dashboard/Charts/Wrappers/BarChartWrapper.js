import React, { Component } from "react";
import BarPieChart from "../BarPieCharts";
import BarChart from "../BarChart";
import DonutChart from "../DonutChart";
import D3BudgetChart from "../../Budget/Charts/D3BudgetChart.js";

export default class BarChartWrapper extends Component {
  componentDidMount() {
    switch (this.props.type) {
      case "bar-pie":
        return new BarPieChart(this.refs.chart);
      case "bar":
        return new BarChart(this.refs.chart);
      case "bullet":
        return new D3BudgetChart(this.refs.chart, this.props.data);
      default:
        return new DonutChart(this.refs.chart);
    }
  }

  render() {
    return (
      <div>
        <div ref="chart" />
      </div>
    );
  }
}
