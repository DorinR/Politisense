import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core'
import GroupIcon from '@material-ui/icons/Group'
import Button from '@material-ui/core/Button'
import { capitalizedName, loadingTextTitle, getAllRolesByRep } from '../Dashboard/Utilities/CommonUsedFunctions'
import DescriptionDialog from './DescriptionDialog'
import CountUp from 'react-countup'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: '#00bcd4',
    color: theme.palette.primary.contrastText
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: 'white',
    color: 'white',
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32,
    color: '#00bcd4'
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  caption: {
    marginLeft: theme.spacing(0)
  }
}))

const Associations = props => {
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
      if (props.userRepresentative) {
        const roles = await getAllRolesByRep('association', props.userRepresentative)
        setData(roles)
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
                            Associations
            </Typography>
            <Grid item direction='row'>
              <Grid container direction='row'>
                <CountUp style={{ fontSize: 27 }} end={data ? data.length : 0}> </CountUp>
                <Typography style={{ marginTop: 3, marginLeft: 3 }} variant='h5'> {'associations'}</Typography>
              </Grid>
            </Grid>

          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <GroupIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <li>
            <Typography
              className={classes.caption}
              variant='caption'
            >
              {data ? (`${capitalizedName(loadingTextTitle(data[0]))}`) : 'This MP is not a member of any'}
            </Typography>
          </li>
          {data ? <Button color='primary' size='medium' style={{ fontSize: 10, color: 'white' }} onClick={handleOpenAction}>details</Button> : ''}
          <DescriptionDialog open={open} onClose={handleCloseAction} data={data || []} title='Parliamentary Associations' />
        </div>
      </CardContent>
    </Card>
  )
}

Associations.propTypes = {
  className: PropTypes.string
}

export default Associations
