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

  const [data, setData] = useState(null)
  useEffect(() => {
    if (props.data !== data) {
      setData(props.data)
    }
  }, [props.data, data])

  return (
    <div>
      {data ? (
        <div
          {...rest}
          className={clsx(classes.root, className)}
        >
          <Typography
            className={classes.name}
            variant='h6'
          >
            {data.name ? capitalizedName(data.name) : ''}
          </Typography>
          {data.riding ? data.riding.length > 22
            ? (
              <div className={classes.containerLongRidingName}>
                <Typography className={classes.fontColorTypography} variant='caption'>Represents</Typography>
                <Typography className={classes.longRidingName} variant='caption'>{capitalizedName(data.riding)}</Typography>
              </div>) : (<Typography className={classes.fontColorTypography} variant='caption'>{'Represents: ' + capitalizedName(data.riding)}</Typography>)
            : (<Typography className={classes.fontColorTypography} variant='caption'>Represents</Typography>)}

          {data.party ? data.party.length > 15
            ? (
              <div className={classes.containerLongRidingName}>
                <Typography className={classes.fontColorTypography} variant='caption'>Political Party:</Typography>
                <Typography className={classes.longRidingName} variant='caption'>{capitalizedName(data.party)}</Typography>
              </div>
            )
            : (<Typography className={classes.fontColorTypography} variant='caption'>{'Political Party: ' + capitalizedName(data.party)}</Typography>)
            : (<Typography className={classes.fontColorTypography} variant='caption'>Political Party: </Typography>)}

          <Typography className={classes.fontColorTypography} variant='caption'>{'Total Population: '} {data.riding ? (<RidingPopulation riding={data.riding} />) : ''}</Typography>
          <Typography className={classes.fontColorTypography} variant='caption'>{'Member Since: '} {data.start ? loadingTextdata({ fromDate: data.start, toDate: data.end }) : ''}</Typography>
          <div className={classes.shapeContainer}>
            <RidingShapeContainer
              ridingCode={data.ridingCode}
              politicalParty={data.party}
            />
          </div>
        </div>
      ) : ('')}
    </div>

  )
}

MpProfile.propTypes = {
  className: PropTypes.string
}

export default MpProfile
