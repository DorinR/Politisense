import React, { Component } from 'react'
import SimilaritiesPieChart from "../SimilaritiesPieChart"

export default class D3ChartHeadVsHeadComparison extends Component {
    componentDidMount () {
        return  new SimilaritiesPieChart(this.refs.chart,this.props.data)
    }

    render () {
        return (
            <div>
                <div ref='chart' />
            </div>
        )
    }
}
