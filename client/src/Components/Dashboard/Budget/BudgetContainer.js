import React, { useEffect, useState } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import BarChartWrapper from '../Charts/Wrappers/BarChartWrapper'

export default function BudgetContainer() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const usr = JSON.parse(localStorage.getItem('user'))
    setUser(usr)
  }, [])

  const [riding, setRiding] = useState(null)
  useEffect(() => {
    async function getData() {
      if (user) {
        const riding = await fetchUserRiding(user.email)
        setRiding(riding)
      }
    }
    getData()
  }, [user])

  async function fetchUserRiding(userEmail) {
    return axios
      .get(`/api/users/${userEmail}/getUser`)
      .then(res => {
        if (res.data.success) {
          return res.data.data.riding
        }
      })
      .catch(console.error)
  }

  const [representative, setRepresentative] = useState(null)
  useEffect(() => {
    async function getData() {
      if (riding) {
        const rep = await fetchRepresentative(riding)
        setRepresentative(rep)
      }
    }
    getData()
  }, [riding])

  async function fetchRepresentative(riding) {
    return axios
      .get(`/api/representatives/${riding}/getRepresentative`)
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
    async function getData() {
      if (representative) {
        const id = await fetchRepresentativeId(representative)
        setRepID(id)
      }
    }
    getData()
  }, [representative])

  async function fetchRepresentativeId(representative) {
    return axios
      .get(`/api/representatives/${representative}/getRepresentativeId`)
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
      .catch(console.error)
  }

  const [data, setData] = useState(null)
  useEffect(() => {
    async function getData() {
      if (repID) {
        const data = await getBudgetData(repID)
        setData(data)
      }
    }
    getData()
  }, [repID])

  async function getBudgetData(id) {
    return axios
      .get(`/api/budgets/budget/${id}`)
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
      console.log(data)
      setBudgetData([mps, avgs])
    }
  }, [data, labelMP])

  /* eslint-disable */
  return (
    <ListItemText>
      {budgetData.length === 0 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
          <CircularProgress />
        </div>
      ) : (
        <BarChartWrapper type={'budget'} data={budgetData} />
      )}

      <Box m={1} />
    </ListItemText>
  )
    }