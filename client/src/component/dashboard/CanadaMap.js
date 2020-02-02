import * as d3 from 'd3'
import * as topojson from 'topojson-client'

export default class D3Chart {
  constructor (element) {
    const width = 960
    const height = 600
    let active = d3.select(null)

    const projection = d3.geoOrthographic().clipAngle(90).rotate([98, -60]).scale(600).translate([500, 200])
      .scale(700)
      .translate([width / 2, height / 2])

    const zoom = d3.zoom()

      .scaleExtent([1, 8])
      .on('zoom', zoomed)

    const path = d3.geoPath().projection(projection)

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width).attr('height', height)
      .style('fill', 'white')
      .on('click', stopped, true)

    svg.append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height)
      .on('click', reset)

    const g = svg.append('g')

    svg
      .call(zoom)

    d3.json('https://gist.githubusercontent.com/Brideau/2391df60938462571ca9/raw/f5a1f3b47ff671eaf2fb7e7b798bacfc6962606a/canadaprovtopo.json').then(function (data) {
      console.log(data)
      g.selectAll('path')
        .data(topojson.feature(data, data.objects.canadaprov).features)
        .enter().append('path')
        .attr('d', path)
        .attr('class', 'feature')
        .style('fill', 'grey')
        .on('click', clicked)
        .attr('cursor', 'pointer')
        .on('mouseover', function (d, i) {
          d3.select(this).style('fill', 'red').style('opacity', 1)
        })
        .on('mouseout', function (d, i) {
          d3.select(this).style('fill', 'grey')
        })
    })
    function clicked (d) {
      if (active.node() === this) return reset()
      active.classed('active', false)
      active = d3.select(this).classed('active', true)

      const bounds = path.bounds(d)
      const dx = bounds[1][0] - bounds[0][0]
      const dy = bounds[1][1] - bounds[0][1]
      const x = (bounds[0][0] + bounds[1][0]) / 2
      const y = (bounds[0][1] + bounds[1][1]) / 2
      const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)))
      const translate = [width / 2 - scale * x, height / 2 - scale * y]

      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale))
    }
    function reset () {
      active.classed('active', false)
      active = d3.select(null)

      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity)
    }

    function zoomed () {
      g.style('stroke-width', 1.5 / d3.event.transform.k + 'px')
      g.attr('transform', d3.event.transform)
    }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped () {
      if (d3.event.defaultPrevented) d3.event.stopPropagation()
    }
  }
}
