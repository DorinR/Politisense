import * as d3 from 'd3'

const colors = ['#4CAF50', '#D50000']
const duration = 1500
const width = 450
const height = 250
const radius = Math.min(width, height) / 2
const format = d3.format('.0%')
const pie = d3.pie().sort(null)

const arc = d3.arc()
  .innerRadius(radius * 0.6)
  .outerRadius(radius)

export default class SimilaritiesPieChart {
  constructor (element, data) {
    const vis = this
    vis.svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + height / 2 + ')')
    vis.update(data)
  }

  update (data) {
    if (data) {
      const vis = this
      vis.data = data
      let path = vis.svg.selectAll('path')
        .data(pie(data[0].lower))
        .enter().append('path')
        .attr('fill', (d, i) => { return colors[i] })
        .attr('d', arc)
        .each(function (d) {
          this._current = d
        })

      const text = vis.svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.3em')

      const progress = 0

      console.log(vis.data[1])
      const timeout = setTimeout(function () {
        clearTimeout(timeout)
        console.log(vis.data[0].upper)
        path = path.data(pie(vis.data[0].upper))
        path.transition().duration(duration).attrTween('d', function (a) {
          const i = d3.interpolate(this._current, a)
          const i2 = d3.interpolate(progress, vis.data[1])
          this._current = i(0)
          return function (t) {
            text.text(format(i2(t) / 100))
            return arc(i(t))
          }
        })
      }, 250)
    }
  }
}
