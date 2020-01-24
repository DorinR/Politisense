/* eslint-disable */
import React, { useState } from 'react'
import D3ChartHeadVsHeadComparison from './Charts/Wrappers/D3ChartHeadVsHeadComparison'
import ChartCard from './ChartCard'

export default function D3ChartHeadVsHeadContainer (props) {
  const [dataSet, setDataSet] = useState(props.data)

  return (
    <div>
      <ChartCard title='Comparing between Representatives on How much  do they agree based on common bills and vote records'>
        <D3ChartHeadVsHeadComparison data={dataSet} />
      </ChartCard>
    </div>

  )
}
