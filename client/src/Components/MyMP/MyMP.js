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
import { fetchCategories, fetchUserRiding, fetchRepresentative, createDataSetDonut, createDataPieBarTable, createRadarRows, createDataSetRadar } from '../Dashboard/Utilities/CommonUsedFunctions'
import {
  CssBaseline
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  }
}))

export default function MyMP (props) {
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
    if(!user) {
      // eslint-disable-next-line no-undef
      const usr = JSON.parse(localStorage.getItem('user'))
      setUser(usr)
    }
  },[user])

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
        const billsByRep = await getAllBillsByRepForAllParliaments(userRepresentative.name)
        setRepresentativeData(billsByRep)
      }
    }
    getData()
  }, [userRepresentative])

  useEffect(() => {
    function getData () {
      if (categoryList && representativeData) {
        const radarRows = createRadarRows(representativeData, categoryList)
        setRadarDataRows(radarRows)
      }
    }
    getData()
  }, [representativeData, categoryList])

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
          userRepresentative.name
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
    function getData () {
      if ((uniqueIssuedBills && uniqueIssuedBills.length !== 0)) {
        setUserRepIssuedBills(uniqueIssuedBills)
      }
    }
    getData()
  }, [uniqueIssuedBills])

  useEffect(() => {
    function getData () {
      if (userRepIssuedBills) {
        const rows = createDataPieBarTable(categoryList, userRepIssuedBills)
        setBarPieRows(rows)
      }
    }
    getData()
  }, [userRepIssuedBills, categoryList])

  const [donutData, setDonutData] = React.useState(null)
  useEffect(() => {
    function getDataForDonutD3 () {
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

  return (
    <div>
      <CssBaseline />
      {userRepresentative && categoryList && radarData && donutData
        ? (
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
                    issuedbills={userRepIssuedBills}
                    categorylist={categoryList}
                    representative={userRepresentative.name}
                    rows={barPieRows}
                  />)
                  : ('')}
              </Grid>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
                {userRepresentative ? <Roles representative={userRepresentative.name} /> : ''}
              </Grid>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
                {userRepresentative ? <Committees representative={userRepresentative.name} /> : ''}
              </Grid>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
                {userRepresentative ? <Associations representative={userRepresentative.name} /> : ''}
              </Grid>
              <Grid
                item
                lg={8}
                md={12}
                xl={8}
                xs={12}
              >
                <Budget />
              </Grid>
              <Grid
                item
                lg={4}
                md={6}
                xl={4}
                xs={12}
              >
                <div>
                  {donutData && representativeData ? (
                    <Bipartisan data={donutData[0]} rows={donutData[1]} title='gauge' />) : ''}
                </div>
              </Grid>
              <Grid
                item
                lg={12}
                md={12}
                xl={12}
                xs={12}
              >{user && representativeData && categoryList ? <CategoryDashboard user={user} representativedata={representativeData} categorylist={categoryList} /> : ''}
              </Grid>
              <Grid
                item
                lg={4}
                md={6}
                xl={4}
                xs={12}
              >
                {radarData && categoryList ? (
                  <MPActivityDistribution radardata={radarData} rows={radarDataRows} categorylist={categoryList} />) : ''}
              </Grid>
              <Grid
                item
                lg={8}
                md={12}
                xl={8}
                xs={12}
              >
                <BillHistoryTable
                  representative={userRepresentative}
                />
              </Grid>
            </Grid>
          </div>)
        : (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          >
            <CircularProgress style={{ color: '#00bcd4' }} />
          </div>)}

    </div>
  )
}
