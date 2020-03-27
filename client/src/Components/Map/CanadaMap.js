import * as d3 from 'd3'
import * as topojson from 'topojson-client'

export default class D3Chart {
  constructor (element, externalData) {
    let data1
    let call
    let callmade = 'nocallmade'
    const winnerById = d3.map()
    const colours = d3
      .scaleOrdinal()
      .domain([
        'CON',
        'NDP',
        'LIB',
        'GRN',
        'BQ',
        'PPC',
        'IND',
        'CONlead',
        'NDPlead',
        'LIBlead',
        'GRNlead',
        'BQlead',
        'PPClead',
        'INDlead',
        'Others',
        'noresults'
      ])
      .range([
        '#335A8C',
        '#f7900e',
        '#da3037',
        '#4da659',
        '#2fa4bc',
        '#564288',
        '#999999',
        '#97AAC4',
        '#FBC684',
        '#EC9599',
        '#A4D1AA',
        '#95D1DD',
        '#A99EC2',
        '#CACACA',
        '#999999',
        '#dddddd',
        '#999999',
        '#999999',
        '#999999',
        '#999999',
        '#999999',
        '#999999',
        '#999999',
        '#999999',
        '#999999',
        '#999999'
      ])

    const ua = window.navigator.userAgent
    const msie = ua.indexOf('MSIE ')
    const trident = ua.indexOf('Trident/')
    const edge = ua.indexOf('Edge/')

    const width = parseInt(d3.select('#map-wrapper').style('width'))
    const mapRatio = 0.75
    const height = Math.round(width * mapRatio)

    const projection = d3
      .geoOrthographic()
      .rotate([95, -45])
      .center([2.8, 17])
      .translate([width / 2, height / 2])
      .scale(width * 1.21)
    const path = d3.geoPath().projection(projection)

    const map = d3
      .select('#map')
      .attr('width', width)
      .attr('height', height)

    const g = map
      .append('g')
      .attr('width', width)
      .attr('height', height)

    Promise.all([
      d3.json(
        'https://gist.githubusercontent.com/Khalidbaraka/bf881712a903b5f059f9d9063a54e2ec/raw/b82e1f22995f0ead12010d5adeff35e1b3aba97f/test.json'
      ),
      d3.json(
        'https://gist.githubusercontent.com/Khalidbaraka/1bc8de5575e0ec9afd39e77c183cdb76/raw/466dae553f273727592551233fbe4a7a5b48038e/testing.json'
      )
    ]).then(function (data) {
      g.append('g')
        .attr('class', 'ridings')
        .selectAll('path')
        .data(topojson.feature(data[0], data[0].objects.ridings).features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('data-id', function (d) {
          return d.properties.ID
        })
        .attr('class', 'riding')
        .attr('fill', '#d8d8d8')
        .on('click', d => clicked(d, externalData))

      function clicked (d, externalData) {
        let politicanInfo = ''
        externalData[1].forEach(element => {
          if (element.code === parseInt(d.properties.FEDUID)) {
            externalData[0].forEach(politician => {
              if (politician.riding === element.nameEnglish) {
                politicanInfo = politician
              }
            })
          }
        })
        remoateactivate(d.properties.ID, politicanInfo)
        const bounds = path.bounds(d)
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

      d3.select('#closebutton').on('click', function (d) {
        d3.selectAll('#tooltip').classed('hidden', true)
        d3.select('.activenode').classed('activenode', false)
      })

      data1 = data[1].Election.Riding

      call = data[1].Election.Call

      if (call !== undefined && call != null) {
        call = data[1].Election.Call.MessageEng
      } else {
        call = 'nocallyet'
      }

      let dataTotals = data[1].Election.Leading.Party

      dataTotals = dataTotals.sort(function (a, b) {
        return a.Elected + a.Leading < b.Elected + b.Leading
          ? 1
          : b.Elected + b.Leading < a.Elected + a.Leading
            ? -1
            : 0
      })

      let data2 = []

      const partyTotal = d3
        .nest()
        .rollup(function (v) {
          return d3.sum(v, function (d) {
            return d.Elected + d.Leading
          })
        })
        .object(dataTotals)

      const partyElected = d3
        .nest()
        .key(function (d) {
          return d.Name
        })
        .rollup(function (v) {
          return d3.sum(v, function (d) {
            return d.Elected
          })
        })
        .entries(dataTotals)

      const partyLeading = d3
        .nest()
        .key(function (d) {
          return d.Name + 'lead'
        })
        .rollup(function (v) {
          return d3.sum(v, function (d) {
            return d.Leading
          })
        })
        .entries(dataTotals)

      const leadingElected = partyElected.reduce(function (arr, v, i) {
        return arr.concat(v, partyLeading[i])
      }, [])

      leadingElected.push({ key: 'noresults', value: 338 - partyTotal })

      leadingElected.forEach(function (d, i) {
        data2 = data2.concat(
          Array(d.value + 1)
            .join()
            .split('')
            .map(function () {
              return { partyName: d.key }
            })
        )
      })

      if (call !== 'nocallyet' && callmade === 'nocallmade') {
        callmade = 'callmade'

        d3.select('#checkmark').html(
          "<svg xmlns='https://www.w3.org/2000/svg' width='18' height='14' viewBox='0 0 18 14'><path d='M5.8,10.9L1.6,6.7L0.2,8.1l5.6,5.6l12-12l-1.4-1.4L5.8,10.9z'/></svg>"
        )
      }
      // colors for each riding
      if (data[1]) {
        data1.forEach(function (d) {
          let winner = ''
          if (d.PollsRep > 0) {
            for (let i = 0; i < d.Candidate.length; i++) {
              if (d.Candidate[i].E === 'Yes') {
                winner = d.Candidate[i].PE
              }
            }

            if (
              winner === '' &&
              d.Candidate[0].V - d.Candidate[1].V > 0 &&
              (d.Candidate[0].PE === 'CON' ||
                d.Candidate[0].PE === 'LIB' ||
                d.Candidate[0].PE === 'NDP' ||
                d.Candidate[0].PE === 'GRN' ||
                d.Candidate[0].PE === 'BQ' ||
                d.Candidate[0].PE === 'PPC' ||
                d.Candidate[0].PE === 'IND')
            ) {
              winner = d.Candidate[0].PE + 'lead'
            } else if (winner === '') {
              winner = 'noresults'
            }
          } else {
            winner = 'noresults'
          }
          winnerById.set(d.Number - 1, winner)
        })
      }

      d3.selectAll('.riding').attr('fill', function (d, i) {
        return colours(winnerById.get(d.properties.ID))
      })

      function tooltipcontent (m, politicianInfo) {
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
          .html(function () {
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
        // })
      }

      function remoateactivate (ridingid, politicianInfo) {
        const a = d3.select(".riding[data-id='" + ridingid + "']")
        a.node().parentNode.appendChild(a.node())
        d3.select('.activenode').classed('activenode', false)
        a.classed('activenode', true)
        tooltipcontent(ridingid, politicianInfo)
        d3.selectAll('#tooltip').classed('hidden', false)
      }
    })

    g.append('g').attr('class', 'labels')

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-79.34, 43.72])[0]
      })
      .attr('y', function (d) {
        return projection([-79.34, 43.72])[1]
      })
      .text('Toronto')

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-73.56, 45.5])[0]
      })
      .attr('y', function (d) {
        return projection([-73.56, 45.5])[1]
      })
      .text('Montreal')

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-123.12, 49.28])[0]
      })
      .attr('y', function (d) {
        return projection([-123.12, 49.28])[1]
      })
      .text('Vancouver')

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-113.49, 53.54])[0]
      })
      .attr('y', function (d) {
        return projection([-113.49, 53.54])[1]
      })
      .text('Edmonton')

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-83, 42.29])[0]
      })
      .attr('y', function (d) {
        return projection([-83, 42.29])[1]
      })
      .text('Windsor')

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-97.13, 49.89])[0]
      })
      .attr('y', function (d) {
        return projection([-97.13, 49.89])[1]
      })
      .text('Winnipeg')

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-71.2, 46.81])[0]
      })
      .attr('y', function (d) {
        return projection([-71.2, 46.81])[1]
      })
      .text('Quebec City')

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-63.57, 44.64])[0]
      })
      .attr('y', function (d) {
        return projection([-63.5, 44.64])[1]
      })
      .text('Halifax')

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-52.71, 47.56])[0]
      })
      .attr('y', function (d) {
        return projection([-52.71, 47.56])[1]
      })
      .text("St. John's")

    d3.select('.labels')
      .append('text')
      .attr('class', 'placement-text')
      .attr('x', function (d) {
        return projection([-63.13, 46.23])[0]
      })
      .attr('y', function (d) {
        return projection([-63.13, 46.23])[1]
      })
      .text('Charlottetown')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-79.38, 43.7])[0]
      })
      .attr('y', function (d) {
        return projection([-79.38, 43.7])[1]
      })
      .text('Toronto')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-73.63, 45.49])[0]
      })
      .attr('y', function (d) {
        return projection([-73.63, 45.49])[1]
      })
      .text('Montreal')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-123.12, 49.22])[0]
      })
      .attr('y', function (d) {
        return projection([-123.12, 49.22])[1]
      })
      .text('Vancouver')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-114.07, 51.04])[0]
      })
      .attr('y', function (d) {
        return projection([-114.07, 51.04])[1]
      })
      .text('Calgary')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-113.49, 53.52])[0]
      })
      .attr('y', function (d) {
        return projection([-113.49, 53.52])[1]
      })
      .text('Edmonton')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-75.69, 45.4])[0]
      })
      .attr('y', function (d) {
        return projection([-75.69, 45.4])[1]
      })
      .text('Ottawa')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-97.14, 49.89])[0]
      })
      .attr('y', function (d) {
        return projection([-97.14, 49.89])[1]
      })
      .text('Winnipeg')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-71.33, 46.79])[0]
      })
      .attr('y', function (d) {
        return projection([-71.33, 46.79])[1]
      })
      .text('Quebec City')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-104.62, 50.41])[0]
      })
      .attr('y', function (d) {
        return projection([-104.62, 50.41])[1]
      })
      .text('Regina')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-106.67, 52.13])[0]
      })
      .attr('y', function (d) {
        return projection([-106.67, 52.13])[1]
      })
      .text('Saskatoon')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-123.36, 48.41])[0]
      })
      .attr('y', function (d) {
        return projection([-123.36, 48.41])[1]
      })
      .text('Victoria')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background first-tier')
      .attr('x', function (d) {
        return projection([-63.6, 44.63])[0]
      })
      .attr('y', function (d) {
        return projection([-63.6, 44.63])[1]
      })
      .text('Halifax')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-52.71, 47.56])[0]
      })
      .attr('y', function (d) {
        return projection([-52.71, 47.56])[1]
      })
      .text("St. John's")

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-66.06, 45.27])[0]
      })
      .attr('y', function (d) {
        return projection([-66.06, 45.27])[1]
      })
      .text('St. John')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-64.78, 46.09])[0]
      })
      .attr('y', function (d) {
        return projection([-64.78, 46.09])[1]
      })
      .text('Moncton')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-63.13, 46.24])[0]
      })
      .attr('y', function (d) {
        return projection([-63.13, 46.24])[1]
      })
      .text('Charlottetown')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-79.85, 43.24])[0]
      })
      .attr('y', function (d) {
        return projection([-79.85, 43.24])[1]
      })
      .text('Hamilton')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-80.4925, 43.45])[0]
      })
      .attr('y', function (d) {
        return projection([-80.4925, 43.45])[1]
      })
      .text('Waterloo')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-81.24, 42.98])[0]
      })
      .attr('y', function (d) {
        return projection([-81.24, 42.98])[1]
      })
      .text('London')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-83, 42.27])[0]
      })
      .attr('y', function (d) {
        return projection([-83, 42.27])[1]
      })
      .text('Windsor')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-79.76, 43.69])[0]
      })
      .attr('y', function (d) {
        return projection([-79.76, 43.69])[1]
      })
      .text('Brampton')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-79.64, 43.58])[0]
      })
      .attr('y', function (d) {
        return projection([-79.64, 43.58])[1]
      })
      .text('Mississauga')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-78.86, 43.87])[0]
      })
      .attr('y', function (d) {
        return projection([-78.86, 43.87])[1]
      })
      .text('Oshawa')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-79.24, 43.16])[0]
      })
      .attr('y', function (d) {
        return projection([-79.24, 43.16])[1]
      })
      .text('St. Catharines')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-80.24, 43.52])[0]
      })
      .attr('y', function (d) {
        return projection([-80.24, 43.52])[1]
      })
      .text('Guelph')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-71.9, 45.38])[0]
      })
      .attr('y', function (d) {
        return projection([-71.9, 45.38])[1]
      })
      .text('Sherbrooke')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label city-label-background second-tier')
      .attr('x', function (d) {
        return projection([-76.46, 44.21])[0]
      })
      .attr('y', function (d) {
        return projection([-76.46, 44.21])[1]
      })
      .text('Kingston')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-79.38, 43.7])[0]
      })
      .attr('y', function (d) {
        return projection([-79.38, 43.7])[1]
      })
      .text('Toronto')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-73.63, 45.49])[0]
      })
      .attr('y', function (d) {
        return projection([-73.63, 45.49])[1]
      })
      .text('Montreal')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-123.12, 49.22])[0]
      })
      .attr('y', function (d) {
        return projection([-123.12, 49.22])[1]
      })
      .text('Vancouver')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-114.07, 51.04])[0]
      })
      .attr('y', function (d) {
        return projection([-114.07, 51.04])[1]
      })
      .text('Calgary')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-113.49, 53.52])[0]
      })
      .attr('y', function (d) {
        return projection([-113.49, 53.52])[1]
      })
      .text('Edmonton')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-75.69, 45.4])[0]
      })
      .attr('y', function (d) {
        return projection([-75.69, 45.4])[1]
      })
      .text('Ottawa')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-97.14, 49.89])[0]
      })
      .attr('y', function (d) {
        return projection([-97.14, 49.89])[1]
      })
      .text('Winnipeg')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-71.33, 46.79])[0]
      })
      .attr('y', function (d) {
        return projection([-71.33, 46.79])[1]
      })
      .text('Quebec City')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-104.62, 50.41])[0]
      })
      .attr('y', function (d) {
        return projection([-104.62, 50.41])[1]
      })
      .text('Regina')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-106.67, 52.13])[0]
      })
      .attr('y', function (d) {
        return projection([-106.67, 52.13])[1]
      })
      .text('Saskatoon')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-123.36, 48.41])[0]
      })
      .attr('y', function (d) {
        return projection([-123.36, 48.41])[1]
      })
      .text('Victoria')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label first-tier')
      .attr('x', function (d) {
        return projection([-63.6, 44.63])[0]
      })
      .attr('y', function (d) {
        return projection([-63.6, 44.63])[1]
      })
      .text('Halifax')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-52.71, 47.56])[0]
      })
      .attr('y', function (d) {
        return projection([-52.71, 47.56])[1]
      })
      .text("St. John's")

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-66.06, 45.27])[0]
      })
      .attr('y', function (d) {
        return projection([-66.06, 45.27])[1]
      })
      .text('St. John')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-64.78, 46.09])[0]
      })
      .attr('y', function (d) {
        return projection([-64.78, 46.09])[1]
      })
      .text('Moncton')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-63.13, 46.24])[0]
      })
      .attr('y', function (d) {
        return projection([-63.13, 46.24])[1]
      })
      .text('Charlottetown')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-79.85, 43.24])[0]
      })
      .attr('y', function (d) {
        return projection([-79.85, 43.24])[1]
      })
      .text('Hamilton')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-80.4925, 43.45])[0]
      })
      .attr('y', function (d) {
        return projection([-80.4925, 43.45])[1]
      })
      .text('Waterloo')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-81.24, 42.98])[0]
      })
      .attr('y', function (d) {
        return projection([-81.24, 42.98])[1]
      })
      .text('London')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-83, 42.27])[0]
      })
      .attr('y', function (d) {
        return projection([-83, 42.27])[1]
      })
      .text('Windsor')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-79.76, 43.69])[0]
      })
      .attr('y', function (d) {
        return projection([-79.76, 43.69])[1]
      })
      .text('Brampton')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-79.64, 43.58])[0]
      })
      .attr('y', function (d) {
        return projection([-79.64, 43.58])[1]
      })
      .text('Mississauga')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-78.86, 43.87])[0]
      })
      .attr('y', function (d) {
        return projection([-78.86, 43.87])[1]
      })
      .text('Oshawa')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-79.24, 43.16])[0]
      })
      .attr('y', function (d) {
        return projection([-79.24, 43.16])[1]
      })
      .text('St. Catharines')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-80.24, 43.52])[0]
      })
      .attr('y', function (d) {
        return projection([-80.24, 43.52])[1]
      })
      .text('Guelph')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-71.9, 45.38])[0]
      })
      .attr('y', function (d) {
        return projection([-71.9, 45.38])[1]
      })
      .text('Sherbrooke')

    d3.select('.labels')
      .append('text')
      .attr('class', 'city-label second-tier')
      .attr('x', function (d) {
        return projection([-76.46, 44.21])[0]
      })
      .attr('y', function (d) {
        return projection([-76.46, 44.21])[1]
      })
      .text('Kingston')

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
      d3.selectAll('#tooltip').classed('hidden', true)
      d3.select('.activenode').classed('activenode', false)
    }

    function zoomed () {
      g.attr('transform', d3.event.transform)
      const k = d3.event.transform.k

      if (msie > 0 || trident > 0 || edge > 0) {
        // If Internet Explorer, return version number
        d3.selectAll('.riding').style('stroke-width', 1 / k + 'px')
      }

      d3.selectAll('.city-label').style('font-size', (1 / k) * 13 + 'px')
      d3.selectAll('.city-label-background').style(
        'stroke-width',
        (1 / k) * 4 + 'px'
      )

      if (k >= 4 && k <= 95) {
        d3.selectAll('.first-tier').style('display', 'block')
      } else {
        d3.selectAll('.first-tier').style('display', 'none')
      }

      if (k >= 30 && k <= 95) {
        d3.selectAll('.second-tier').style('display', 'block')
      } else {
        d3.selectAll('.second-tier').style('display', 'none')
      }

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

    document.addEventListener('touchstart', function () {}, true)
  }
}
