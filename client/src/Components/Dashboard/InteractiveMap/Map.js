import MapWrapper from './MapWrapper'
import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { CSSTransition } from 'react-transition-group'

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px'
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

  return (
    <div>
      <Box m={2} />
      <MapWrapper zoomReset={zoomReset} zoomChangeTracker={updateZoomStatus} />
      <CSSTransition
        in={hasZoomBeenChanged}
        timeout={500}
        classNames='fade'
        unmountOnExit>
        <Button className={classes.root} onClick={handleZoomReset}>
          {' '}
          Reset Zoom Level{' '}
        </Button>
      </CSSTransition>
    </div>
  )
}
