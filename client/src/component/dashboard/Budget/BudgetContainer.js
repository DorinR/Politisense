import React, { useEffect, useState } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import BarChartWrapper from '../Charts/Wrappers/BarChartWrapper'

export async function fetchUserRiding (userEmail) {
  let result = ''
  await axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        const riding = res.data.data.riding
        result = riding
      }
    })
    .catch(err => console.error(err))
  return result
}

export async function fetchRepresentative (riding) {
  let result = ''
  await axios
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        const representative = res.data.data.name
        result = representative
      }
    })
    .catch(err => console.error(err))
  return result
}

export async function fetchRepresentativeId (representative) {
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

export async function getBudgetData(representativeID) {
  return await axios
    .get(
      `http://localhost:5000/api/budget/:${representativeID}`
    )
    .then(res => {
        return res.data.data
    })
    .catch(console.error)
}

export default function BudgetContainer () {
  // budget data
  const [budgetData, setBudgetData] = useState([])

  useEffect(() => {
    async function getData () {
      const mp = {
        label: '',
        values: []
      }
      const avg = {
        label: 'Average Among MPs',
        values: []
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        // boilerplate data fetching
        const { email } = user;
        const riding = await fetchUserRiding(email);
        const representative = await fetchRepresentative(riding);
        mp.label = representative
        const representativeId = await fetchRepresentativeId(representative);
        const {mp, avg} = await getBudgetData(representativeId)
      }
      setBudgetData([mp, avg])
    }
    getData();
  }, [budgetData]);
  /* eslint-disable */
  return (
    <ListItemText>
      {budgetData.length == 0 ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <CircularProgress />
        </div>
      ) :

        <BarChartWrapper type={'budget'} data={budgetData} />

      }

      <Box m={1} />
    </ListItemText>
  );
}
