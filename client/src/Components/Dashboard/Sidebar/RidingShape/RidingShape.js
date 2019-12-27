import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import svgify from 'geojson-svgify'
import { render } from 'react-dom'
import { ReactSVG } from 'react-svg'
import lachine from './lachine.svg'
import geojson2svg, { Renderer } from 'geojson-to-svg'
import RidingCodeHelper from './RidingCodeHelper'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
var geo2json = require('geo2svg')
var mapshaper = require('mapshaper')

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
  },
  customRidingShape: {
    width: '50%'
  }
}))

export function restructureData(data) {
  let templateData = {
    type: 'Feature',
    properties: {
      color: '#DD2C00',
      weight: 15,
      direction: 0,
      opacity: 0.4,
      markupType: 'highlight'
    },
    geometry: data
  }
  return templateData
}

export default function RidingShape(props) {
  const classes = useStyles()
  const [svgData, setSvgData] = React.useState('')

  useEffect(() => {
    if (props.ridingShapeCoordinates) {
      const input = props.ridingShapeCoordinates
      console.log('incoming shape data:', input)

      let cmd = '-i point.json -o svg-data=* format=SVG'
      mapshaper.applyCommands(cmd, { 'point.json': input }, function(err, out) {
        var svg = out['point.svg']
        console.log(svg)
        setSvgData(svg)
      })
    }
  }, [props.ridingShapeCoordinates])

  return (
    <img
      src={`data:image/svg+xml;utf8,${svgData}`}
      className={classes.customRidingShape}
    />
  )
}
