import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'
import {
  fetchRidingCode,
  fetchUserRiding,
  fetchRepresentative,
  loadingTextdata
  , capitalizedName
} from '../Dashboard/Utilities/CommonUsedFunctions'
import RidingPopulation from './Sidebar/RidingPopulation/RidingPopulation'

import RidingShapeContainer from './Sidebar/RidingShape/RidingShapeContainer'

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
  const [data, setData] = useState({})

  useEffect(() => {
    async function getData () {
      // eslint-disable-next-line
            const user = JSON.parse(localStorage.getItem('user'))
      const riding = await fetchUserRiding(user.email)
      const promises = await Promise.all([
        fetchRidingCode(riding),
        fetchRepresentative(riding)
      ])
      const ridingCode = promises[0]
      const { name, party, start, end } = promises[1]
      if (name) {
        setData({
          end: end,
          name: name,
          ridingCode: ridingCode,
          riding: riding,
          party: party,
          start: start
        })
      }
    }
    getData()
  }, [])

  useEffect(() => {
    setName(data.name)
    setPoliticalParty(data.party)
    setRiding(data.riding)
    setRidingCode(data.ridingCode)
    setStartDate(data.start)
    setEndDate(data.end)
  }, [data])

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

      <Typography className={classes.fontColorTypography} variant='caption'>{'Total Population: '} {riding ? (<RidingPopulation riding={riding} />) : ''}</Typography>
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
