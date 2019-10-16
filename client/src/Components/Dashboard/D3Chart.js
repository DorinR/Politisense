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
      const groupWithData = group.selectAll('g.arc').data(data).attr("transform","translate(-30 -30)")

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
        .style('font-size', 7)
        .text(d => format(d.value))

      let svg = d3.select('#my_data')
      let keys = ['No', 'Yes']

      svg.selectAll('mydots')
        .data(keys)
        .enter()
        .append('circle')
        .attr('cx', 75)
        .attr('cy', function (d, i) { return 35 + i * 25 })
        .attr('r', 2)
        .style('fill', function (d, i) { return colors(i) })

      svg.selectAll('mylabels')
        .data(keys)
        .enter()
        .append('text')
        .attr('x',80 )
        .attr('y', function (d, i) { return 35 + i * 25 })
        .style('fill', function (d, i) { return colors(i) })
        .text(function (d) { return d })
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle')
          .style("font-size",8)
    }
    , [props.data, dataObjects, createArc, colors, format, createPie])

  return (
    <div>
      <svg id='my_data' viewBox="0 0 100 100" >
        <g
          ref={ref}
          transform={`translate(${props.height / 3} ${props.height / 3})`}
        />
      </svg>
    </div>
  )
}
