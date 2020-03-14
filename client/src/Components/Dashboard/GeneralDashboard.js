import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import Radar from 'react-d3-radar'
import axios from 'axios'
import { fetchUserRiding } from '../Navbar'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation'
import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'
import { capitalizedName } from './BillDialog'

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  pos: {
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  },
  MuiAvatar: {
    backgroundColor: '#43D0C4'
  },
  container: {
    margin: '20px',
    marginTop: '30px'
  }
})

export default function CategoryDashboard () {
  const classes = useStyles()
  const [categoryList] = React.useState([
    'economics',
    'healthcare',
    'human rights',
    'business',
    'religion',
    'criminal',
    'trade'
  ])

  const [user, setUser] = useState(null)
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const user = JSON.parse(localStorage.getItem('user'))
    setUser(user)
  }, [])

  const [reps, setReps] = React.useState(null)
  useEffect(() => {
    async function getData () {
      const representatives = await getAllReps()
      setReps(representatives)
    }
    getData()
  }, [])

  async function getAllReps () {
    return axios
      .get('/api/representatives/getAllRepresentatives')
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
      .catch(console.error)
  }

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

  const [userRepresentative, setUserRepresentative] = React.useState(null)
  useEffect(() => {
    async function getData () {
      if (riding) {
        const representative = await fetchRepresentative(riding)
        setUserRepresentative(representative)
      }
    }
    getData()
  }, [riding])

  async function fetchRepresentative (riding) {
    return axios
      .get(`/api/representatives/${riding}/getRepresentative`)
      .then(res => {
        if (res.data.success) {
          return res.data.data.name
        }
      })
      .catch(console.error)
  }

  const [representativeData, setRepresentativeData] = React.useState(null)
  useEffect(() => {
    async function getData () {
      if (userRepresentative) {
        const billsByRep = await getAllBillsByRep(userRepresentative)
        setRepresentativeData(billsByRep)
      }
    }
    getData()
  }, [userRepresentative])

  async function getAllBillsByRep (head) {
    return axios
      .get(`/api/bills/${head}/getAllBillsByRep`)
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
      .catch(console.error)
  }

  const [userRepIssuedBills, setUserRepIssuedBills] = React.useState(null)
  useEffect(() => {
    async function getData () {
      if (userRepresentative) {
        const issuedBillByUserRep = await getAllBillsBySponsorName(
          userRepresentative
        )
        setUserRepIssuedBills(issuedBillByUserRep)
      }
    }
    getData()
  }, [userRepresentative])

  async function getAllBillsBySponsorName (head) {
    return axios
      .get(`/api/bills/${head}/getAllBillsBySponsorName`)
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
      .catch(console.error)
  }

  const [donutData, setDonutData] = React.useState(null)
  useEffect(() => {
    if (reps && representativeData) {
      const data = createDataSetDonut(reps, representativeData)
      setDonutData([data])
    }
  }, [reps, representativeData])

  const [radarData, setRadarData] = React.useState(null)
  useEffect(() => {
    if (categoryList && representativeData) {
      const data = createDataSetRadar(categoryList, representativeData)
      setRadarData(data)
    }
  }, [representativeData, categoryList])

  /* eslint-disable */
  return (
    <div className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {userRepIssuedBills && categoryList && userRepresentative ? (
            <Card>
              <CardContent>
                <Typography className={classes.title}>
                  Bills sponsored by {capitalizedName(userRepresentative)}
                </Typography>
                <BarChartWrapper
                  type='bar-pie'
                  data={userRepIssuedBills}
                  categories={categoryList}
                />
                <Box border mx='auto'>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          <NotListedLocationIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText>
                        The distribution of issued bills by the representative
                        among different categories
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            </Card>
          ) : (
            ''
          )}
        </Grid>

        {radarData && categoryList ? (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography className={classes.title}>
                      MP Voting Distribution
                    </Typography>
                    <Radar
                      width={400}
                      height={350}
                      padding={40}
                      domainMax={radarData[1] + 3}
                      highlighted
                      onHover={point => {
                        if (point) {
                        } else {
                        }
                      }}
                      data={{
                        variables: [
                          { key: 'trade', label: 'Trade' },
                          { key: 'criminal', label: 'Criminal' },
                          { key: 'business', label: 'Business' },
                          { key: 'Economics', label: 'Economics' },
                          { key: 'Healthcare', label: 'Healthcare' },
                          { key: 'Religion', label: 'Religion' },
                          { key: 'Human Rights', label: 'Human Rights' }
                        ],
                        sets: [
                          {
                            values: radarData[0]
                          }
                        ]
                      }}
                    />
                    <Box border mx='auto'>
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                              <NotListedLocationIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText>
                            This radar chart shows the MP's activity with
                            respect to a variety categories.
                          </ListItemText>
                        </ListItem>
                      </List>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {donutData ? (
                <Grid item item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography className={classes.title}>
                        Bipartisan Index
                      </Typography>
                      <BarChartWrapper type='donut' data={donutData} />
                      <Box border mx='auto'>
                        <List>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar className={classes.avatar}>
                                <NotListedLocationIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText>
                              The Bipartisan Index measures how often a member
                              of Parliament introduces bills that succeed in
                              attracting co-sponsors from members of the other
                              party, and how often they in turn co-sponsor a
                              bill introduced from across the aisle.
                            </ListItemText>
                          </ListItem>
                        </List>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                ''
              )}
            </Grid>
          </Grid>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              zIndex: '-2',
              transform: 'translate(-50%, -50%)'
            }}>
            <CircularProgress />
          </div>
        )}
      </Grid>
    </div>
  )
}

function createDataSetRadar(categories, data) {
  const dataArray = []
  let temp = {}
  const dataSetRadar = {}
  let maxValue = 0
  console.log(categories)
  console.log(data)
  categories.forEach(category => {
    let totalvotes = 0
    data.forEach(bill => {
      if (bill.billData.category === category.toLowerCase()) {
        totalvotes++
      }
    })
    const categorySmallLetter = category.toLowerCase().trim()
    temp = { category: categorySmallLetter, value: totalvotes }
    dataArray.push(temp)
  })

  dataArray.forEach(category => {
    if (category.value > maxValue) {
      maxValue = category.value
    }
    if (category.category) {
      dataSetRadar[category.category] = category.value
    }
  })

  return [dataSetRadar, maxValue]
}

export function createDataSetDonut(sponsors, mpdata) {
  let liberalCounter = 0
  let conservativeCounter = 0
  let ndpCounter = 0
  let peopleCounter = 0
  let greenCounter = 0
  let bqCounter = 0
  let parties = {}

  if (mpdata.length) {
    mpdata.forEach(bill => {
      if (bill.voteRecord.yea === true) {
        sponsors.forEach(sponsor => {
          if (sponsor.name === bill.billData.sponsorName) {
            switch (sponsor.politicalParty) {
              case 'liberal':
                liberalCounter++
                break
              case 'conservative':
                conservativeCounter++
                break
              case 'ndp':
                ndpCounter++
                break
              case 'bloc québécois':
                bqCounter++
                break
              case 'green':
                greenCounter++
                break
              case 'people':
                peopleCounter++
                break
              default:
                return 'nothing'
            }
          }
        })
      }
    })
  }

  parties = {
    Liberal: liberalCounter,
    Conservative: conservativeCounter,
    NDP: ndpCounter,
    People: peopleCounter,
    Green: greenCounter,
    BQ: bqCounter
  }
  return parties
}
