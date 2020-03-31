import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import DescriptionDialog from './DescriptionDialog'
import { capitalizedName, loadingTextTitle, getAllRolesByRep, getAllDesc } from '../Dashboard/Utilities/CommonUsedFunctions'
import AssignmentIcon from '@material-ui/icons/Assignment'

import CountUp from 'react-countup'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: '#00bcd4',
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.success.dark
  },
  differenceValue: {
    color: theme.palette.success.dark,
    marginRight: theme.spacing(1)
  },
  caption: {
    marginLeft: theme.spacing(0)
  }
}))

const Roles = props => {
  const { className, ...rest } = props
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const handleOpenAction = () => {
    setOpen(true)
  }
  const handleCloseAction = () => {
    setOpen(false)
  }

  const [data, setData] = useState(null)
  useEffect(() => {
    async function getData () {
      if (props.userRepresentative !== null && props.userRepresentative !== null) {
        const roles = await getAllRolesByRep('role', props.userRepresentative)
        if (Array.isArray(roles) && roles.length !== 0) {
          const rolesWithDesc = await getAllDesc(roles)
          setData(rolesWithDesc)
        }
      }
    }
    getData()
  }, [props.userRepresentative])

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify='space-between'
        >
          <Grid item>
            <Typography
              className={classes.title}
              color='textSecondary'
              gutterBottom
              variant='caption'
            >
                            Parliament Roles
            </Typography>
            <Grid item direction='row'>
              <Grid container direction='row' alignItems='center'>
                <Grid item><CountUp style={{ fontSize: 27 }} end={data ? data.length : 0}> </CountUp></Grid>
                <Grid item><Typography style={{ marginLeft: 3 }} variant='h5'> {'roles'}</Typography></Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AssignmentIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <li>
            <Typography
              className={classes.caption}
              variant='caption'
            >
              {data && data.length !== 0 ? (`${capitalizedName(loadingTextTitle(data[0]))}`) : 'This MP doesnt have roles'}
            </Typography>
            {data && data.length !== 0 ? <Button color='primary' style={{ fontSize: '0.625em' }} onClick={handleOpenAction}>details</Button> : ''}
            <DescriptionDialog open={open} onClose={handleCloseAction} data={data || []} title='Roles' />
          </li>

        </div>
      </CardContent>
    </Card>
  )
}

Roles.propTypes = {
  className: PropTypes.string
}

export default Roles
