import * as d3 from 'd3'
import { Component } from 'react'
let width
let arcSize
let innerRadius = 0

export default class RadialD3Chart extends Component {
  constructor (element, data) {
    super(element)
    const svg = d3.select(element).append('svg')
    drawChart()
    const arcs = data.map((obj, i) => {
      return d3.arc()
        .innerRadius(i * arcSize + innerRadius)
        .outerRadius((i + 1) * arcSize - (width / 100) + innerRadius)
        .cornerRadius(20)
    })
    const arcsGrey = data.map((obj, i) => {
      return d3.arc()
        .startAngle(0)
        .endAngle(3 * Math.PI / 2)
        .innerRadius(i * arcSize + innerRadius)
        .outerRadius((i + 1) * arcSize - (width / 100) + innerRadius)
        .cornerRadius(20)
    })

    const pieData = data.map((obj, i) => {
      return [
        { value: obj.value * 0.75, arc: arcs[i], object: obj },
        { value: (100 - obj.value) * 0.75, arc: arcsGrey[i], object: obj },
        { value: 100 * 0.25, arc: arcs[i], object: obj }]
    })
    const pie = d3.pie()
      .sort(null)
      .value((d) => {
        return d.value
      })
    const chartContainer = svg.selectAll('g').data(pieData).enter()
      .append('g')
      .attr('transform', 'translate(' + (((width) / 2) - 25) + ',' + ((width) / 2) + ') rotate(180)')

    const labels = svg.selectAll('g.textClass').data([{}]).enter()
      .append('g')
      .classed('textClass', true)
      .attr('transform', 'translate(' + ((width / 2) - 25) + ',' + width / 2 + ') rotate(180)')

    chartContainer.selectAll('path').data((d) => {
      return pie(d)
    }).enter().append('path')
      .attr('id', (d, i) => {
        if (i === 1) {
          return 'Text' + d.data.object.label
        }
      })
      .attr('d', (d) => {
        return d.data.arc(d)
      }).attr('fill', (d, i) => {
        return i === 0 ? d.data.object.color : i === 1 ? '#dedede' : 'none'
      })
      .style('opacity', (d, i) => {
        return i === 0 ? 1 : i === 1 ? 0.3 : 1
      })

    assigningLabelsForEachPartyArc()
    showingBiPartisanValueOnceHoveredOnEachPartyArc()
    const mouseover = (d) => {
      chartContainer.append('text')
        .attr('class', 'label')
        .attr('transform', ' rotate(' + (180) + ')')
        .attr('text-anchor', 'middle')
        .attr('font-size', '1.4em')
        .attr('y', 10)
        .text(`${d.data.object.value}%`)
        .style('display', 'block')
    }

    const mouseout = () => {
      d3.selectAll('.label').remove()
    }

    function assigningLabelsForEachPartyArc () {
      svg.selectAll('g').each(function (d, index) {
        d3.select(this).selectAll('path').each((r, i) => {
          switch (i) {
            case 0: {
              const centroidText = r.data.arc.centroid({
                startAngle: r.startAngle,
                endAngle: r.startAngle
              })
              const lableObj = r.data.object
              labels.append('text')
                .attr('font-size', ((4 * width) / 100))
                .text(lableObj.label)
                .attr('transform', 'translate(' + (centroidText[0] - ((1.5 * width) / 100)) + ',' + (centroidText[1] + ') rotate(' + (180) + ')'))
                .attr('dominant-baseline', 'central')
              break }
            case 1: {
              r.data.arc.centroid({
                startAngle: r.startAngle + 0.05,
                endAngle: r.startAngle + 0.001 + 0.05
              })

              chartContainer.append('text')
                .attr('font-size', ((5 * width) / 100))
                .attr('dominant-baseline', 'central')
                .append('textPath')
                .attr('textLength', (d, i) => {
                  return 0
                })
              break
            }
            default: return 0
          }
        })
      })
    }

    function showingBiPartisanValueOnceHoveredOnEachPartyArc () {
      svg.selectAll('g').each(function (d, index) {
        d3.select(this).selectAll('path')
          .on('mouseover', (d) => mouseover(d))
          .on('mouseout', (d) => mouseout(d))
      })
    }
    function drawChart () {
      // reset the width
      let containerWidth = 0
      if (data.length > 3) {
        containerWidth = parseInt(d3.select(element).style('width'), 10) + 67
        if (!isNaN(containerWidth)) { width = containerWidth } else { width = 400 }
        arcSize = (4 * width / 100)
        innerRadius = arcSize * 3
      } else {
        containerWidth = parseInt(d3.select(element).style('width'), 10) + 80
        if (!isNaN(containerWidth)) {
          width = containerWidth
        } else {
          width = 400
        }
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
