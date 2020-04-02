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
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'

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
    .get(`/api/ridings/getRidingCode/${encodeURI(riding)}`)
    .then(res => {
      if (res.data.success) {
        return res.data.data.code
      }
    })
    .catch(console.error)
}

export default function RepresentativeInfo (props) {
  const classes = useStyles()

  const [ridingCode, setRidingCode] = useState(null)
  useEffect(() => {
    async function getData() {
      if(props.riding) {
        const code = await fetchRidingCode(props.riding)
        console.log(code)
        setRidingCode(code)
      }
    }
    getData()
  }, [props.riding, ridingCode])

  return (
    <ListItemText>
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>NAME</Typography>
          <span className={classes.customTextFormatting}>{props.representative.name}</span>
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            POLITICAL PARTY
          </Typography>
          <span className={classes.customTextFormatting}>{props.representative.party}</span>
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
            <Grid container alignItems='center'>
              <Grid item>
                <CircularProgress/>
              </Grid>
            </Grid>
          )}
          <Box m={1} />
          {ridingCode && props.representative.party ? (
            <RidingShapeContainer
              ridingCode={ridingCode}
              politicalParty={props.representative.party}
            />
          ) : (
            <Grid container alignItems='center' justify='center'>
              <Grid item>
                <CircularProgress/>
              </Grid>
            </Grid>
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
            <Grid container alignItems='center' justify='center'>
              <Grid item>
                <CircularProgress/>
              </Grid>
            </Grid>
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
