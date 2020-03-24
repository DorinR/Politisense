import React, { Component } from 'react'
import InteractiveMap from './InteractiveMap'

export default class MapWrapper extends Component {
  componentDidMount () {
    this.setState({
      map: new InteractiveMap(
        this.refs.chart,
        this.props.zoomChangeTracker,
        this.props.ridingShapeData
      ),
      zoomReset: this.props.zoomReset
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.zoomReset !== this.state.zoomReset) {
      this.setState({ zoomReset: nextProps.zoomReset })
      this.state.map.reset()
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
