import React, { useState, useEffect } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import axios from 'axios'

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
  let ridingShape = ''
  await axios
    .get(`http://localhost:5000/api/ridings/${ridingCode}/getSimpleShape`)
    .then(
      res => {
        if (res.data.success) {
          ridingShape = res.data.data.coordinates
          console.log('data from reply:', res.data)
        }
      },
      error => {
        console.error(error)
      }
    )
    .catch(err => {
      console.error(err)
    })
  return ridingShape
}

export default function RepresentativeInfo(props) {
  const classes = useStyles()
  const [ridingShape, setRidingShape] = useState('')

  useEffect(() => {
    async function getData() {
      const ridingShape = await fetchRidingShape(props.ridingCode)
      setRidingShape(ridingShape)
    }
    getData()
  }, [props.ridingCode])

  return (
    <Card>
      <CardContent className={classes.customCardContent}>
        {props.ridingCode}
        {ridingShape}
      </CardContent>
    </Card>
  )
}
