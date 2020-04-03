import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'
import { loadingTextdata, capitalizedName } from '../Dashboard/Utilities/CommonUsedFunctions'
import RidingPopulation from '../Dashboard/Sidebar/RidingPopulation/RidingPopulation'
import RidingShapeContainer from '../Dashboard/Sidebar/RidingShape/RidingShapeContainer'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1),
    color: 'white',
    fontFamily: 'work-Sans,sans-serif',
    textAlign: 'center'

  },
  fontColorTypography: {
    color: 'white',
    fontFamily: 'work-Sans,sans-serif'
  },
  shapeContainer: {
    marginLeft: theme.spacing(8),
    marginTop: theme.spacing(2)
  },
  containerLongRidingName: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  longRidingName: {
    color: 'white',
    fontFamily: 'work-Sans,sans-serif',
    minHeight: 'fit-content',
    textAlign: 'center'

  },
  item: {
    paddingTop: 0,
    paddingBottom: 0
  }

}))

const MpProfile = props => {
  const { className, ...rest } = props
  const classes = useStyles()
  const [name, setName] = useState('')
  const [politicalParty, setPoliticalParty] = useState('')
  const [riding, setRiding] = useState('')
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const [ridingCode, setRidingCode] = useState('')

  useEffect(() => {
    if (props.data) {
      setName(props.data.name)
      setPoliticalParty(props.data.party)
      setRiding(props.data.riding)
      setRidingCode(props.data.ridingCode)
      setStartDate(props.data.start)
      setEndDate(props.data.end)
    }
  }, [props.data])

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography
        className={classes.name}
        variant='h6'
      >
        {capitalizedName(name)}
      </Typography>
      {riding ? riding.length > 22
        ? (
          <div className={classes.containerLongRidingName}>
            <Typography className={classes.fontColorTypography} variant='caption'>Represents</Typography>
            <Typography className={classes.longRidingName} variant='caption'>{capitalizedName(riding)}</Typography>
          </div>) : (<Typography className={classes.fontColorTypography} variant='caption'>{'Represents: ' + capitalizedName(riding)}</Typography>)
        : (<Typography className={classes.fontColorTypography} variant='caption'>Represents</Typography>)}

      {politicalParty ? politicalParty.length > 15
        ? (
          <div className={classes.containerLongRidingName}>
            <Typography className={classes.fontColorTypography} variant='caption'>Political Party:</Typography>
            <Typography className={classes.longRidingName} variant='caption'>{capitalizedName(politicalParty)}</Typography>
          </div>
        )
        : (<Typography className={classes.fontColorTypography} variant='caption'>{'Political Party: ' + capitalizedName(politicalParty)}</Typography>)
        : (<Typography className={classes.fontColorTypography} variant='caption'>Political Party: </Typography>)}

      <Typography className={classes.fontColorTypography} variant='caption'>{'Total Population: '} {props.riding ? (<RidingPopulation riding={riding} />) : ''}</Typography>
      <Typography className={classes.fontColorTypography} variant='caption'>{'Member Since: '} {startDate ? loadingTextdata({ fromDate: startDate, toDate: endDate }) : ''}</Typography>
      <div className={classes.shapeContainer}>
        <RidingShapeContainer
          ridingCode={ridingCode}
          politicalParty={politicalParty}
        />
      </div>
    </div>

  )
}

MpProfile.propTypes = {
  className: PropTypes.string
}

export default MpProfile
