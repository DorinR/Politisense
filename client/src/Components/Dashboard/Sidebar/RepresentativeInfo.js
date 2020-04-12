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
import CenteredCircularProgress from '../Utilities/CenteredCircularProgress'

const useStyles = makeStyles((theme) => ({
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
    .get(`/api/ridings/getRidingCode/${encodeURI(riding)}`)
<<<<<<< Updated upstream
    .then((res) => {
=======
    .then(res => {
>>>>>>> Stashed changes
      if (res.data.success) {
        return res.data.data.code
      }
    })
    .catch(console.error)
}

<<<<<<< Updated upstream
=======
export async function fetchUserRiding (userEmail) {
  return axios
    .get(`/api/users/${userEmail}/getUser`, {
      params: { repinfo: userEmail }
    })
    .then(res => {
      if (res.data.success) {
        return res.data.data.riding
      }
    })
    .catch(console.error)
}

export async function fetchRepresentative (riding) {
  return axios
    .get(`/api/representatives/${riding}/getRepresentative`)
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}

>>>>>>> Stashed changes
export default function RepresentativeInfo (props) {
  const classes = useStyles()

  const [ridingCode, setRidingCode] = useState(null)
  useEffect(() => {
    async function getData () {
<<<<<<< Updated upstream
      if (props.riding) {
        const code = await fetchRidingCode(props.riding)
        setRidingCode(code)
      }
=======
      // eslint-disable-next-line
      const user = JSON.parse(localStorage.getItem('user'))
      const riding = await fetchUserRiding(user.email)
      const promises = await Promise.all([
        fetchRidingCode(riding),
        fetchRepresentative(riding)
      ])
      const ridingCode = promises[0]
      const { name, party, start } = promises[1]
      const data = {
        name: name,
        ridingCode: ridingCode,
        riding: riding,
        politicalParty: party,
        yearElected: start
      }
      setData(data)
>>>>>>> Stashed changes
    }
    getData()
  }, [props.riding, ridingCode])

  return (
    <ListItemText>
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>NAME</Typography>
          <span className={classes.customTextFormatting}>
            {props.representative.name}
          </span>
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            POLITICAL PARTY
          </Typography>
          <span className={classes.customTextFormatting}>
            {props.representative.party}
          </span>
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>RIDING</Typography>
          {props.riding && props.user ? (
            <RidingSwitcher
              riding={props.riding}
              user={props.user}
              onChange={props.onChange}
            />
          ) : (
            <CenteredCircularProgress />
          )}
          <Box m={1} />
          {ridingCode && props.representative.party ? (
            <RidingShapeContainer
              ridingCode={ridingCode}
              politicalParty={props.representative.party}
            />
          ) : (
            <CenteredCircularProgress />
          )}
          <Box m={1} />
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            RIDING POPULATION
          </Typography>
          {props.riding ? (
            <RidingPopulation riding={props.riding} />
          ) : (
            <CenteredCircularProgress />
          )}
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            YEAR ELECTED
          </Typography>
          {props.representative.start}
        </CardContent>
      </Card>
    </ListItemText>
  )
}
