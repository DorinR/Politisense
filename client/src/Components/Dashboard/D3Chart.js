import * as d3 from 'd3'
import React, { useRef, useEffect} from 'react'

export const D3Chart = (props) => {
   const ref = useRef(null)
   let yesCounter = 0
   let  noCounter = 0
   const votingRecord = props.data

  // the voting_record.csv is imported from the gov website, the FirstName is an attribute that indicates
  // what did the ZIAD ABOULTAIF vote for a specific bill
  const getTotalVotes= (data,yesCounter,noCounter) => {
      data.map((d) => {
            if (d.FirstName.includes('Nay')) { noCounter++}
            if (d.FirstName.includes('Yea')) {  yesCounter++}
            return null
        })
      return [yesCounter,noCounter]
    }

   let totalVotes = getTotalVotes(votingRecord,yesCounter,noCounter)
   yesCounter = totalVotes[0]
   noCounter = totalVotes[1]
   let totalYesNoVotes = [{ index: 0, title: "Total Yes's", value: yesCounter}, { index: 1, title: "Total No's", value: noCounter}]

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
      const data = createPie(totalYesNoVotes)

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

      let svg = d3.select('#svg')
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
    , [props.data, totalYesNoVotes, createArc, colors, format, createPie])

  return (
    <div>
      <svg id='svg' viewBox="0 0 100 100" >
        <g
          ref={ref}
          transform={`translate(${props.height / 3} ${props.height / 3})`}
        />
      </svg>
    </div>
  )
}
