import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import { fetchUserRiding } from '../Navbar'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import CategoryDashboard from "../Dashboard/CategoryDashboard";
import BillHistoryTable from "../Dashboard/PastBills/BillHistoryTable";
import Budget from "../Dashboard/Budget/Budget";
import Associations from "./Associations";
import Roles from "./Roles";
import Committees from "./Committees";
import IssuedBillsByMP from "./IssuedBillsByMP";
import Bipartisan from "./Bipartisan";
import MPActivityDistribution from "./MPActivityDistribution";
import {getLegend} from "../Dashboard/Charts/DonutChart";
import {
  CssBaseline
} from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },

}))
export default function MyMP () {
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
  const [barPieRows, setBarPieRows] = React.useState([])

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
        console.log(userRepresentative)
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
      const data = createDataSetDonut(reps, representativeData).then(res=>{
        console.log(data)
        setDonutData(res)
      })
    }
  }, [reps, representativeData])

  const [radarData, setRadarData] = React.useState(null)
  useEffect(() => {
    if (categoryList && representativeData) {
      const data = createDataSetRadar(categoryList, representativeData)
      console.log(data)
      setRadarData(data)
    }
  }, [representativeData, categoryList])

  /* eslint-disable */
  return (
      <div>
      <CssBaseline/>
        {userRepresentative && userRepIssuedBills  && categoryList && userRepresentative && barPieRows && radarData ?

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
                  {userRepIssuedBills && categoryList && userRepresentative && barPieRows ? (
                          <IssuedBillsByMP userRepIssuedBills={userRepIssuedBills}
                                           categoryList={categoryList}
                                           userRepresentative={userRepresentative}
                                           rows={barPieRows}/>)
                      : ('nothing')}
                </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                >
                  { userRepresentative? <Roles userRepresentative={userRepresentative}/>: ""}
                </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                >
                  { userRepresentative? <Committees userRepresentative={userRepresentative}/>: ""}

                </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                >
                  { userRepresentative? <Associations userRepresentative={userRepresentative}/>: ""}
                </Grid>
                <Grid
                    item
                    lg={8}
                    md={12}
                    xl={9}
                    xs={12}
                >
                  <Budget />
                </Grid>
                <Grid
                    item
                    lg={4}
                    md={6}
                    xl={3}
                    xs={12}
                >
                    <div>
                  {donutData && representativeData ? (
                      <Bipartisan data= {donutData[0]} rows={donutData[1]} title={'gauge'}/>):"donutData is null"}
                    </div>
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
                <Grid
                    item
                    lg={4}
                    md={6}
                    xl={3}
                    xs={12}
                >
                  {radarData && categoryList ? (
                      <MPActivityDistribution radarData={radarData} rows ={representativeData} categoryList={categoryList}/>):""}
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
              </Grid>
            </div>
            :
          <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress style={{ color:"#00bcd4"}}/>
        </div>
        }

      </div>
  );
}

function createDataSetRadar(categories, data) {
  const dataArray = [];
  let temp = {};
  const dataSetRadar = {};
  let maxValue = 0;

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
    let bills=[],
        liberalCounter = 0,
        conservativeCounter = 0,
        ndpCounter = 0,
        peopleCounter = 0,
        greenCounter = 0,
        bqCounter = 0

    if (mpdata.length) {
      mpdata.forEach(bill => {
        if (bill.voteRecord.yea === true) {
          sponsors.forEach(sponsor => {
            if (sponsor.name === bill.billData.sponsorName) {
              switch (sponsor.politicalParty) {
                case 'liberal':
                  liberalCounter++
                  bills.push({billDetails: bill, category: "Liberal"})
                  break
                case 'conservative':
                  conservativeCounter++
                  bills.push({billDetails:bill,category:'Conservative'})
                  break
                case 'ndp':
                  ndpCounter++
                  bills.push({billDetails: bill, category: "NDP"})
                  break
                case 'bloc québécois':
                  bqCounter++
                  bills.push({billDetails: bill, category: "Bloc Québécois"})
                  break
                case 'green':
                  greenCounter++
                  bills.push({billDetails: bill, category: "Green"})
                  break
                case 'people':
                  peopleCounter++
                  bills.push({billDetails: bill, category: "People"})
                  break
                default:
                  return 'nothing'
              }
            }
          })
        }
      })
    }
    let parties = [
      {label : "Liberal" , freq: liberalCounter},
      {label : "Conservative" , freq: conservativeCounter},
      {label : "NDP" , freq: ndpCounter},
      {label : "People" , freq: peopleCounter},
      {label : "Green" , freq: greenCounter},
      {label : "BQ" , freq: bqCounter},
    ]

    parties.forEach((element,i) => {
      let percentage= getLegend(element,parties)
      parties[i].value =percentage
    })
    parties= sortBasedOnLargest(parties)
    parties = AssignColorForEachItem(parties)
    console.log(parties,bills)
    return [parties,bills]
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
export function sortBasedOnLargest(list){
  return list.sort(function(a, b){
    return a.value-b.value
  })
}
export function AssignColorForEachItem(list){
  const colors= ['#32afa9','#556fb5','#00818a','#293462','#7189bf','#d45079']

  list.forEach((item,index) => {
    item.color = colors[index]
  })
  return list
}