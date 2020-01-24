/* eslint-disable */
import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography';
import BarChartWrapper from './Charts/Wrappers/BarChartWrapper'
import ChartCard from './ChartCard'
import Radar from 'react-d3-radar'
import axios from 'axios'
import { fetchUserRiding } from '../Navbar'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from "@material-ui/core/CardHeader";
const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  pos: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  },
});


export default function CategoryDashboard () {
  const classes = useStyles();
  const [categoryList, setCategoryList] = React.useState(['economics', 'healthcare', 'human rights', 'business', 'religion', 'criminal', 'trade'])
  const [userRepresentative, setUserRepresentative] = React.useState('')
  const [representativeData, setRepresentativeData] = React.useState([])
  const [radarData, setRadarData] = React.useState([])
  const [categoryListLoaded, setCategoryListLoaded] = React.useState(false)
  const [repDataLoaded, setRepDataLoaded] = React.useState(false)
  const [donutData, setDonutData] = React.useState([])
  const [reps, setReps] = React.useState([])
  const [userRepIssuedBills, setUserRepIssuedBills] = React.useState([])
  const [dataUpdatedDonut, setDataUpdatedDonut] = React.useState(false)


  useEffect(() => {
    async function getDataForDonut () {

      if (reps.length && representativeData.length) {
        const data = await createDataSetDonut(reps, representativeData)
        setDonutData([data])
        setDataUpdatedDonut(true)
      }
    }
    async function getAllReps () {
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

    async function getAllBillsByRep (head) {
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
    async function getAllBillsBySponsorName (head) {
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
    async function getData () {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        const { email } = user
        const riding = await fetchUserRiding(email)
        const representative = await fetchRepresentative(riding)
        const allRepresentatives = await getAllReps()
        setUserRepresentative(representative)
        setReps(allRepresentatives)
        const issuedBillByUserRep = await getAllBillsBySponsorName(representative)
        setUserRepIssuedBills(issuedBillByUserRep)
        if (representative.length !== 0) {
          setUserRepresentative(representative)
        }
      }
    }
    getData()

    if (userRepresentative) {
      getAllBillsByRep(userRepresentative).then(results => {
      })
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

  async function fetchRepresentative (riding) {
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
    <Grid container spacing={1}>
      <Grid item xs={12}>
        {
          userRepIssuedBills.length !== 0 && categoryList.length !== 0
            ?
              (<Card>
                    <CardContent>
                      <Typography className={classes.title}>
                        The Distribution of Sponsored Bills
                      </Typography>
                      <BarChartWrapper type='bar-pie' data={userRepIssuedBills} categories={categoryList} />
                      <Typography variant="h7" color='textSecondary' component="p">
                        The Distribution of Issued Bills By The Representative Among Different Categories
                      </Typography>
                    </CardContent>
             </Card>
              )

            : ''
        }

      </Grid>

      {radarData.length !== 0 && categoryList.length !== 0

        ? <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ChartCard title='MP Voting Distribution'>
                <Radar
                  width={500}
                  height={500}
                  padding={70}
                  domainMax={35}
                  highlighted
                  onHover={(point) => {
                    if (point) {
                    } else {
                    }
                  }}
                  data={{
                    variables: [
                      { key: 'trade', label: 'trade' },
                      { key: 'criminal', label: 'criminal' },
                      { key: 'business', label: 'business' },
                      { key: 'Economics', label: 'economics' },
                      { key: 'Healthcare', label: 'healthcare' },
                      { key: 'Religion', label: 'religion' },
                      { key: 'Human Rights', label: 'human rights' }
                    ],
                    sets: [
                      {
                        values: radarData

                      }
                    ]
                  }}
                />
              </ChartCard>
            </Grid>
            {donutData.length
              ? <Grid item item xs={6}>
                <ChartCard title='Bipartisan Index'> <BarChartWrapper type='donut' data={donutData} /> </ChartCard>
              </Grid>
              : ''}
          </Grid>
        </Grid> : <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          zIndex: '-2',
          transform: 'translate(-50%, -50%)'
          }}
                    ><CircularProgress />
        </div>}
    </Grid>
  )
}

export async function createDataSetRadar (categories, data) {

  const dataArray = []
  let temp = {}
  const dataSetRadar = {}

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
    if (category.category) {
      dataSetRadar[category.category] = category.value
    }
  })

  return dataSetRadar
}

export async function createDataSetDonut (sponsors, mpdata) {
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

  parties = { Liberal: liberalCounter, Conservative: conservativeCounter, NDP: ndpCounter, People: peopleCounter, Green: greenCounter, BQ: bqCounter }
  return parties
}
