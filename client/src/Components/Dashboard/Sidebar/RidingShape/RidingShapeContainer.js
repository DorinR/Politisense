/* global fetch */
import React, { useEffect, useState } from 'react'
import RidingShape from './RidingShape'
import Box from '@material-ui/core/Box'
import CenteredCircularProgress from '../../Utilities/CenteredCircularProgress'

export async function fetchRidingShape (ridingCode) {
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

export default function RidingShapeContainer (props) {
  const [ridingCode, setRidingCode] = useState(null)
  useEffect(() => {
    if (props.ridingCode && props.ridingCode !== ridingCode) {
      setRidingCode(props.ridingCode)
    }
  }, [ridingCode, props.ridingCode])

  const [ridingShape, setRidingShape] = useState(null)
  useEffect(() => {
    async function getData () {
      if (ridingCode) {
        const ridingShape = await fetchRidingShape(ridingCode)
        setRidingShape(ridingShape)
      }
    }
    getData()
  }, [ridingCode])

  return (
    <div>
      <Box mx='auto' />
      {ridingShape && ridingCode && props.politicalParty ? (
        <RidingShape
          ridingShapeCoordinates={ridingShape}
          politicalParty={props.politicalParty}
          code={ridingCode}
        />
      ) : (
        <CenteredCircularProgress />
      )}
      <Box mx='auto' />
    </div>
  )
}
