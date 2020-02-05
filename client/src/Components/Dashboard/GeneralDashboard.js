/* eslint-disable */
import React, { useEffect } from 'react'
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

export default function CategoryDashboard() {
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
  const [userRepresentative, setUserRepresentative] = React.useState('')
  const [representativeData, setRepresentativeData] = React.useState([])
  const [radarData, setRadarData] = React.useState([])
  const [repDataLoaded, setRepDataLoaded] = React.useState(false)
  const [donutData, setDonutData] = React.useState([])
  const [reps, setReps] = React.useState([])
  const [userRepIssuedBills, setUserRepIssuedBills] = React.useState([])

  useEffect(() => {
    async function getDataForDonut() {
      if (reps.length && representativeData.length) {
        const data = await createDataSetDonut(reps, representativeData)
        if (
          data.Liberal !== 0 &&
          data.Liberal !== 0 &&
          data.Liberal !== 0 &&
          data.Liberal !== 0 &&
          data.Liberal !== 0 &&
          data.Liberal !== 0
        ) {
          setDonutData([data])
        }
      }
    }
    async function getAllReps() {
      let result = []
      await axios
        .get('http://localhost:5000/api/representatives/getAllRepresentatives')
        .then(res => {
          if (res.data.success) {
            result = res.data.data
          }
        })
        .catch(err => console.error(err))
      return result
    }

    async function getAllBillsByRep(head) {
      let result = []
      await axios
        .get(`http://localhost:5000/api/bills/${head}/getAllBillsByRep`)
        .then(res => {
          if (res.data.success) {
            result = res.data.data
            setRepresentativeData(result)
            setRepDataLoaded(true)
          }
        })
        .catch(err => console.error(err))
      return result
    }
    async function getAllBillsBySponsorName(head) {
      let result = []
      await axios
        .get(`http://localhost:5000/api/bills/${head}/getAllBillsBySponsorName`)
        .then(res => {
          if (res.data.success) {
            result = res.data.data
          }
        })
        .catch(err => console.error(err))
      return result
    }
    async function getData() {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        const { email } = user
        const riding = await fetchUserRiding(email)
        const representative = await fetchRepresentative(riding)
        const allRepresentatives = await getAllReps()
        setUserRepresentative(representative)
        setReps(allRepresentatives)
        const issuedBillByUserRep = await getAllBillsBySponsorName(
          representative
        )
        setUserRepIssuedBills(issuedBillByUserRep)
        if (representative.length !== 0) {
          setUserRepresentative(representative)
        }
      }
    }
    getData()

    if (userRepresentative) {
      getAllBillsByRep(userRepresentative).then(results => {})
    }

    if (categoryList && repDataLoaded) {
      createDataSetRadar(categoryList, representativeData).then(testing => {
        if (testing.length !== 0) {
          setRadarData(testing)
        }
      })
    }

    if (reps.length && repDataLoaded) {
      getDataForDonut()
    }
  }, [userRepresentative, repDataLoaded])

  async function fetchRepresentative(riding) {
    let result = ''
    await axios
      .get(
        `http://localhost:5000/api/representatives/${riding}/getRepresentative`
      )
      .then(res => {
        if (res.data.success) {
          result = res.data.data.name
        }
      })
      .catch(err => console.error(err))
    return result
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {userRepIssuedBills.length !== 0 && categoryList.length !== 0 ? (
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

        {radarData.length !== 0 && categoryList.length !== 0 ? (
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
              {donutData.length ? (
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
                              of Parliamnet introduces bills that succeed in
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

export async function createDataSetRadar(categories, data) {
  const dataArray = []
  let temp = {}
  const dataSetRadar = {}
  let maxValue = 0
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

export async function createDataSetDonut(sponsors, mpdata) {
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
