import React from 'react'
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
  return (
    <div>
      {props.representative && props.ridingCode && props.riding ? (
        <div
          {...rest}
          className={clsx(classes.root, className)}
        >
          <Typography
            className={classes.name}
            variant='h6'
          >
            {props.representative.name ? capitalizedName(props.representative.name) : ''}
          </Typography>
          {props.representative.riding ? props.representative.riding.length > 22
            ? (
              <div className={classes.containerLongRidingName}>
                <Typography className={classes.fontColorTypography} variant='caption'>Represents</Typography>
                <Typography className={classes.longRidingName} variant='caption'>{capitalizedName(props.representative.riding)}</Typography>
              </div>) : (<Typography className={classes.fontColorTypography} variant='caption'>{'Represents: ' + capitalizedName(props.representative.riding)}</Typography>)
            : (<Typography className={classes.fontColorTypography} variant='caption'>Represents</Typography>)}

          {props.representative.party ? props.representative.party.length > 15
            ? (
              <div className={classes.containerLongRidingName}>
                <Typography className={classes.fontColorTypography} variant='caption'>Political Party:</Typography>
                <Typography className={classes.longRidingName} variant='caption'>{capitalizedName(props.representative.party)}</Typography>
              </div>
            )
            : (<Typography className={classes.fontColorTypography} variant='caption'>{'Political Party: ' + capitalizedName(props.representative.party)}</Typography>)
            : (<Typography className={classes.fontColorTypography} variant='caption'>Political Party: </Typography>)}

          <Typography className={classes.fontColorTypography} variant='caption'>{'Total Population: '} {props.representative.riding ? (<RidingPopulation riding={props.riding} />) : ''}</Typography>
          <Typography className={classes.fontColorTypography} variant='caption'>{'Member Since: '} {props.representative.start ? loadingTextdata({ fromDate: props.representative.start, toDate: props.representative.end }) : ''}</Typography>
          <div className={classes.shapeContainer}>
            <RidingShapeContainer
              ridingCode={props.ridingCode}
              politicalParty={props.representative.party}
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
