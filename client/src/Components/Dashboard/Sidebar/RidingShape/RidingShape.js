import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import RidingCodeHelper from './RidingCodeHelper'
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

export function getPartyColor(party) {
  var politicalPartyColors = {}
  politicalPartyColors['bloc québécois'] = '%23355888'
  politicalPartyColors['liberal'] = '%23D71921'
  politicalPartyColors['conservative'] = '%230C499C'
  politicalPartyColors['green party'] = '%233D9B35'
  politicalPartyColors['independent'] = '%2378D7CE'
  politicalPartyColors['liberal'] = '%23D71921'
  politicalPartyColors['ndp'] = '%23EF7E52'

  return politicalPartyColors[party]
}

export default function RidingShape(props) {
  const classes = useStyles()
  const [svgData, setSvgData] = React.useState('')

  useEffect(() => {
    if (props.ridingShapeCoordinates && props.politicalParty) {
      // get color for given party
      const thisPartyColor = getPartyColor(props.politicalParty)

      // convert geoJSON data to svg shape and set fill color to the party color
      const input = props.ridingShapeCoordinates
      let cmd = '-i point.json -o svg-data=* format=SVG'
      mapshaper.applyCommands(cmd, { 'point.json': input }, function(err, out) {
        var svg = out['point.svg']
        console.log(svg)
        let position = svg.indexOf('<path') + 5
        let partyColor = ` fill="${thisPartyColor}"`
        let coloredSvg = [
          svg.slice(0, position),
          partyColor,
          svg.slice(position)
        ].join('')
        console.log(coloredSvg)
        setSvgData(coloredSvg)
      })
    }
  }, [props.ridingShapeCoordinates, props.politicalParty])

  return (
    <img
      src={`data:image/svg+xml;utf8,${svgData}`}
      className={classes.customRidingShape}
    />
  )
}
