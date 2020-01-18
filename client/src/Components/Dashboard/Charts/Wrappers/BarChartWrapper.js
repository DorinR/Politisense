import React, {Component, useEffect,useRef} from 'react'
import BarPieChart from '../BarPieCharts'
import BarChart from '../BarChart'
import D3Chart from "../D3Chart";
import SimilaritiesPieChart from "../SimilaritiesPieChart";
export default class BarChartWrapper extends Component {
  state = { chart: null }

  componentDidMount () {
    this.setState({
      chart: new SimilaritiesPieChart(this.refs.chart,this.props.data)
    })
  //   // switch (this.props.type) {
  //   //   case 'bar-pie':
  //   //     return new BarPieChart(this.refs.chart)
  //   //   case 'bar':
  //   //     return new BarChart(this.refs.chart)
  //   //   default: return new SimilaritiesPieChart(this.refs.chart,this.props.data1,this.props.data2)
  //    new SimilaritiesPieChart(this.refs.chart,this.props.data1,this.props.data2)
  //   // console.log("the infor from the head to head " + this.props.data)
    }



  shouldComponentUpdate() {
      return  false;
  }
  // //
  componentWillReceiveProps(nextProps) {
    this.state.chart.update(nextProps.data) }


render() {
  return (
      <div>
        <div ref='chart' />
      </div>
  )
}


}
