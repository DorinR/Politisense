/* eslint-disable */
import React, { useState } from 'react'
import D3ChartHeadVsHeadComparison from './Charts/Wrappers/D3ChartHeadVsHeadComparison'
import ChartCard from './ChartCard'

export default function D3ChartHeadVsHeadContainer (props) {
  const [dataSet] = useState(props.data)

  return (
    <div>
      <ChartCard title='Percentage of bills where both MPs voted the same'>
        <D3ChartHeadVsHeadComparison data={dataSet} />
      </ChartCard>
    </div>

  )
}
