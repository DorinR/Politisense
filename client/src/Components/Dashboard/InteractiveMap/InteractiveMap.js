import * as d3 from 'd3'
import * as topojson from 'topojson-client'

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 50, RIGHT: 10 }
const WIDTH = 960 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 700 - MARGIN.TOP - MARGIN.BOTTOM
const ZOOM = { MIN: 1, MAX: 300 }

export default class InteractiveMap {
  constructor(element, setHasZoomBeenChanged) {
    const vis = this
    vis.active = d3.select(null)

    vis.setZoomChangeStatus = setHasZoomBeenChanged
    vis.wasZoomChanged = false

    const projection = d3
      .geoOrthographic()
      .clipAngle(90)
      .rotate([98, -60])
      .scale(600)
      .translate([500, 200])
      .scale(730)
      .translate([WIDTH / 2, HEIGHT / 2])

    vis.zoom = d3
      .zoom()
      .scaleExtent([ZOOM.MIN, ZOOM.MAX])
      .on('zoom', vis.zoomed.bind(this))

    vis.path = d3.geoPath().projection(projection)

    vis.svg = d3
      .select(element)
      .append('svg')
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .style('fill', 'white')
      .on('click', vis.stopped, true)
      .attr('id', 'root_svg')

    vis.svg
      .append('rect')
      .attr('class', 'background')
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .on('click', vis.reset.bind(this))

    vis.g = vis.svg.append('g')

    vis.svg.call(vis.zoom)

    d3.json(
      'https://gist.githubusercontent.com/Khalidbaraka/bf881712a903b5f059f9d9063a54e2ec/raw/b82e1f22995f0ead12010d5adeff35e1b3aba97f/test.json'
    ).then(function(data) {
      vis.g
        .selectAll('path')
        .data(topojson.feature(data, data.objects.ridings).features)
        .enter()
        .append('path')
        .attr('data-id', function(d) {
          return d.properties.ID
        })
        .attr('d', vis.path)
        .attr('class', 'feature')
        .style('fill', 'grey')
        .on('click', vis.clicked)
        .attr('cursor', 'pointer')
        .on('mouseover', function(d, i) {
          d3.select(this)
            .style('fill', 'red')
            .style('opacity', 1)
        })
        .on('mouseout', function(d, i) {
          d3.select(this).style('fill', 'grey')
        })
    })

    this.clicked = this.clicked.bind(this)
    this.reset = this.reset.bind(this)
    this.zoomed = this.zoomed.bind(this)
  }

  clicked(clickEvent) {
    const vis = this
    vis.setZoomChangeStatus(true)
    vis.wasZoomChanged = true
    const clickedRiding = d3
      .selectAll(`[data-id="${clickEvent.properties.ID}"]`)
      .classed('active', true)
    if (this.active.node() === clickedRiding.node()) {
      return this.reset()
    }
    this.active.classed('active', false)
    this.active = d3
      .selectAll(`[data-id="${clickEvent.properties.ID}"]`)
      .classed('active', true)

    const bounds = this.path.bounds(clickEvent)
    const dx = bounds[1][0] - bounds[0][0]
    const dy = bounds[1][1] - bounds[0][1]
    const x = (bounds[0][0] + bounds[1][0]) / 2
    const y = (bounds[0][1] + bounds[1][1]) / 2
    const scale = Math.max(
      1,
      Math.min(ZOOM.MAX, 0.9 / Math.max(dx / WIDTH, dy / HEIGHT))
    )
    const translate = [WIDTH / 2 - scale * x, HEIGHT / 2 - scale * y]

    this.svg
      .transition()
      .duration(750)
      .call(
        this.zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      )
  }

  reset() {
    const vis = this
    setTimeout(() => {
      vis.setZoomChangeStatus(false)
      vis.wasZoomChanged = false
    }, 1000)
    const svg = d3.select('#root_svg')
    this.active.classed('active', false)
    this.active = d3.select(null)

    svg
      .transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity)
  }

  zoomed() {
    const vis = this
    if (!vis.wasZoomChanged) {
      vis.setZoomChangeStatus(true)
    }
    d3.select('g').style('stroke-width', 1.5 / d3.event.transform.k + 'px')
    d3.select('g').attr('transform', d3.event.transform)
  }

  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation()
  }
}
