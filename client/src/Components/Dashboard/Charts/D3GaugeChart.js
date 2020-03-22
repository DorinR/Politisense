import * as d3 from 'd3'
import { Component } from 'react'
let width = null
let arcSize = null
let innerRadius = null
const pi = Math.PI

export default class D3GaugeChart extends Component {
  constructor (element, data) {
    super(element)
    const svg = d3.select(element).append('svg')
    drawChart()
    const arcs = data.map(function (obj, i) {
      return d3.arc()
        .innerRadius(i * arcSize + innerRadius)
        .outerRadius((i + 1) * arcSize - (width / 100) + innerRadius)
        .cornerRadius(20)
    })
    const arcsGrey = data.map(function (obj, i) {
      return d3.arc()
        .startAngle(0)
        .endAngle(3 * pi / 2)
        .innerRadius(i * arcSize + innerRadius)
        .outerRadius((i + 1) * arcSize - (width / 100) + innerRadius)
        .cornerRadius(20)
    })

    const pieData = data.map(function (obj, i) {
      return [
        { value: obj.value * 0.75, arc: arcs[i], object: obj },
        { value: (100 - obj.value) * 0.75, arc: arcsGrey[i], object: obj },
        { value: 100 * 0.25, arc: arcs[i], object: obj }]
    })
    const pie = d3.pie()
      .sort(null)
      .value(function (d) {
        return d.value
      })
    const g = svg.selectAll('g').data(pieData).enter()
      .append('g')
      .attr('transform', 'translate(' + (((width) / 2) - 25) + ',' + ((width) / 2) + ') rotate(180)')

    const gText = svg.selectAll('g.textClass').data([{}]).enter()
      .append('g')
      .classed('textClass', true)
      .attr('transform', 'translate(' + ((width / 2) - 25) + ',' + width / 2 + ') rotate(180)')

    g.selectAll('path').data(function (d) {
      return pie(d)
    }).enter().append('path')
      .attr('id', function (d, i) {
        if (i === 1) {
          return 'Text' + d.data.object.label
        }
      })
      .attr('d', function (d) {
        return d.data.arc(d)
      }).attr('fill', function (d, i) {
        return i === 0 ? d.data.object.color : i === 1 ? '#dedede' : 'none'
      })
      .style('opacity', (d, i) => {
        return i === 0 ? 1 : i === 1 ? 0.3 : 1
      })

    svg.selectAll('g').each(function (d, index) {
      const el = d3.select(this)
      el.selectAll('path').each(function (r, i) {
        if (i === 1) {
          r.data.arc.centroid({
            startAngle: r.startAngle + 0.05,
            endAngle: r.startAngle + 0.001 + 0.05
          })
          g.append('text')
            .attr('font-size', ((5 * width) / 100))
            .attr('dominant-baseline', 'central')
            .append('textPath')
            .attr('textLength', function (d, i) {
              return 0
            })
        }
        if (i === 0) {
          const centroidText = r.data.arc.centroid({
            startAngle: r.startAngle,
            endAngle: r.startAngle
          })
          const lableObj = r.data.object
          gText.append('text')
            .attr('font-size', ((4 * width) / 100))
            .text(lableObj.label)
            .attr('transform', 'translate(' + (centroidText[0] - ((1.5 * width) / 100)) + ',' + (centroidText[1] + ') rotate(' + (180) + ')'))
            .attr('dominant-baseline', 'central')
        }
      }).on('mouseover', function (d) {
        g.append('text')
          .attr('class', 'test')
          .attr('transform', ' rotate(' + (180) + ')')
          .attr('text-anchor', 'middle')
          .attr('font-size', '1.4em')
          .attr('y', 10)
          .text(`${d.data.object.value}%`)
          .style('display', 'block')
      })
        .on('mouseout', function (d) {
          d3.selectAll('.test').remove()
        })
    })
    function drawChart () {
      // reset the width
      if (data.length > 3) {
        width = parseInt(d3.select(element).style('width'), 10) + 67
        arcSize = (4 * width / 100)
        innerRadius = arcSize * 3
      } else {
        width = parseInt(d3.select(element).style('width'), 10) + 80
        arcSize = (6 * width / 100)
        innerRadius = arcSize * 3
      }
      // set the svg dimensions
      svg.attr('width', width)
        .attr('height', width)
    }
    window.addEventListener('resize', drawChart)
  }
}
