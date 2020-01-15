import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { fallbackSvg } from './fallbackSvg'
import { PARTY_COLORS } from './partyColors'
const mapshaper = require('mapshaper-with-patch')

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
    width: '50%',
    maxHeight: '100%'
  }
}))

export function restructureData (data) {
  const templateData = {
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

export default function RidingShape (props) {
  const classes = useStyles()
  const [svgData, setSvgData] = React.useState('')

  useEffect(() => {
    if (props.ridingShapeCoordinates && props.politicalParty) {
      // get color for given party
      const thisPartyColor = PARTY_COLORS[props.politicalParty]

      // convert geoJSON data to svg shape and set fill color to the party color
      const input = props.ridingShapeCoordinates
      const cmd = '-i point.json -o svg-data=* format=SVG'
      mapshaper.applyCommands(cmd, { 'point.json': input }, function (err, out) {
        if (err) {
          console.error(err)
        }
        let svg = ''
        try {
          svg = out['point.svg']
        } catch (err) {
          console.error(
            'Problematic GeoJSON file, unable to convert to SVG format'
          )
          svg = fallbackSvg
        }

        const position = svg.indexOf('<path') + 5
        const partyColor = ` fill="${thisPartyColor}"`
        const coloredSvg = [
          svg.slice(0, position),
          partyColor,
          svg.slice(position)
        ].join('')
        setSvgData(coloredSvg)
      })
    }
  }, [props.ridingShapeCoordinates, props.politicalParty])

  return (
    <img
      src={`data:image/svg+xml;utf8,${svgData}`}
      alt='riding shape'
      className={classes.customRidingShape}
    />
  )
}
