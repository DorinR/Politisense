// eslint-disable-next-line no-unused-vars
import mapStyling from './Map.css'
import React, { Component } from 'react'
import CanadaMap from './CanadaMap'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import CachedIcon from '@material-ui/icons/Cached'

const divStyle = {
  marginTop: 70,
  marginLeft: 100
}

export default class ChartWrapper extends Component {
  componentDidMount() {
    // eslint-disable-next-line no-new
    new CanadaMap(this.refs.mapHolde, this.props.data)
  }

  render() {
    return (
      <div>
        <div style={divStyle} id='map-holder' ref='mapHolder'>
          <div className='right-sidebar'>
            <div id='tooltip' className='hidden'>
              <div id='closebutton'>
                <button className='icon' border='0'>
                  Close
                </button>
              </div>
              <svg id='testing' width='200' height='200'>
                {' '}
              </svg>
              <div id='value' />
            </div>
          </div>
          <div id='map-wrapper'>
            <div className='zoom-buttons'>
              <div className='zoom-button' id='zoomin'>
                <IconButton>
                  <AddCircleIcon fontSize='large' />
                </IconButton>
              </div>
              <div className='zoom-button zoombutton-out disable' id='zoomout'>
                <IconButton>
                  <RemoveCircleIcon fontSize='large' />
                </IconButton>
              </div>
              <div className='zoom-button zoombutton-out disable' id='reset'>
                <IconButton>
                  <CachedIcon fontSize='large' />
                </IconButton>
              </div>
            </div>
            <svg id='map' />
          </div>
        </div>
      </div>
    )
  }
}
