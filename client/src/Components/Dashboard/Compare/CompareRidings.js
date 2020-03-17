import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ModernRepresentative from './ModernRepresentative'
import RepresentativeCardRiding from './RepresentativeCardRiding'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import D3ChartHeadVsHeadContainer from '../D3ChartHeadVsHeadContainer'
import Grow from '@material-ui/core/Grow'

const useStyles = makeStyles(theme => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  customHeaders: {
    color: '#42AAA8',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: '3em',
    textDecoration: 'underline',
    marginLeft: '-46px'
  },
  customTooltip: {
    marginLeft: '5px',
    paddingTop: '20px'
  }
}))

export async function getAllBillsByHead(head) {
  const res = await axios.get(
    `http://localhost:5000/api/bills/${head}/getAllBillsByHead`
  )
  return res.data.data
}
export function calcPercent(percent) {
  return [percent, 100 - percent]
}

export default function CompareRepresentatives() {
  const classes = useStyles()
  const [pastRep, setPastRep] = useState('')
  const [dataSet, setDataSet] = useState([])

  const updatePastRep = rep => {
    if (pastRep === rep || rep === '') {
    } else {
      setPastRep(rep)
      setDataSet([])
    }
  }

  useEffect(() => {
    async function getBills() {
      const pastRepBills = await getAllBillsByHead(pastRep, 'pastRep')
      // const dataset = await getAllData(pastRepBills)
      // setDataSet(dataset)
    }

    if (pastRep !== '') {
      getBills()
    }
  }, [pastRep])

  return (
    <>
      <CssBaseline />
      <div>
        <Container maxWidth='l'>
          <Container>
            <Typography
              style={{ display: 'inline-block' }}
              className={classes.customHeaders}
              align='left'
              color='textPrimary'
              gutterBottom
            >
              Riding History
            </Typography>
          </Container>
          <Typography
            variant='h5'
            align='center'
            color='textSecondary'
            paragraph
          >
            Have a look at the historical data of past MPs of your riding!
          </Typography>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ModernRepresentative />
              </Grid>
              <Grid item xs={6}>
                <RepresentativeCardRiding updateHead={updatePastRep} />
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </>
  )
}
