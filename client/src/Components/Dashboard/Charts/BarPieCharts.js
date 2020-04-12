import * as d3 from 'd3'

function dashboard(element, data) {
  const barColor = '#00bcd4'

  data.forEach(function (d) { return d.total })

  function histoGram(fD) {
    const hG = {}
    const histoGramDimensions = { top: 30, right: 5, back: 30, left: 20 }
    histoGramDimensions.width = 490 - histoGramDimensions.left - histoGramDimensions.right
    histoGramDimensions.height = 250 - histoGramDimensions.top - histoGramDimensions.back

    // create svg for histogram.
    const histoGramSvg = d3.select(element).append('svg')
      .attr('width', histoGramDimensions.width + histoGramDimensions.left + histoGramDimensions.right)
      .attr('height', histoGramDimensions.height + histoGramDimensions.top + histoGramDimensions.back)
      .append('g')
      .attr('transform', 'translate(' + histoGramDimensions.left + ',' + histoGramDimensions.top + ')')
      .attr('viewBox', `0 0 (${histoGramDimensions.width}/2) (${histoGramDimensions.height}/2) `)
    // create function for x-axis mapping.
    const x = d3.scaleBand()
      .domain(fD.map(d => d[0]))
      .range([0, histoGramDimensions.width])
      .padding(0.6)

    // Add x-axis to the histogram svg.
    histoGramSvg.append('g').attr('class', 'x axis')
      .attr('transform', 'translate(0,' + histoGramDimensions.height + ')')
      .call(d3.axisBottom(x))
      .style('font-size', '12px')

    // Create function for y-axis map.
    const y = d3.scaleLinear().range([histoGramDimensions.height, 0])
      .domain([0, d3.max(fD, function (d) { return d[1] })])

    // Create bars for histogram to contain rectangles and freq labels.
    const bars = histoGramSvg.selectAll('.bar').data(fD).enter()
      .append('g').attr('class', 'bar')

    // create the rectangles.
    bars.append('rect')
      .attr('x', function (d) { return x(d[0]) })
      .attr('y', function (d) { return y(d[1]) })
      .attr('width', x.bandwidth())
      .attr('height', (d) => { return histoGramDimensions.height - y(d[1]) })
      .attr('fill', barColor)
      .on('mouseover', (d) => mouseover(d))// mouseover is defined below.
      .on('mouseout', (d) => mouseout(d))// mouseout is defined below.

    // Create the frequency labels above the rectangles.
    bars.append('text').text((d) => { return d3.format(',')(d[1]) })
      .attr('x', function (d) { return x(d[0]) + x.bandwidth() / 2 })
      .attr('y', function (d) { return y(d[1]) - 5 })
      .attr('text-anchor', 'middle')

    const mouseover = (d) => {
      const state = data.filter((s) => { return s.State === d[0] })[0]
      const node = d3.keys(state.freq).map(function (s) { return { type: s, freq: state.freq[s] } })

      // call update functions of pie-chart and legend.
      interactivePieChart.update(node)
      table.update(node)
    }

    const mouseout = (d) => { // utility function to be called on mouseout.
      // reset the pie-chart and legend.
      interactivePieChart.update(totalFreqForAllStates)
      table.update(totalFreqForAllStates)
    }

    // create function to update the bars. This will be used by pie-chart.
    hG.update = (node, color) => {
      // update the domain of the y-axis map to reflect change in frequencies.
      y.domain([0, d3.max(node, function (d) { return d[1] })])

      // Attach the new data to the bars.
      const bars = histoGramSvg.selectAll('.bar').data(node)

      // transition the height and color of rectangles.
      bars.select('rect').transition().duration(500)
        .attr('y', function (d) { return y(d[1]) })
        .attr('height', function (d) { return histoGramDimensions.height - y(d[1]) })
        .attr('fill', color)

      // transition the frequency labels location and change value.
      bars.select('text').transition().duration(500)
        .text((d) => { return d3.format(',')(d[1]) })
        .attr('y', (d) => { return y(d[1]) - 5 })
    }
    return hG
  }

  // function to handle pieChart.
  function pieChart(pD) {
    const pieChartObj = {}
    const pieDimensions = { width: 200, height: 200 }
    pieDimensions.radius = Math.min(pieDimensions.width, pieDimensions.height) / 2

    const tranformYAxis = (pieDimensions.height / 2) - 10
    // create svg for pie chart.
    const piesvg = d3.select(element).append('svg')
      .attr('width', pieDimensions.width).attr('height', pieDimensions.height)
      .append('g')
      .attr('transform', 'translate(' + ((pieDimensions.width) / 2) + ',' + tranformYAxis + ')')

    // create function to draw the arcs of the pie slices.
    const arc = d3.arc().outerRadius(pieDimensions.radius - 10).innerRadius(0)

    // create a function to compute the pie slice angles.
    const pie = d3.pie().value((d) => { return d.freq })

    // Draw the pie slices.
    piesvg.selectAll('path').data(pie(pD)).enter().append('path').attr('d', arc)
      .each(function (d) { this._current = d })
      .style('fill', (d) => { return segColor(d.data.type) })
      .on('mouseover', (d) => mouseover(d))
      .on('mouseout', (d) => mouseout(d))

    // create function to update pie-chart. This will be used by histogram.
    pieChartObj.update = function (node) {
      piesvg.selectAll('path').data(pie(node)).transition().duration(500)
        .attrTween('d', arcTween)
    }
    // Utility function to be called on mouseover a pie slice.
    const mouseover = (d) => {
      // call the update function of histogram with new data.
      barChart.update(data.map((v) => {
        return [v.State, v.freq[d.data.type]]
      }), segColor(d.data.type))
    }
    // Utility function to be called on mouseout a pie slice.
    const mouseout = (d) => {
      // call the update function of histogram with all data.
      barChart.update(data.map(function (v) {
        return [v.State, v.total]
      }), barColor)
    }
    // Animating the pie-slice requiring a custom function which specifies
    // how the intermediate paths should be drawn.
    function arcTween(a) {
      const i = d3.interpolate(this._current, a)
      this._current = i(0)
      return (t) => { return arc(i(t)) }
    }
    return pieChartObj
  }

  // function to handle legend.
  function legend(data) {
    const leg = {}

    // create table for legend.
    const legend = d3.select(element)
      .append('table')
      .attr('width', 200)
      .attr('height', 200)
      .attr('class', 'legend')
      .style('margin-bottom', '76px')
      .style('display', 'inline-block')
      .style('border-collapse', 'collapse')
      .style('border-spacing', 0)
      .style('padding', '12px 12px 6px')
      .style('height', 'auto')
      .style('border-radius', '4px')
      .style('border', '1px solid #999')
      .style('box-sizing', 'border-box')
      .style('margin-left', '20')

    // create one row per segment.
    const tableRow = legend.append('tbody')
      .selectAll('tr').data(data).enter().append('tr')

    legend.select('tr').style('border-bottom', '2px solid grey')

    // create the first column for each segment.
    tableRow.append('td').append('svg')
      .attr('width', '10')
      .attr('height', '10')
      .append('rect')
      .attr('width', '10').attr('height', '10')
      .attr('fill', function (d) { return segColor(d.type) })

    // create the second column for each segment.
    tableRow.append('td').text(function (d) { return d.type })
      .style('font-size', '13px')
      .style('padding', '6px 5px')
      .style('vertical-align', 'bottom')

    // create the third column for each segment.
    tableRow.append('td').attr('class', 'legendFreq')
      .text((d) => { return d3.format(',')(d.freq) + ' bills' })
      .style('font-size', '12.5px')
      .style('align', 'right')
      .style('width', '70px')

    // create the fourth column for each segment.
    tableRow.append('td').attr('class', 'legendPerc')
      .text((d) => { return (getLegend(d, data)) + '%' })
      .style('font-size', '13px')
      .style('align', 'center')
      .style('width', '40px')

    // Utility function to be used to update the legend.
    leg.update = function (nD) {
      // update the data attached to the row elements.
      const l = legend.select('tbody').selectAll('tr').data(nD)

      // update the frequencies.
      l.select('.legendFreq').text((d) => { return d3.format(',')(d.freq) + ' bills' })
        .style('font-size', '12.5px')
        .style('align', 'right')
        .style('width', '70px')

      // update the percentage column.
      l.select('.legendPerc')
        .text((d) => { return getLegend(d, nD) + '%' })
        .style('align', 'right')
        .style('width', '40px')
    }

    function getLegend(d, aD) { // Utility function to compute percentage.
      let sum = 0
      aD.forEach(element => {
        sum = sum + element.freq
      })
      const fraction = ((d.freq / sum) * 100).toFixed(1)
      return fraction
    }

    return leg
  }

  // calculate total frequency by segment for all state.
  const totalFreqForAllStates = ['Succeeded', 'Failed'].map((d) => {
    return { type: d, freq: d3.sum(data.map(function (t) { return t.freq[d] })) }
  })

  // calculate total frequency by state for all segment.
  const totalFreqByStateForAllSegment = data.map(function (d) { return [d.State, d.total] })
  const barChart = histoGram(totalFreqByStateForAllSegment) // create the histogram.
  const interactivePieChart = pieChart(totalFreqForAllStates) // create the pie-chart.
  const table = legend(totalFreqForAllStates) // create the legend.
}
export default class BarPieChart {
  constructor(element, data, categories, body) {
    createData(categories, data).then(results => {
      dashboard(element, results, body)
    })
  }
}
export async function createData(categories, data) {
  const dataArray = []
  categories.forEach(category => {
    let passedBills = 0
    let failedBills = 0
    let totalBills = 0
    data.forEach(bill => {
      if (bill.billsClassified.category === (category.toLowerCase())) {
        totalBills++
        if (bill.voteRecord.yeas > bill.voteRecord.nays) {
          passedBills++
        } else {
          failedBills++
        }
      }
    })
    dataArray.push({ State: category, freq: { Succeeded: passedBills, Failed: failedBills }, total: totalBills })
  })
  return dataArray
}

function segColor(c) { return { Succeeded: '#34699a', Failed: '#c83660' }[c] }
