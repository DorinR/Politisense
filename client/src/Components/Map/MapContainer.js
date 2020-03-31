import MapWrapper from './MapWrapper'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import InfoBubble from '../Dashboard/Utilities/InfoBubble'
import { makeStyles } from '@material-ui/core/styles'

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

export default function MapContainer () {
  const classes = useStyles()
  const [data, setData] = useState(null)
  const [shapeData, setShapeData] = useState('')
  const [ridingMpData, setRidingMpData] = useState('')

  useEffect(() => {
    async function fetchData () {
      await axios
        .get('/api/ridings/getRidingByRidingCode')
        .then(res => {
          if (res.data.success) {
            setData(res.data.data)
            console.log(res.data.data)
            return res.data.data
          }
        })
        .catch(console.error)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData () {
      await axios
        .get('/api/mapSupportData/shape/getMapSupportData')
        .then(res => {
          if (res.data.success) {
            console.log('shape data:')
            console.log(res.data.data)
            setShapeData(res.data.data)
          }
        })
        .catch(console.error)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData () {
      await axios
        .get('/api/mapSupportData/electionResults/getMapSupportData')
        .then(res => {
          if (res.data.success) {
            console.log('riding data:')
            console.log(res.data.data)
            setRidingMpData(res.data.data)
          }
        })
        .catch(console.error)
    }
    fetchData()
  }, [])

  return (
    <div>
      <Box m={2} />
      <Container>
        <Typography
          style={{ display: 'inline-block' }}
          className={classes.customHeaders}
          align='left'
          color='primary'
          gutterBottom
        >
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
      <Container>
        {data !== null && data !== undefined ? (
          <MapWrapper
            ridingCodes={data}
            shapeData={shapeData}
            ridingMpData={ridingMpData}
          />
        ) : (
          ''
        )}
      </Container>
    </div>
  )
}
