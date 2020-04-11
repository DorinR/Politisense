import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { PARTY_COLORS } from '../../Components/Dashboard/Sidebar/RidingShape/partyColors'

export default class D3Chart {
  constructor (ridingCodes, shapeData, ridingMpData, handleOpenModal, selectedRiding, tag) {
    const ridingRepresentative = d3.map()
    const width = parseInt(d3.select('#map-wrapper').style('width'))
    const mapRatio = 0.75
    const height = Math.round(width * mapRatio)

    const projection = d3
      .geoOrthographic()
      .rotate([95, -45])
      .center([2.8, 17])
      .translate([width / 2, height / 2])
      .scale(width * 1.1)

    const path = d3.geoPath().projection(projection)

    const map = d3
      .select(tag)
      .attr('width', width)
      .attr('height', height)

    const g = map.append('g')

    const zoom = d3
      .zoom()
      .scaleExtent([0.9, 100])
      .translateExtent([
        [0, 0],
        [width, height]
      ])
      .on('zoom', zoomed)

    map.call(zoom).on('touchmove.zoom', null)
    d3.select('#zoomin').on('click', zoomin)
    d3.select('#zoomout').on('click', zoomout)
    d3.select('#reset').on('click', reset)

    g.append('g')
      .attr('class', 'ridings')
      .selectAll('path')
      .data(topojson.feature(shapeData, shapeData.objects.ridings).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('data-id', function (d) {
        return d.properties.ID
      })
      .attr('class', 'riding')
      .attr('fill', '#d8d8d8')
      .on('click', d => clicked(d, ridingCodes))

    const electedRepresentatives = ridingMpData.Election.Riding

    if (electedRepresentatives) {
      electedRepresentatives.forEach(riding => {
        let electedRepresentative = ''
        if (riding.PollsRep) {
          riding.Candidate.forEach(candidate => {
            if (candidate.E === 'Yes') {
              electedRepresentative = candidate.PE
            }
          })
        }
        ridingRepresentative.set(riding.Number - 1, electedRepresentative)
      })
    }

    d3.selectAll('.riding').attr('fill', function (d, i) {
      return (
        '#' +
        PARTY_COLORS[ridingRepresentative.get(d.properties.ID)].substring(3)
      )
    })

    function clicked (clickedShape, ridingData) {
      let representativeInfo = ''
      ridingData[1].forEach(riding => {
        if (riding.code === parseInt(clickedShape.properties.FEDUID)) {
          ridingData[0].forEach(representative => {
            if (representative.riding === riding.nameEnglish) {
              representativeInfo = representative
            }
          })
        }
      })
      selectRiding(clickedShape.properties.ID, representativeInfo, clickedShape)
      const bounds = path.bounds(clickedShape)
      const dx = bounds[1][0] - bounds[0][0]
      const dy = bounds[1][1] - bounds[0][1]
      const x = (bounds[0][0] + bounds[1][0]) / 2
      const y = (bounds[0][1] + bounds[1][1]) / 2
      const scale = Math.max(
        1,
        Math.min(100, 0.9 / Math.max(dx / width, dy / height))
      )
      const translate = [width / 2 - scale * x, height / 2 - scale * y]

      map
        .transition()
        .duration(500)
        .call(
          zoom.transform,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        )
    }

    function selectRiding (ridingId, representativeInfo, clickedShape) {
      const selectedRiding = d3.select(".riding[data-id='" + ridingId + "']")
      selectedRiding.node().parentNode.appendChild(selectedRiding.node())
      d3.select('.activenode').classed('activenode', false)
      selectedRiding.classed('activenode', true)
      handleOpenModal([representativeInfo, clickedShape])
    }

    function zoomin () {
      map
        .transition()
        .duration(500)
        .call(zoom.scaleBy, 2)
    }

    function zoomout () {
      map
        .transition()
        .duration(500)
        .call(zoom.scaleBy, 0.5)
    }

    function reset () {
      map
        .transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity)
      d3.select('.activenode').classed('activenode', false)
    }

    function zoomed () {
      g.attr('transform', d3.event.transform)
      const k = d3.event.transform.k

      if (k > 1) {
        d3.selectAll('.zoombutton-out').classed('disable', false)
        map.call(zoom).on('touchmove.zoom')
      } else {
        d3.selectAll('.zoombutton-out').classed('disable', true)
        map.call(zoom).on('touchmove.zoom', null)
      }

      if (k > 95) {
        d3.select('#zoomin').classed('disable', true)
      } else {
        d3.select('#zoomin').classed('disable', false)
      }
    }
  }
}
