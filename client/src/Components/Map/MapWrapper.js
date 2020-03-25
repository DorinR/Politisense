import React, { Component } from 'react'
import CanadaMap from './CanadaMap'
import mapStyling from './Map.css'

const divStyle = {
  marginTop: 70,
  marginLeft: 100
}
const headerStyle = {
  marginLeft: 450,
  fontSize: 40
}

export default class ChartWrapper extends Component {

  componentDidMount () {
    // eslint-disable-next-line no-new
    new CanadaMap(this.refs.mapHolder)

  }

  render () {
    return (
      <div>
        <h1 style={headerStyle}> Map of Canada </h1>
        <div style={divStyle} id='map-holder' ref='mapHolder' >
          <div className="right-sidebar">
            <div id="tooltip" className="hidden">
              <div id="closebutton">
                <button className="icon" border="0">Close</button>
              </div>
              <div id="value"></div>
            </div>
          </div>
          <div id="map-wrapper">

            <div className="zoom-buttons">
              <div className="zoom-button" id="zoomin">
                <button className="zoom-button-icon" src="icons/plus.svg" border="0">+</button>
              </div>
              <div className="zoom-button zoombutton-out disable" id="zoomout">
                <button className="zoom-button-icon" src="icons/minus.svg" border="0">-</button>
              </div>
              <div className="zoom-button zoombutton-out disable" id="reset">
                <button className="zoom-button-icon" src="icons/close.svg" border="0">reset</button>
              </div>
            </div>

            <svg id="map"></svg>

          </div>
        </div>
      </div>
        )
  }
}
