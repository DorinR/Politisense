import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
  Card,
  CardContent,
  Button, Grid, Typography, Avatar
} from '@material-ui/core'
import DescriptionDialog from './DescriptionDialog'
import clsx from 'clsx'
import WorkIcon from '@material-ui/icons/Work'
import { capitalizedName, totalBillsArray } from '../Dashboard/Utilities/CommonUsedFunctions'
import CountUp from 'react-countup'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
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
    color: theme.palette.primary.contrastText,
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
  caption: {
    marginLeft: theme.spacing(0)
  }
}))

const IssuedBillsByMP = props => {
  const classes = useStyles()
  const { className, ...rest } = props
  const [open, setOpen] = React.useState(false)
  const content = {
    title: 'Issued Bills By MP',
    body: 'Issued Bills By Mp are the bills that that MP (i.e member of parliament) sponsored and created about certain topic. ' +
        'It is an indication how active he or she is in the parliament'
  }
  const handleClose = () => {
    setOpen(false)
  }

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
                            Sponsored Bills
            </Typography>
            <Grid item direction='row'>
              <Grid container direction='row' alignItems='center'>
                <Grid item> <CountUp style={{ fontSize: 26 }} end={props.issuedbills ? totalBillsArray(props.issuedbills) : 0}> </CountUp></Grid>
                <Grid item><Typography style={{ marginLeft: '5%' }} variant='h5'> {'bills'}</Typography></Grid>
              </Grid>
            </Grid>

          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <WorkIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <Grid container direction='row'>
          <div className={classes.difference}>
            <li>
              <Typography
                className={classes.caption}
                variant='caption'
              >
                {props.issuedbills && props.issuedbills.length !== 0 && props.rows
                  ? `Bill ${props.issuedbills[0].billsClassified.number}- ${capitalizedName(props.issuedbills[0].billsClassified.category)}` : 'No bills created'}

              </Typography>
              {props.issuedbills && props.issuedbills.length !== 0 && props.rows
                ? (
                  <Link
                    to={{
                      pathname: '/performance',
                      aboutProps: {
                        representative: props.representative,
                        rows: props.rows,
                        issuedbills: props.issuedbills,
                        categorylist: props.categorylist
                      }
                    }} className={classes.routerLink} style={{ textDecoration: 'none' }}
                  >
                    <Button color='primary' style={{ fontSize: '0.625em' }}>
                          details
                    </Button>
                  </Link>)
                : ''}
            </li>
          </div>
        </Grid>
      </CardContent>
      {props.userRepIssuedBills && props.rows
        ? (
          <DescriptionDialog
            open={open}
            onClose={handleClose}
            explaination={content}
            d3Container
            userRepIssuedBills={props.userRepIssuedBills}
            categoryList={props.categoryList}
            rows={props.rows ? props.rows : []}
          />) : <div />}

    </Card>

  )
}

IssuedBillsByMP.propTypes = {
  className: PropTypes.string
}

export default IssuedBillsByMP
