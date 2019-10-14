import * as d3 from 'd3'
import React, { useRef, useEffect} from 'react'

export const D3Chart = (props) => {

   const ref = useRef(null)
   let yesCounter = 0
   let  noCounter = 0
   const billsData = props.data

  // the bills.csv is imported from the gov website, the FirstName is an attribute that indicates
  // what did the Mp voted for specific bill
  billsData.map((d) => {
    if (d.FirstName.includes('Nay')) { noCounter++}
    if (d.FirstName.includes('Yea')) {  yesCounter++}
    return null
  })

  const dataObjects = [{ index: 0, value: yesCounter, title: "Total Yes's" }, { index: 1, value: noCounter, title: "Total No's" }]

  const createPie = d3
    .pie()
    .value(d => d.value)
    .sort(null)

  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius)

  const colors = d3.scaleOrdinal(d3.schemeCategory10)

  const format = d3.format('.2f')

  useEffect(
    () => {
      const data = createPie(dataObjects)

      const group = d3.select(ref.current)
      const groupWithData = group.selectAll('g.arc').data(data)

      groupWithData.exit().remove()

      const groupWithUpdate = groupWithData
        .enter()
        .append('g')
        .attr('class', 'arc')

      const path = groupWithUpdate
        .append('path')
        .merge(groupWithData.select('path.arc'))

      path
        .attr('class', 'arc')
        .attr('d', createArc)
        .attr('fill', (d, i) => colors(i))

      const text = groupWithUpdate
        .append('text')
        .merge(groupWithData.select('text'))

      text
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('transform', d => `translate(${createArc.centroid(d)})`)
        .style('fill', 'white')
        .style('font-size', 10)
        .text(d => format(d.value))

      let svg = d3.select('#my_data').append('g').attr('transform', 'translate(100 60)')
      let keys = ['No', 'Yes']

      svg.selectAll('mydots')
        .data(keys)
        .enter()
        .append('circle')
        .attr('cx', 100)
        .attr('cy', function (d, i) { return 100 + i * 25 })
        .attr('r', 7)
        .style('fill', function (d, i) { return colors(i) })

      svg.selectAll('mylabels')
        .data(keys)
        .enter()
        .append('text')
        .attr('x', 120)
        .attr('y', function (d, i) { return 100 + i * 25 })
        .style('fill', function (d, i) { return colors(i) })
        .text(function (d) { return d })
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle')
    }
    , [props.data, dataObjects, createArc, colors, format, createPie])

  return (
    <div>
      <svg id='my_data' width={props.width} height={props.height}>
        <g
          ref={ref}
          transform={`translate(${props.height / 2} ${props.height / 2})`}
        />
      </svg>
    </div>
  )
}
