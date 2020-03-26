import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import CategoryDashboard from '../Dashboard/CategoryDashboard'
import BillHistoryTable from '../Dashboard/PastBills/BillHistoryTable'
import Budget from '../Dashboard/Budget/Budget'
import Associations from './Associations'
import Roles from './Roles'
import Committees from './Committees'
import IssuedBillsByMP from './IssuedBillsByMP'
import Bipartisan from './Bipartisan'
import MPActivityDistribution from './MPActivityDistribution'
import { capitalizedName, getPercentagePartisanIndex, fetchCategories, fetchUserRiding } from '../Dashboard/Utilities/CommonUsedFunctions'

import {
  CssBaseline
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  }

}))
export default function MyMP () {
  const classes = useStyles()
  const [user, setUser] = useState(null)
  const [barPieRows, setBarPieRows] = React.useState([])

  const [categoryList, setCategoryList] = React.useState(null)
  useEffect(() => {
    async function getData () {
      const categories = await fetchCategories()
      setCategoryList(categories)
    }
    getData()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const user = JSON.parse(localStorage.getItem('user'))
    setUser(user)
  }, [])

  async function getAllRepsFromAllParliaments () {
    return axios
      .get('/api/representatives/getAllRepsFromAllParliaments')
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
      .catch(console.error)
  }
  const [allMPsFromAllParliaments, setAllMPsFromAllParliaments] = React.useState(null)
  useEffect(() => {
    async function getData () {
      const mpsFromAllParliaments = await getAllRepsFromAllParliaments()
      setAllMPsFromAllParliaments(mpsFromAllParliaments)
    }
    getData()
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
        `/api/representatives/${riding}/getRepresentative`
      )
      .then(res => {
        if (res.data.success) {
          return res.data.data.name
        }
      })
      .catch(console.error)
  }

  async function getAllBillsByRepForAllParliaments (head) {
    return axios
      .get(`/api/bills/${head}/getAllBillsByRepForAllParliaments`)
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
      .catch(console.error)
  }
  const [radarDataRows, setRadarDataRows] = React.useState(null)
  const [representativeData, setRepresentativeData] = React.useState(null)
  useEffect(() => {
    async function getData () {
      if (userRepresentative) {
        const billsByRep = await getAllBillsByRepForAllParliaments(userRepresentative)
        setRepresentativeData(billsByRep)
      }
    }
    getData()
  }, [userRepresentative])

  useEffect(() => {
    async function getData () {
      if (categoryList && representativeData) {
        const radarRows = createRadarRows(representativeData, categoryList)
        setRadarDataRows(radarRows)
      }
    }
    getData()
  }, [representativeData])

  async function getAllBillsBySponsorForAllParliaments (head) {
    return axios
      .get(`/api/bills/${head}/getAllBillsBySponsorForAllParliaments`)
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
      .catch(console.error)
  }
  const [uniqueIssuedBills, setUniqueIssuedBills] = React.useState(null)
  useEffect(() => {
    async function getData () {
      if (userRepresentative) {
        const issuedBillByUserRep = await getAllBillsBySponsorForAllParliaments(
          userRepresentative
        )
        const uniqueIssuedBills = issuedBillByUserRep.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.billsClassified.number === thing.billsClassified.number && t.billsClassified.category === thing.billsClassified.category
          ))
        )
        setUniqueIssuedBills(uniqueIssuedBills)
      }
    }
    getData()
  }, [userRepresentative])

  const [userRepIssuedBills, setUserRepIssuedBills] = React.useState(null)
  useEffect(() => {
    async function getData () {
      if ((uniqueIssuedBills && uniqueIssuedBills.length !== 0)) {
        setUserRepIssuedBills(uniqueIssuedBills)
      }
    }
    getData()
  }, [uniqueIssuedBills])

  useEffect(() => {
    async function getData () {
      if (userRepIssuedBills) {
        const rows = await createDataPieBarTable(categoryList, userRepIssuedBills)
        setBarPieRows(rows)
      }
    }
    getData()
  }, [userRepIssuedBills])

  const [donutData, setDonutData] = React.useState(null)
  useEffect(() => {
    async function getDataForDonutD3 () {
      if (allMPsFromAllParliaments && representativeData) {
        const data = createDataSetDonut(allMPsFromAllParliaments, representativeData)
        setDonutData(data)
      }
    }
    getDataForDonutD3()
  }, [allMPsFromAllParliaments, representativeData])

  const [radarData, setRadarData] = React.useState(null)
  useEffect(() => {
    if (categoryList && representativeData) {
      const data = createDataSetRadar(categoryList, representativeData)
      setRadarData(data)
    }
  }, [representativeData, categoryList])

  /* eslint-disable */
  return (
      <div>
      <CssBaseline/>
        {userRepresentative &&  categoryList  && radarData && donutData?

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
                  {categoryList && userRepresentative ? (
                          <IssuedBillsByMP
                                           userRepIssuedBills={userRepIssuedBills}
                                           categoryList={categoryList}
                                           userRepresentative={userRepresentative}
                                           rows={barPieRows}/>)
                      : ('')}
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
                  {radarData && categoryList? (
                      <MPActivityDistribution radarData={radarData} rows ={radarDataRows} categoryList={categoryList}/>):""}
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

  maxValue=roundUpToNearestInteger(maxValue)
  return [dataSetRadar, maxValue]
}
 function getPoliticalPartyFromSponsor(sponsors){
  let politicalParties = [...new Set(sponsors.map(item => item.party))]
  return politicalParties
}

function createPartyCountersForBiPartisanIndex(politicalPartiesFromAllParliaments){
  let partiesCounters = []
  politicalPartiesFromAllParliaments.forEach((party) => {
    partiesCounters.push({partyType: party, counter: 0})
  })
  return partiesCounters
}
function getBillsForBiPartisanIndex(mpdata,sponsors){
  let bills =[]
  mpdata.forEach(bill => {
    if (bill.voteRecord.yea === true) {
      sponsors.forEach(sponsor => {
        if (sponsor.name === bill.billData.sponsorName) {
          if(!(bills && bills.find(element => element.billDetails.billData.number === bill.billData.number))){
            bills.push({billDetails: bill, category: sponsor.party})
          }
        }
      })
    }
  })
return bills
}

function getPartiesDataForBiPartisanIndex(mpdata,sponsors,partiesCounters){
  let partiesData=[]
  mpdata.forEach(bill => {
    if (bill.voteRecord.yea === true) {
      sponsors.forEach(sponsor => {
        if (sponsor.name === bill.billData.sponsorName) {
          partiesCounters.forEach((party)=> {
            if(sponsor.party === party.partyType && party.partyType !== "" && party.partyType !== undefined){
              party.counter++
            }
          })
        }
      })
    }
  })
  partiesCounters.forEach(element=> {
    partiesData.push({ label:element.partyType, freq: element.counter, value:0})
  })
  return partiesData
}

function formattingPartiesData(partiesData){
  partiesData=  partiesData.filter(element=>
      element.label !== undefined && element.label !== "" && element.freq !==0
  )
  partiesData.forEach(element => {
    element.label = capitalizedName(element.label)
    element.value = getPercentagePartisanIndex(element,partiesData)
  })
  partiesData= sortBasedOnLargest(partiesData)
  partiesData = AssignColorForEachItem(partiesData)

  return partiesData
}


 function createDataSetDonut(sponsors, mpdata) {
  let politicalPartiesFromAllParliaments = getPoliticalPartyFromSponsor(sponsors)
  let bills = []
  let partiesData=[]
  let partiesCounters = createPartyCountersForBiPartisanIndex(politicalPartiesFromAllParliaments)
  if (mpdata.length) {
     bills =getBillsForBiPartisanIndex(mpdata,sponsors)
    partiesData= getPartiesDataForBiPartisanIndex(mpdata,sponsors,partiesCounters)
  }
   partiesData = formattingPartiesData(partiesData)
  return [partiesData,bills]
}

function createDataPieBarTable(categories, data) {
  let billsForSpecificCategory =[]
  categories.forEach(category => {
    data.forEach(bill => {
      if (bill.billsClassified.category === (category.toLowerCase())) {
        pushToArrayUniqueBillsForPieBar(billsForSpecificCategory,bill,category)
      }
    })
  })

  return billsForSpecificCategory
}
 function sortBasedOnLargest(list){
  return list.sort(function(a, b){
    return a.value-b.value
  })
}
 function AssignColorForEachItem(list){
  const colors= ['#32afa9','#556fb5','#00818a','#293462','#7189bf','#d45079']

  list.forEach((item,index) => {
    item.color = colors[index]
  })
  return list
}

 function roundUpToNearestInteger(num){
  if (num % 10 === 0) return num+5;
  return (10 - num % 10) + num;
}

 function pushToArrayUniqueBillsForPieBar(arr, obj,category) {
    if(arr.length !== 0 ){
      const index = arr.findIndex((e) => e.bill.billsClassified.number === obj.billsClassified.number);
      if (index === -1 ) {
        if (obj.voteRecord.yeas > obj.voteRecord.nays) {
          arr.push({bill: obj, category: [category], status: 'Passed'})
        } else {
          arr.push({bill: obj, category: [category], status: 'Failed'})
        }
      } else {
        let currentCategoryList = arr[index].category
        let modifiedCategoryList = currentCategoryList.concat([category])
        let uniqueCategoryList = [...new Set(modifiedCategoryList)]
        arr[index].category = uniqueCategoryList
      }
    }else {
      if (obj.voteRecord.yeas > obj.voteRecord.nays) {
        arr.push({bill: obj, category: [category], status: 'Passed'})
      } else {
        arr.push({bill: obj, category: [category], status: 'Failed'})
      }
    }
}
 function pushToArrayUniqueBillsForRadar(arr, obj,category) {
  if(arr.length !== 0 ){
    const index = arr.findIndex((e) => e.bill.billData.number === obj.billData.number);
    if (index === -1 ) {
      if (obj.voteRecord.yea) {
        arr.push({bill: obj, category: [category], status: 'Yea'})
      } else {
        arr.push({bill: obj, category: [category], status: 'Nay'})
      }

    } else {
      let currentCategoryList = arr[index].category
      let modifiedCategoryList = currentCategoryList.concat([category])
      let uniqueCategoryList = [...new Set(modifiedCategoryList)]

      arr[index].category = uniqueCategoryList
    }
  }else {
    if (obj.voteRecord.yea) {
      arr.push({bill: obj, category: [category], status: 'Yea'})
    } else {
      arr.push({bill: obj, category: [category], status: 'Nay'})
    }
  }
}


function createRadarRows(bills,categoryList){
  let rows = []
  categoryList.forEach(category => {
    bills.forEach(bill => {
      if (bill.billData.category === (category.toLowerCase())) {
        pushToArrayUniqueBillsForRadar(rows,bill,category)
      }
    })
  })
  return rows
}