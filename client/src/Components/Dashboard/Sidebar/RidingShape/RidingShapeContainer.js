import React, { useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import RidingShape from './RidingShape'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(theme => ({
  customCardContent: {
    padding: 5,
    paddingBottom: '5px!important',
    backgroundColor: '#f7f7f7'
  },
  customHeadingText: {
    color: '#41aaa8',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  customTextFormatting: {
    textTransform: 'capitalize'
  }
}))

export async function fetchRidingShape(ridingCode) {
  console.log('calling api with this riding code: ', ridingCode)
  try {
    const response = await fetch(
      `https://represent.opennorth.ca/boundaries/federal-electoral-districts/${ridingCode}/simple_shape`,
      { mode: 'cors' }
    )
    return await response.json()
  } catch (err) {
    console.error(err)
  }
}

export function reformatGeoJson(geoJsonFile) {
  let type = geoJsonFile.type
  let coordinates = geoJsonFile.coordinates
  const reformattedGeoJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: type,
          coordinates: coordinates
        }
      }
    ]
  }
  return reformattedGeoJson
}

export default function RidingShapeContainer(props) {
  const classes = useStyles()
  const [ridingShape, setRidingShape] = useState('')

  useEffect(() => {
    async function getData() {
      const ridingShape = await fetchRidingShape(props.ridingCode)
      setRidingShape(ridingShape)
    }
    if (props.ridingCode) {
      getData()
    }
  }, [props.ridingCode])

  return (
    <div>
      <Box mx='auto' />
      <RidingShape
        ridingShapeCoordinates={ridingShape}
        politicalParty={props.politicalParty}
      />
      <Box mx='auto' />
    </div>
  )
}
