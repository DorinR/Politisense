import React, { useState, useEffect } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Box from '@material-ui/core/Box'
import RidingSwitcher from './RidingSwitcher/RidingSwitcher'
import RidingShape from './RidingShape/RidingShape'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
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

export async function fetchUserRiding(userEmail) {
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

export async function fetchRidingCode(riding) {
  let ridingCode = 0
  await axios
    .get(`http://localhost:5000/api/ridings/getRidingCode`, {
      riding
    })
    .then(
      res => {
        if (res.data.success) {
          ridingCode = res.data.data.code
        }
      },
      error => {
        console.error(error)
      }
    )
    .catch(err => {
      console.error(err)
    })
  return ridingCode
}

export default function RepresentativeInfo(props) {
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
    async function getData() {
      const user = JSON.parse(localStorage.getItem('user'))
      const { email } = user
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
        </CardContent>
      </Card>
      <Box m={1} />
      <RidingShape ridingCode={ridingCode} />
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
