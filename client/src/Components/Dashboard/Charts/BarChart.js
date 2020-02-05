import * as d3 from 'd3'

const margin = { top: 10, bottom: 50, left: 70, right: 10 }
const width = 800 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom
export default class BarChart {
  constructor (element) {
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    d3.json().then(data => {
      const y = d3.scaleLinear()
        .domain([
          d3.min(data, d => d.height) * 0.95,
          d3.max(data, d => d.height)])
        .range([height, 0])
      const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.4)
      const xAxisCall = d3.axisBottom(x)
      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxisCall)
      const yAxisCall = d3.axisLeft(y)
      svg.append('g').call(yAxisCall)
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
      svg.append('text')
        .attr('x', -(height / 2))
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text('Heights in cm')
        .attr('transform', 'rotate(-90)')
      const rects = svg.selectAll('rect')
        .data(data)
      rects.enter().append('rect')
        .attr('x', (d, i) => x(d.name))
        .attr('y', d => y(d.height))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.height))
        .attr('fill', 'orange')
        .on('mouseenter', function (actual, i) {
          d3.select(this).attr('fill', 'red')
        })
        .on('mouseleave', function (actual, i) {
          d3.select(this).attr('fill', 'orange')
        })
    })
  }
}
