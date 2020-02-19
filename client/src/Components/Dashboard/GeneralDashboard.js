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
import CategoryDashboard from "./CategoryDashboard";
import BillHistoryTable from "./PastBills/BillHistoryTable";
import Budget from "./Budget/Budget";
import TotalProfit from "./TotalProfit";
import TotalUsers from "./TotalUsers";
import TasksProgress from "./TasksProgress";
import IssuedBillsByMP from "./IssuedBillsByMP";
import D3GaugeChart from "./Charts/D3GaugeChart";
import UsersByDevice from "./UsersByDevice";
import LatestProducts from "./LatestProducts";
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
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
}))
export default function GeneralDashboard () {
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
  const [barPierows, setBarPieRows] = React.useState([])

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
    // async function populateIssuedBill (userRepIssuedBills){
    //   const dataForTable = await createDataPieBarTable(categoryList,userRepIssuedBills)
    //   return dataForTable
    // }
    getData()
    // if(userRepIssuedBills){
    //   populateIssuedBill(userRepIssuedBills).then(res => {
    //     setRows(res)
    //   })
    // }
  }, [])

  async function getAllReps () {
    return axios
      .get('http://localhost:5000/api/representatives/getAllRepresentatives')
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
      .get(`http://localhost:5000/api/bills/${head}/getAllBillsByRep`)
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
        const issuedBillByUserRep = await getAllBillsBySponsorName(userRepresentative)
        setUserRepIssuedBills(issuedBillByUserRep)
        populateIssuedBill(issuedBillByUserRep).then(res => {
          setBarPieRows(res)
        })
      }
    }
    async function populateIssuedBill (userRepIssuedBills){
        const dataForTable = await createDataPieBarTable(categoryList,userRepIssuedBills)
        return dataForTable
      }
    getData()

  }, [userRepresentative])

  async function getAllBillsBySponsorName (head) {
    return axios
      .get(`http://localhost:5000/api/bills/${head}/getAllBillsBySponsorName`)
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
      <div className={classes.root}>
        <Grid
            container
            spacing={4}
        >
          <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
          >
            <Budget />
          </Grid>
          <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
          >
            <TotalUsers />
          </Grid>
          <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
          >
            <TasksProgress />
          </Grid>
          <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
          >
            <TotalProfit />
          </Grid>
          <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
          >
            {userRepIssuedBills && categoryList && userRepresentative && barPierows ? (
            <IssuedBillsByMP userRepIssuedBills={userRepIssuedBills}
                             categoryList={categoryList}
                             userRepresentative={userRepresentative}
                             rows={barPierows}/>)
                : ('nothing')}
          </Grid>
          <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
          >
            <UsersByDevice title={'gauge'}/>
          </Grid>
          <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
          >
            {radarData && categoryList ? (
            <LatestProducts radarData={radarData} />):""}
          </Grid>
          <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
          >
            <BillHistoryTable/>
          </Grid>
          <Grid
              item
              lg={12}
              md={12}
              xl={9}
              xs={12}
          >
          <CategoryDashboard/>
          </Grid>
        </Grid>
      </div>
  );
}

function createDataSetRadar(categories, data) {
  const dataArray = [];
  let temp = {};
  const dataSetRadar = {};
  let maxValue = 0;
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
export async function createDataPieBarTable(categories, data) {

  let billsForSpeicificCategory =[]
  let finalArray=[]
  categories.forEach(category => {

    let totalBills = 0

    data.forEach(bill => {
      if (bill.billsClassified.category === (category.toLowerCase())) {
        totalBills++
        if (bill.voteRecord.yeas > bill.voteRecord.nays) {
          billsForSpeicificCategory.push({bill:bill,category: category, status:'Passed'})
        } else {
          billsForSpeicificCategory.push({bill:bill ,category: category, status:'Failed'})
        }
      }
    })
    if (totalBills !== 0) {
      finalArray = finalArray.concat(billsForSpeicificCategory)
    }
  })
  return finalArray
}