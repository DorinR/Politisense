// eslint-disable-next-line no-unused-vars
import mapStyling from './Map.css'
import React, { Component } from 'react'
import CanadaMap from './CanadaMap'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import CachedIcon from '@material-ui/icons/Cached'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'

const divStyle = {
  marginTop: 70,
  marginLeft: 100
}

export default class ChartWrapper extends Component {
  componentDidMount () {
    // eslint-disable-next-line no-new
    new CanadaMap(
      this.props.ridingCodes,
      this.props.shapeData,
      this.props.ridingMpData
    )
  }

  render () {
    return (
      <div>
        <div style={divStyle} id='map-holder' ref='mapHolder'>
          <Grid container spacing={3}>
            <Grid item xs={9}>
              <div id='map-wrapper'>
                <div className='zoom-buttons'>
                  <div className='zoom-button' id='zoomin'>
                    <Tooltip title='Zoom-In' placement='left'>
                      <IconButton>
                        <AddCircleIcon fontSize='large' />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div
                    className='zoom-button zoombutton-out disable'
                    id='zoomout'
                  >
                    <Tooltip title='Zoom-Out' placement='left'>
                      <IconButton>
                        <RemoveCircleIcon fontSize='large' />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div
                    className='zoom-button zoombutton-out disable'
                    id='reset'
                  >
                    <Tooltip title='Reset to Default' placement='left'>
                      <IconButton>
                        <CachedIcon fontSize='large' />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <svg id='map' />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className='right-sidebar'>
                <div id='tooltip' className='hidden'>
                  <svg id='testing' width='200' height='200'>
                    {' '}
                  </svg>
                  <div id='value' />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}
