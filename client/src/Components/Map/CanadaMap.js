import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { PARTY_COLORS } from '../../Components/Dashboard/Sidebar/RidingShape/partyColors'

export default class D3Chart {
  constructor(externalData, shapeData, ridingMpData) {
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
      .select('#map')
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

    Promise.all([
      d3.json(
        'https://gist.githubusercontent.com/Khalidbaraka/bf881712a903b5f059f9d9063a54e2ec/raw/b82e1f22995f0ead12010d5adeff35e1b3aba97f/test.json'
      ),
      d3.json(
        'https://gist.githubusercontent.com/DorinR/e20f4d42c2d78724cce0705a14e573d3/raw/a78ab5c4725a60a83507e08e060e27786e945d64/electionResult'
      )
    ]).then(function(data) {
      g.append('g')
        .attr('class', 'ridings')
        .selectAll('path')
        .data(topojson.feature(data[0], data[0].objects.ridings).features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('data-id', function(d) {
          return d.properties.ID
        })
        .attr('class', 'riding')
        .attr('fill', '#d8d8d8')
        .on('click', d => clicked(d, externalData))

      const electedRepresentatives = data[1].Election.Riding

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

      d3.selectAll('.riding').attr('fill', function(d, i) {
        return (
          '#' +
          PARTY_COLORS[ridingRepresentative.get(d.properties.ID)].substring(3)
        )
      })

      function clicked(clickedShape, ridingData) {
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
        selectRiding(clickedShape.properties.ID, representativeInfo)
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

      function displayRepresentativeInfo(m, politicianInfo) {
        const r = data[1].Election.Riding[m]
        // eslint-disable-next-line no-unused-vars
        let candidatecontent = ''
        let votesCounted = 0

        for (let i = 0; i < r.Candidate.length; i++) {
          votesCounted += r.Candidate[i].V
        }

        for (let i = 0; i < Math.min(5, r.Candidate.length); i++) {
          const entry = r.Candidate[i]
          let echeck = ''
          if (entry.E !== 'Yes') {
            echeck = ''
          } else {
            echeck =
              " <span class='echeck'><image class='' src='icons/check.svg' border='0'></span>"
          }

          let percnt = ''
          if (votesCounted > 0) {
            percnt = ((entry.V / votesCounted) * 100).toFixed(1)
          } else {
            percnt = 0
          }

          const candidateline =
            '<tr class="candidateline"><td class="candidate-name"><div class="party-marker marker' +
            entry.PE +
            '"></div>' +
            entry.FN +
            ' ' +
            entry.LN +
            ' <span>(' +
            entry.PE +
            ')</span>' +
            echeck +
            '</td><td class="candidate-votes">' +
            d3.format(',')(entry.V) +
            '</td><td class="candidate-percentage">' +
            percnt +
            '</td></tr>'

          candidatecontent += candidateline
        }

        const polticainRow =
          '<tr class="candidateline"><td class="candidate-name">' +
          politicianInfo.name +
          '</td> <td class="candidate-votes">' +
          politicianInfo.party +
          '</td><td class="candidate-percentage">' +
          politicianInfo.riding +
          '</td></tr>'

        const testing = d3.select('#testing')

        testing
          .selectAll('image')
          .data([])
          .remove()

        testing
          .append('image')
          .attr('xlink:href', politicianInfo.imageUrl)
          .attr('width', 200)
          .attr('height', 200)

        d3.select('#tooltip')
          .select('#value')
          .html(function() {
            return (
              "<div class='tooltiptop'>" +
              "<p class='ridingname'> Representative Info </p>" +
              "<table class='candidatebox'>" +
              "<tr class='candidateline'>" +
              "<th class='nametitle'>Name: </th>" +
              '<th>Party </th>' +
              '<th>Riding</th>' +
              '</tr>' +
              polticainRow +
              '</table>'
            )
          })
      }

      function selectRiding(ridingId, representativeInfo) {
        const selectedRiding = d3.select(".riding[data-id='" + ridingId + "']")
        selectedRiding.node().parentNode.appendChild(selectedRiding.node())
        d3.select('.activenode').classed('activenode', false)
        selectedRiding.classed('activenode', true)
        displayRepresentativeInfo(ridingId, representativeInfo)
        d3.selectAll('#tooltip').classed('hidden', false)
      }
    })

    function zoomin() {
      map
        .transition()
        .duration(500)
        .call(zoom.scaleBy, 2)
    }

    function zoomout() {
      map
        .transition()
        .duration(500)
        .call(zoom.scaleBy, 0.5)
    }

    function reset() {
      map
        .transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity)
      d3.select('.activenode').classed('activenode', false)
    }

    function zoomed() {
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
