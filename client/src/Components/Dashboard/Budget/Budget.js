import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Container, Card, CardContent, Grid, Typography, Avatar, CardHeader, Divider, Hidden, Button } from '@material-ui/core'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import axios from 'axios'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import MDBHorizontalBar from '../Charts/MDBHorizontalBar'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import IconButton from '@material-ui/core/IconButton'
import { formatNumber, fetchRepresentative, fetchUserRiding, fetchRepresentativeId } from '../Utilities/CommonUsedFunctions'
import MoneyIcon from '@material-ui/icons/Money'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Transition } from '../General/GeneralDashboard'
import DescriptionDialog from '../../MyMP/DescriptionDialog'
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded'
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  titleHeader: {
    fontWeight: 700
  },
  title: {
    color: '#263238',
    fontSize: '16px',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 700
  },
  subTitle: {
    fontWeight: 700,
    fontSize: 16
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
  avatar1: {
    backgroundColor: '#00bcd4',
    height: 30,
    width: 30
  },
  icon1: {
    height: 20,
    width: 20
  },
  difference: {
    display: 'flex',
    alignItems: 'center'
  },
  test: {
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: 'green'
  },
  positiveIcon: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    color: 'green'
  },
  containerBox: {
    marginTop: theme.spacing(1)
  },
  container1: {
    marginTop: theme.spacing(0)
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2)
  },
  formControl: {
    minWidth: 100
  }
}))

const Budget = props => {
  const { className, ...rest } = props
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [openBudgetChart, setOpenBudgetChart] = React.useState(false)
  const handleClosingChartDialog = () => {
    setOpenBudgetChart(false)
  }
  const handleOpeningChartDialog = () => {
    setOpenBudgetChart(true)
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [user, setUser] = useState(null)
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const usr = JSON.parse(localStorage.getItem('user'))
    setUser(usr)
  }, [])

  const [riding, setRiding] = useState(null)
  useEffect(() => {
    async function getData () {
      if (user) {
        const riding = await fetchUserRiding(user.email)
        setRiding(riding)
      }
    }
    getData()
  }, [user])

  const [representative, setRepresentative] = useState(null)
  useEffect(() => {
    async function getData () {
      if (riding) {
        const rep = await fetchRepresentative(riding)
        setRepresentative(rep.name)
      }
    }
    getData()
  }, [riding])

  const [labelMP, setLabelMP] = useState(null)
  useEffect(() => {
    if (representative) {
      setLabelMP(representative)
    }
  }, [representative])

  const [repID, setRepID] = useState(null)
  useEffect(() => {
    async function getData () {
      if (representative) {
        const id = await fetchRepresentativeId(representative)
        setRepID(id)
      }
    }
    getData()
  }, [representative])

  const [data, setData] = useState(null)
  useEffect(() => {
    async function getData () {
      if (repID) {
        const data = await getBudgetData(repID)
        setData(data)
      }
    }
    getData()
  }, [repID])

  async function getBudgetData (id) {
    return axios
      .get(
                `/api/budgets/budget/${id}`
      )
      .then(res => {
        return res.data.data
      })
      .catch(console.error)
  }

  const [budgetData, setBudgetData] = useState([])
  useEffect(() => {
    if (data) {
      const mps = {
        label: labelMP,
        values: data.mp
      }
      const avgs = {
        label: 'Average Among MPs',
        values: data.avg
      }
      const labels = data.labels
      setBudgetData([mps, avgs, labels])
    }
  }, [data, labelMP])

  const [totalMPBudget, setTotalMPBudget] = useState(null)
  const [percentage, setpercentage] = useState(null)
  useEffect(() => {
    if (budgetData.length) {
      const totalMpBudget = computeTotalBudget(budgetData[0].values)
      setTotalMPBudget(formatNumber(totalMpBudget))
      const totalAvgBudget = computeTotalBudget(budgetData[1].values)
      setpercentage(roundingNumber(computePercentageMpsAvg(totalMpBudget, totalAvgBudget)))
    }
  }, [budgetData])

  return (
    <div>
      <Hidden mdUp>
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
                  className={classes.titleHeader}
                  color='textSecondary'
                  gutterBottom
                  variant='caption'
                >
                           BUDGET
                </Typography>
                <Typography variant='h5'>{totalMPBudget ? '$' + totalMPBudget : '$0'}</Typography>
              </Grid>
              <Grid item>
                <Avatar className={classes.avatar}>
                  <MoneyIcon className={classes.icon} />
                </Avatar>
              </Grid>
            </Grid>
            <Grid container direction='row'>
              <div className={classes.difference}>
                <Grid item>
                  {percentage
                    ? (Math.sign(percentage) === -1
                      ? (
                        <div className={classes.test}>
                          <ArrowDownwardIcon className={classes.differenceIcon} />
                          <Typography
                            className={classes.differenceValue}
                            variant='body2'
                          >
                            {percentage ? Math.abs(percentage) + '%' : '0'}
                          </Typography>
                        </div>)
                      : (
                        <div className={classes.test}>
                          <ArrowUpwardIcon className={classes.positiveIcon} />
                          <Typography
                            className={classes.positiveIcon}
                            variant='body2'
                          >
                            {percentage ? percentage + '%' : '0'}
                          </Typography>
                        </div>
                      )
                    )
                    : ''}
                </Grid>
                <Typography
                  className={classes.caption}
                  variant='caption'
                >{'than average'}
                </Typography>
                {budgetData
                  ? (<Button color='primary' size='medium' style={{ fontSize: 10 }} onClick={handleOpeningChartDialog}> details </Button>)
                  : ''}
              </div>
            </Grid>
            <Dialog
              open={openBudgetChart}
              keepMounted
              onClose={handleClosingChartDialog}
              aria-labelledby='alert-dialog-slide-title'
              aria-describedby='alert-dialog-slide-description'
              maxWidth='md'
              fullWidth
            >
              <DialogTitle id='alert-dialog-slide-title' style={{ textAlign: 'center' }}>Budget</DialogTitle>
              <Divider />
              <DialogContent>
                <Container maxWidth='xl'>
                  {budgetData.length
                    ? <MDBHorizontalBar data={budgetData} /> : ''}
                </Container>
              </DialogContent>
            </Dialog>

          </CardContent>
        </Card>
      </Hidden>
      <Hidden smDown>
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >
          <CardHeader
            classes={{
              title: classes.title
            }}
            title='Budget'
            action={
              <IconButton aria-label='settings' onClick={handleClickOpen}>
                <HelpOutlineRoundedIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent style={{ paddingTop: 0 }}>
            <Container maxWidth='sm'>
              <Grid
                container
                direction='row'
                justify='center'
              >
                <Grid item>
                  <div className={classes.container1}>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar className={classes.avatar1}>
                            <AttachMoneyIcon className={classes.icon1} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                          <Typography style={{ fontSize: 16 }}>{totalMPBudget ? 'Total : $' + totalMPBudget : 'Total: $0'}</Typography>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.container1}>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar className={classes.avatar1}>
                            <TrendingUpIcon className={classes.icon1} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                          <div className={classes.difference}>
                            <Grid item>
                              {percentage
                                ? (Math.sign(percentage) === -1
                                  ? (
                                    <div className={classes.test}>
                                      <ArrowDownwardIcon className={classes.differenceIcon} />
                                      <Typography
                                        className={classes.differenceValue}
                                        variant='body2'
                                      >
                                        {percentage ? Math.abs(percentage) + '%' : '0'}
                                      </Typography>
                                    </div>
                                  )
                                  : (
                                    <div className={classes.test}>
                                      <ArrowUpwardIcon className={classes.positiveIcon} />
                                      <Typography className={classes.positiveIcon} variant='body2'>{percentage ? percentage + '%' : '0'}</Typography>
                                    </div>
                                  )
                                ) : ''}
                            </Grid>
                            <Typography
                              style={{ fontSize: 16, marginLeft: 5 }}
                            >{'than average member'}
                            </Typography>
                          </div>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </div>
                </Grid>
              </Grid>
            </Container>
            <Container maxWidth='lg'>
              {budgetData.length
                ? <MDBHorizontalBar data={budgetData} /> : ''}
            </Container>
          </CardContent>
        </Card>
        <DescriptionDialog
          open={open}
          onClose={handleClose}
          d3
          explaination={{
            title: 'Budget',
            body: 'This section compares spending between the current member of parliament ( MP ) and the average of all current members of parliament '
          }}
          transition={Transition}
        />
      </Hidden>
    </div>
  )
}

Budget.propTypes = {
  className: PropTypes.string
}

export default Budget

function computeTotalBudget (items) {
  const counter = items.reduce(sum)
  return counter
}
function sum (total, num) {
  return total + num
}

function computePercentageMpsAvg (mpsBudget, avgBudget) {
  return ((mpsBudget - avgBudget) / avgBudget) * 100
}

function roundingNumber (num) {
  return num.toFixed(0)
}
