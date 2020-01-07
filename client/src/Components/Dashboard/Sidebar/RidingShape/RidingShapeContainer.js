/* global fetch */
import React, { useState, useEffect } from 'react'
import RidingShape from './RidingShape'
import Box from '@material-ui/core/Box'

export async function fetchRidingShape (ridingCode) {
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

export default function RidingShapeContainer (props) {
  const [ridingShape, setRidingShape] = useState('')

  useEffect(() => {
    async function getData () {
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
