import MapWrapper from './MapWrapper'
import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import InfoBubble from '../Utilities/InfoBubble'
import axios from 'axios'

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    marginTop: '-100px'
  },
  customHeaders: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: '3em'
  },
  mapContainer: {
    margin: '10px'
  },
  mapWrapper: {
    display: 'inline-block',
    width: '94%'
  },
  mapCentering: {
    textAlign: 'center'
  }
})

export default function Map() {
  const classes = useStyles()
  const [zoomReset, setZoomReset] = useState(1)
  const [hasZoomBeenChanged, setHasZoomBeenChanged] = useState(false)

  const handleZoomReset = () => {
    setZoomReset((zoomReset + 1) % 2)
  }

  const updateZoomStatus = newState => {
    setHasZoomBeenChanged(newState)
  }

  useEffect(async () => {
    const result = await axios.get('/')
  })

  return (
    <div className={classes.mapContainer}>
      <Box m={2} />
      <Container>
        <Typography
          style={{ display: 'inline-block' }}
          className={classes.customHeaders}
          align='left'
          color='primary'
          gutterBottom>
          Explore Canadian Ridings
        </Typography>
        <span className={classes.customTooltip}>
          <InfoBubble
            title='How To Use the Map'
            text={
              /* eslint-disable-next-line indent */
              "Zooming on this map is done the same way you scroll on a webpage. Just use the clickwheel on your mouse or use two fingers on your trackpad. Click on a given riding and the map will automatically zoom-in to the appropriate level. Clicking on the 'Reset Zoom Level' button will bring the zoom level back to what it was at the beginning"
            }
          />
        </span>
      </Container>
      <div className={classes.mapCentering}>
        <div className={classes.mapWrapper}>
          <MapWrapper
            zoomReset={zoomReset}
            zoomChangeTracker={updateZoomStatus}
          />
        </div>
        {hasZoomBeenChanged && (
          <Button className={classes.root} onClick={handleZoomReset}>
            {' '}
            Reset Zoom Level{' '}
          </Button>
        )}
      </div>
    </div>
  )
}
