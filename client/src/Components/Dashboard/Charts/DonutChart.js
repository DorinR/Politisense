import * as d3 from 'd3'
var freqData = [
  { State: 'Yes Votes', freq: { Liberal: 2000, Conservative: 1319, NDP: 249, People: 100, Green: 200, BQ: 100 } }
]
function createDonut (element, fData) {
  function segColor (c) { return { Liberal: '#D31F25', Conservative: '#1B447A', NDP: '#CD793E', People: '#243570', Green: '#439B3B', BQ: '#00A7EC' }[c] }
  function pieChart (pD) {
    var pC = {}
    var pieDim = { w: 200, h: 200 }
    pieDim.r = Math.min(pieDim.w, pieDim.h) / 2

    // create svg for pie chart.
    const piesvg = d3.select(element).append('svg')
      .attr('width', pieDim.w).attr('height', pieDim.h)
      .attr('text', 'Bipartisan Index')
      .append('g')
      .attr('transform', 'translate(' + pieDim.w / 2 + ',' + pieDim.h / 2 + ')')

    // create function to draw the arcs of the pie slices.
    const arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(70)

    // create a function to compute the pie slice angles.
    const pie = d3.pie().value(function (d) {
      return d.freq
    })

    // Draw the pie slices.
    piesvg.selectAll('path').data(pie(pD)).enter().append('path').attr('d', arc)
      .each(function (d) {
        this._current = d
      })
      .style('fill', function (d) {
        return segColor(d.data.type)
      })
      .on('mouseover', mouseover).on('mouseout', mouseout)

    // create function to update pie-chart. This will be used by histogram.
    pC.update = function (nD) {
      piesvg.selectAll('path').data(pie(nD)).transition().duration(500)
        .attrTween('d', arcTween)
    }

    // Utility function to be called on mouseover a pie slice.
    function mouseover (d) {
      d3.select(this)
        .attr('opacity', 0.7)
    }

    // Utility function to be called on mouseout a pie slice.
    function mouseout (d) {
      d3.select(this)
        .attr('opacity', 1)
    }

    // Animating the pie-slice requiring a custom function which specifies
    // how the intermediate paths should be drawn.
    function arcTween (a) {
      const i = d3.interpolate(this._current, a)
      this._current = i(0)
      return function (t) {
        return arc(i(t))
      }
    }

    return pC
  }

  // function to handle legend.
  function legend (lD){
    const leg = {}

    // create table for legend.
    const legend = d3.select(element).append('table').attr('class', 'legend')
      .style('margin-bottom', 76)
      .style('display', 'inline-block')
      .style('border-collapse', 'collapse')
      .style('border-spacing', 0)

    // create one row per segment.
    const tr = legend.append('tbody').selectAll('tr').data(lD).enter().append('tr')

    // create the first column for each segment.
    tr.append('td').append('svg').attr('width', '10').attr('height', '10').append('rect')
      .attr('width', '10').attr('height', '10')
      .attr('fill', function (d) {
        return segColor(d.type)
      })

    // create the second column for each segment.
    tr.append('td').text(function (d) {
      return d.type
    })
      .style('font-size', '10px')

    // create the third column for each segment.
    tr.append('td').attr('class', 'legendFreq')
      .text(function (d) {
        return d3.format(',')(d.freq)
      })
      .style('font-size', '10px')

    // create the fourth column for each segment.
    tr.append('td').attr('class', 'legendPerc')
      .text(function (d) {
        return getLegend(d, lD)
      })
      .style('font-size', '10px')

    // Utility function to be used to update the legend.
    leg.update = function (nD) {
      // update the data attached to the row elements.
      var l = legend.select('tbody').selectAll('tr').data(nD)

      // update the frequencies.
      l.select('.legendFreq').text(function (d) {
        return d3.format(',')(d.freq)
      })

      // update the percentage column.
      l.select('.legendPerc').text(function (d) {
        return getLegend(d, nD)
      })
    }

    function getLegend (d, aD) { // Utility function to compute percentage.
      return d3.format('%')(d.freq / d3.sum(aD.map(function (v) {
        return v.freq
      })))
    }

    return leg
  }

  const tF = ['Liberal', 'Conservative', 'NDP', 'People', 'Green', 'BQ'].map(function (d) {
    return { type: d, freq: d3.sum(fData.map(function (t) { return t.freq[d] })) }
  })
  pieChart(tF)
  legend(tF)
}

export default class DonutChart {
  constructor (element) {
    createDonut(element, freqData)
  }
}
