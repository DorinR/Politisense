/* eslint-disable */
import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import HeadInfo from './HeadInfo'
import axios from 'axios'
import D3ChartHeadVsHeadContainer from './D3ChartHeadVsHeadContainer'
import Card from '@material-ui/core/Card'
import Grow from '@material-ui/core/Grow';

export default function HeadToHeadComparison (props) {
  const [head1, setHead1] = useState('')
  const [head2, setHead2] = useState('')
  const [head1Bills, setHead1Bills] = useState([])
  const [head2Bills, setHead2Bills] = useState([])
  const [updated, setUpdated] = useState(false)
  const [dataSet, setDataSet] = useState([])

  const updateHead1 = (head) => {
    if (head === head1 || head === '') {
      setUpdated(false)
    } else {
      setUpdated(true)
      setDataSet([])
      setHead1(head)
      setHead1Bills([])
    }
  }

  const updateHead2 = (head) => {
    if (head2 === head || head === '') {
      setUpdated(false)
    } else {
      setUpdated(true)
      setHead2(head)
      setHead2Bills([])
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
          if (dataForHead1[i].voteRecord.bill === dataForHead2[j].voteRecord.bill) {
            commonBillsCounter++
            if (dataForHead1[i].voteRecord.yea === dataForHead2[j].voteRecord.yea) {
              similarities++
            }
          }
        }
      }
      const final = (similarities / (commonBillsCounter)) * 100
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
    <div>
      <Grid
        container
        spacing={5}
        direction='row'
        alignItems='center'
        justify='center'
        style={{ minHeight: '100vh' }}
      >
        <Grid item={1}>
          <HeadInfo updateHead={updateHead1} />
        </Grid>
        <Grid
          item
          direction='row'
          justify='center'
          alignItems='center'
        >
          {dataSet.length
            ?  <Grow
                  in={dataSet.length}
              >
                <Card>
                  <D3ChartHeadVsHeadContainer data={dataSet} />
                </Card>

          </Grow>

            : ''}
        </Grid>
        <Grid item={1}>
          <HeadInfo updateHead={updateHead2} />
        </Grid>
      </Grid>
    </div>

  )
}
export async function getAllBillsByHead (head) {
  const res = await axios.get(`http://localhost:5000/api/bills/${head}/getAllBillsByHead`)
  return res.data.data
}
export function calcPercent (percent) {
  return [percent, 100 - percent]
}
