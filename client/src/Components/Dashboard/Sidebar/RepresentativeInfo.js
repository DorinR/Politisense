import React, { useState, useEffect } from 'react'
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
const Firestore = require('../../../Firebase').Firestore

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

export async function fetchUserRiding (userEmail) {
  return axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.riding
      }
    })
    .catch(console.error)
}

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

export default function RepresentativeInfo (props) {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [politicalParty, setPoliticalParty] = useState('')
  const [riding, setRiding] = useState('')
  const [yearElected, setYearElected] = useState(1000)
  const [ridingCode, setRidingCode] = useState('')

  useEffect(() => {
    const db = new Firestore()
    db.Politician()
      .select('name', '==', props.representativeToLoad)
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.')
          return
        }
        snapshot.forEach(doc => {
          const { name, politicalParty, riding, yearElected } = doc.data()
          setName(name)
          setPoliticalParty(politicalParty)
          setYearElected(yearElected)
          setRiding(riding)
        })
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
  })

  useEffect(() => {
    async function getData () {
      // eslint-disable-next-line
      const { email } = JSON.parse(localStorage.getItem('user'))
      const riding = await fetchUserRiding(email)
      const ridingCode = await fetchRidingCode(riding)
      setRidingCode(ridingCode)
    }
    getData()
  }, [ridingCode])

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
