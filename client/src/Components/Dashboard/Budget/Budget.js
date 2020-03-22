/* eslint-disable */
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Container, Card, CardContent, Grid, Typography, Avatar, CardHeader, Divider } from '@material-ui/core'
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
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MoreVertIcon from '@material-ui/icons/MoreVert'
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
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
    marginTop: theme.spacing(2)
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
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const options = [
    'Quarter 1',
    'Quarter 2',
    'Quarter 3'
  ]

  const ITEM_HEIGHT = 48

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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

  async function fetchUserRiding (userEmail) {
    return axios
      .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
      .then(res => {
        if (res.data.success) {
          return res.data.data.riding
        }
      })
      .catch(console.error)
  }

  const [representative, setRepresentative] = useState(null)
  useEffect(() => {
    async function getData () {
      if (riding) {
        const rep = await fetchRepresentative(riding)
        setRepresentative(rep)
      }
    }
    getData()
  }, [riding])

  async function fetchRepresentative (riding) {
    return axios
      .get(
                `http://localhost:5000/api/representatives/${riding}/getRepresentative`
      )
      .then(res => {
        if (res.data.success) {
          return res.data.data.name
        }
      })
      .catch(console.error)
  }

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

  async function fetchRepresentativeId (representative) {
    return axios
      .get(
                `http://localhost:5000/api/representatives/${representative}/getRepresentativeId`
      )
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
      .catch(console.error)
  }

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
                `http://localhost:5000/api/budgets/budget/${id}`
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
      setBudgetData([mps, avgs])
    }
  }, [data, labelMP])

  const [totalMPBudget, setTotalMPBudget] = useState(0)
  const [percentage, setpercentage] = useState(0)
  useEffect(() => {
    if (budgetData.length) {
      const totalMpBudget = computeTotalBudget(budgetData[0].values)
      console.log(totalMpBudget)
      setTotalMPBudget(formatNumber(totalMpBudget))
      const totalAvgBudget = computeTotalBudget(budgetData[1].values)
      console.log(totalAvgBudget)
      setpercentage(roundingNumber(computePercentageMpsAvg(totalMpBudget, totalAvgBudget)))
    }
  }, [budgetData])

  return (
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
          <div>
            <IconButton
              aria-label='more'
              aria-controls='long-menu'
              aria-haspopup='true'
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id='long-menu'
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200
                }
              }}
            >
              {options.map(option => (
                <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        }
      />
      <Divider />
      <CardContent>
        <Container maxWidth='sm'>

          <Grid
            container
            direction='row'
            justify='center'
          >
            <Grid item>
              <div className={classes.container1}>
                <list>
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
                </list>
              </div>
            </Grid>
            <Grid item>
              <div className={classes.containerBox}>
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
                              ? <div className={classes.test}>
                                <ArrowDownwardIcon className={classes.differenceIcon} />
                                <Typography
                                  className={classes.differenceValue}
                                  variant='body2'
                                >
                                  {percentage ? Math.abs(percentage) + '%' : '0'}
                                </Typography>
                                </div>
                              : <div className={classes.test}>
                                <ArrowUpwardIcon className={classes.positiveIcon} />
                                <Typography
                                  className={classes.positiveIcon}
                                  variant='body2'
                                >
                                  {percentage ? percentage + '%' : '0'}
                                </Typography>
                                </div>)
                            : ''}
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
        {budgetData.length
          ? <MDBHorizontalBar data={budgetData} /> : ''}
      </CardContent>
    </Card>
  )
}

Budget.propTypes = {
  className: PropTypes.string
}

export default Budget

export function computeTotalBudget (items) {
  let counter = 0
  items.forEach(item => {
    counter = counter + item
  })
  return counter
}
export function formatNumber (num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function computePercentageMpsAvg (mpsBudget, avgBudget) {
  return ((mpsBudget - avgBudget) / avgBudget) * 100
}

export function roundingNumber (num) {
  return num.toFixed(0)
}
