import React, { Component } from 'react'
import InteractiveMap from './InteractiveMap'

export default class MapWrapper extends Component {
  state = {
    map: null,
    zoomReset: 0
  }

  componentDidMount() {
    this.setState({
      map: new InteractiveMap(this.refs.chart),
      zoomReset: this.props.zoomReset
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.zoomReset !== this.state.zoomReset) {
      this.setState({ zoomReset: nextProps.zoomReset })
      this.state.map.reset()
    }
  }

  render() {
    return (
      <div>
        <div ref='chart' />
      </div>
    )
  }
}
