import MapWrapper from './MapWrapper'
import React, { useState } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import InfoBubble from '../Dashboard/Utilities/InfoBubble'
import CenteredCircularProgress from '../Dashboard/Utilities/CenteredCircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import { fetchRepresentativeEntryDateIntoParliament } from '../Dashboard/Utilities/CommonUsedFunctions'

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
  },
  bigAvatar: {
    marginLeft: '35%',
    width: 100,
    height: 100,
    border: '3px'
  },
  stylingIcons: {
    background: '#43D0C4'
  }
})

const MapContainer = (props) => {
  const classes = useStyles()
  const [contents, setContents] = useState(null)

  const handleSetContentsMap = async (currentRidingcontents) => {
    if (contents) {
      if (contents[0].name !== currentRidingcontents[0].name) {
        const dateEntry = await fetchRepresentativeEntryDateIntoParliament(currentRidingcontents[0].name)
        currentRidingcontents[0].dateEntry = dateEntry
        setContents(currentRidingcontents)
      }
    } else {
      const dateEntry = await fetchRepresentativeEntryDateIntoParliament(currentRidingcontents[0].name)
      currentRidingcontents[0].dateEntry = dateEntry
      setContents(currentRidingcontents)
    }
  }
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
          {props ? props.test : 'nothing'}
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
        {props.ridingCodes && props.shapeData && props.ridingMpData ? (
          <MapWrapper
            ridingCodes={props.ridingCodes}
            shapeData={props.shapeData}
            ridingMpData={props.ridingMpData}
            handleOpenModal={handleSetContentsMap}
            selectedRiding={contents ? contents[1] : ''}
            contents={contents ? contents[0] : ''}
          />
        ) : (
          <CenteredCircularProgress />
        )}
      </Container>
    </div>
  )
}
export default MapContainer
