import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import RepresentativeCard from './RepresentativeCard'
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

export async function getAllBillsByHead (head) {
  const res = await axios.get(
        `http://localhost:5000/api/bills/${head}/getAllBillsByHead`
  )
  return res.data.data
}
export function calcPercent (percent) {
  return [percent, 100 - percent]
}

export default function CompareRepresentatives () {
  const classes = useStyles()
  const [head1, setHead1] = useState('')
  const [head2, setHead2] = useState('')
  const [dataSet, setDataSet] = useState([])

  const updateHead1 = head => {
    if (head === head1 || head === '') {
    } else {
      setDataSet([])
      setHead1(head)
    }
  }

  const updateHead2 = head => {
    if (head2 === head || head === '') {
    } else {
      setHead2(head)
      setDataSet([])
    }
  }

  useEffect(() => {
    async function getalldata (dataForHead1, dataForHead2) {
      let dataset = {}
      let commonBillsCounter = 0
      let similarities = 0
      for (let i = 0; i < dataForHead1.length; i++) {
        for (let j = 0; j < dataForHead2.length; j++) {
          if (
            dataForHead1[i].voteRecord.bill === dataForHead2[j].voteRecord.bill
          ) {
            commonBillsCounter++
            if (
              dataForHead1[i].voteRecord.yea === dataForHead2[j].voteRecord.yea
            ) {
              similarities++
            }
          }
        }
      }
      const final = (similarities / commonBillsCounter) * 100
      dataset = {
        lower: calcPercent(0),
        upper: calcPercent(final)
      }
      return [dataset, final]
    }

    async function getBills () {
      const head1Bills = await getAllBillsByHead(head1, 'head1')
      const head2Bills = await getAllBillsByHead(head2, 'head2')
      const dataset = await getalldata(head1Bills, head2Bills)
      setDataSet(dataset)
    }

    if (head1 !== '' && head2 !== '') {
      getBills()
    }
  }, [head1, head2])

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
                            Compare Representatives
            </Typography>
          </Container>
          <Typography
            variant='h5'
            align='center'
            color='textSecondary'
            paragraph
          >
                        Select two MP's of your choice and compare their information and
                        performance in terms of bills sponsored and voted pm and then see
                        how much or how little they agree on!
          </Typography>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <RepresentativeCard updateHead={updateHead1} />
              </Grid>
              <Grid item xs={6}>
                <RepresentativeCard updateHead={updateHead2} />
              </Grid>
              <Grid item xs={12}>
                {dataSet.length ? (
                  <Grow in={dataSet.length}>
                    <D3ChartHeadVsHeadContainer data={dataSet} />
                  </Grow>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </>
  )
}
