import React, { useEffect, useState } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Box from '@material-ui/core/Box'
import RidingSwitcher from './RidingSwitcher/RidingSwitcher'
import RidingShapeContainer from './RidingShape/RidingShapeContainer'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import RidingPopulation from './RidingPopulation/RidingPopulation'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
  customCardContent: {
    padding: 5,
    paddingBottom: '5px!important',
    backgroundColor: '#f7f7f7'
  },
  customHeadingText: {
    color: '#41aaa8',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  customTextFormatting: {
    textTransform: 'capitalize'
  }
}))

export async function fetchRidingCode (riding) {
  return axios
    .get(`http://localhost:5000/api/ridings/getRidingCode/${encodeURI(riding)}`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.code
      }
    })
    .catch(console.error)
}

export async function fetchUserRiding (userEmail) {
  return axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`,
      { params: { repinfo: userEmail } })
    .then(res => {
      if (res.data.success) {
        return res.data.data.riding
      }
    })
    .catch(console.error)
}

export async function fetchRepresentative (riding) {
  return axios
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

export default function RepresentativeInfo (props) {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [politicalParty, setPoliticalParty] = useState('')
  const [riding, setRiding] = useState('')
  const [yearElected, setYearElected] = useState(1000)
  const [ridingCode, setRidingCode] = useState('')
  const [data, setData] = useState({})

  useEffect(() => {
    async function getData () {
      // eslint-disable-next-line
      const user = JSON.parse(localStorage.getItem('user'))
      const riding = await fetchUserRiding(user.email)
      const promises = await Promise.all([
        fetchRidingCode(riding),
        fetchRepresentative(riding)
      ])
      const ridingCode = promises[0]
      //const { name, politicalParty, yearElected } = promises[1]
      setData({
        name: name,
        ridingCode: ridingCode,
        riding: riding,
        politicalParty: politicalParty,
        yearElected: yearElected
      })
    }
    getData()
  }, [])

  useEffect(() => {
    setName(data.name)
    setPoliticalParty(data.politicalParty)
    setRiding(data.riding)
    setRidingCode(data.ridingCode)
    setYearElected(data.yearElected)
  }, [data])

  return (
    <ListItemText>
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>NAME</Typography>
          <span className={classes.customTextFormatting}>{name}</span>
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            POLITICAL PARTY
          </Typography>
          <span className={classes.customTextFormatting}>{politicalParty}</span>
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>RIDING</Typography>
          <RidingSwitcher riding={riding} />
          <Box m={1} />
          <RidingShapeContainer
            ridingCode={ridingCode}
            politicalParty={politicalParty}
          />
          <Box m={1} />
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            RIDING POPULATION
          </Typography>
          <RidingPopulation riding={riding} />
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            YEAR ELECTED
          </Typography>
          {yearElected}
        </CardContent>
      </Card>
    </ListItemText>
  )
}
