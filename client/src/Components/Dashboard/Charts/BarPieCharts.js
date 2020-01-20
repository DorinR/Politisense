import * as d3 from 'd3'

function dashboard (element, fData) {

  const barColor = '#84c5f1'

  fData.forEach(function (d) { d.total = d.freq.yes + d.freq.no + d.freq.abstain })

  function histoGram (fD) {
    const hG = {}
    const hGDim = { t: 60, r: 0, b: 30, l: 0 }
    hGDim.w = 500 - hGDim.l - hGDim.r
    hGDim.h = 350 - hGDim.t - hGDim.b

    // create svg for histogram.
    const hGsvg = d3.select(element).append('svg')
      .attr('width', hGDim.w + hGDim.l + hGDim.r)
      .attr('height', hGDim.h + hGDim.t + hGDim.b)
      .append('g')
      .attr('transform', 'translate(' + hGDim.l + ',' + hGDim.t + ')')

    // create function for x-axis mapping.
    const x = d3.scaleBand()
      .domain(fD.map(d => d[0]))
      .range([0, hGDim.w])
      .padding(0.4)

    // Add x-axis to the histogram svg.
    hGsvg.append('g').attr('class', 'x axis')
      .attr('transform', 'translate(0,' + hGDim.h + ')')
      .call(d3.axisBottom(x))

    // Create function for y-axis map.
    const y = d3.scaleLinear().range([hGDim.h, 0])
      .domain([0, d3.max(fD, function (d) { return d[1] })])

    // Create bars for histogram to contain rectangles and freq labels.
    const bars = hGsvg.selectAll('.bar').data(fD).enter()
      .append('g').attr('class', 'bar')

    // create the rectangles.
    bars.append('rect')
      .attr('x', function (d) { return x(d[0]) })
      .attr('y', function (d) { return y(d[1]) })
      .attr('width', x.bandwidth())
      .attr('height', function (d) { return hGDim.h - y(d[1]) })
      .attr('fill', barColor)
      .on('mouseover', mouseover)// mouseover is defined below.
      .on('mouseout', mouseout)// mouseout is defined below.

    // Create the frequency labels above the rectangles.
    bars.append('text').text(function (d) { return d3.format(',')(d[1]) })
      .attr('x', function (d) { return x(d[0]) + x.bandwidth() / 2 })
      .attr('y', function (d) { return y(d[1]) - 5 })
      .attr('text-anchor', 'middle')

    function mouseover (d) { // utility function to be called on mouseover.
      // filter for selected state.
      let st = fData.filter(function (s) { return s.State === d[0] })[0]
      let nD = d3.keys(st.freq).map(function (s) { return { type: s, freq: st.freq[s] } })

      // call update functions of pie-chart and legend.
      pC.update(nD)
      leg.update(nD)
    }

    function mouseout (d) { // utility function to be called on mouseout.
      // reset the pie-chart and legend.
      pC.update(tF)
      leg.update(tF)
    }

    // create function to update the bars. This will be used by pie-chart.
    hG.update = function (nD, color) {
      // update the domain of the y-axis map to reflect change in frequencies.
      y.domain([0, d3.max(nD, function (d) { return d[1] })])

      // Attach the new data to the bars.
      const bars = hGsvg.selectAll('.bar').data(nD)

      // transition the height and color of rectangles.
      bars.select('rect').transition().duration(500)
        .attr('y', function (d) { return y(d[1]) })
        .attr('height', function (d) { return hGDim.h - y(d[1]) })
        .attr('fill', color)

      // transition the frequency labels location and change value.
      bars.select('text').transition().duration(500)
        .text(function (d) { return d3.format(',')(d[1]) })
        .attr('y', function (d) { return y(d[1]) - 5 })
    }
    return hG
  }

  // function to handle pieChart.
  function pieChart (pD) {

    let pC = {}
    let pieDim = { w: 200, h: 300 }
    pieDim.r = Math.min(pieDim.w, pieDim.h) / 2

    // create svg for pie chart.
    const piesvg = d3.select(element).append('svg')
      .attr('width', pieDim.w).attr('height', pieDim.h)
      .append('g')
      .attr('transform', 'translate(' + pieDim.w / 2 + ',' + pieDim.h / 2 + ')')

    // create function to draw the arcs of the pie slices.
    const arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0)

    // create a function to compute the pie slice angles.
    const pie = d3.pie().value(function (d) { return d.freq })

    // Draw the pie slices.
    piesvg.selectAll('path').data(pie(pD)).enter().append('path').attr('d', arc)
      .each(function (d) { this._current = d })
      .style('fill', function (d) { return segColor(d.data.type) })
      .on('mouseover', mouseover).on('mouseout', mouseout)

    // create function to update pie-chart. This will be used by histogram.
    pC.update = function (nD) {
      piesvg.selectAll('path').data(pie(nD)).transition().duration(500)
        .attrTween('d', arcTween)
    }
    // Utility function to be called on mouseover a pie slice.
    function mouseover (d) {
      // call the update function of histogram with new data.
      hG.update(fData.map(function (v) {
        return [v.State, v.freq[d.data.type]]
      }), segColor(d.data.type))
    }
    // Utility function to be called on mouseout a pie slice.
    function mouseout (d) {
      // call the update function of histogram with all data.
      hG.update(fData.map(function (v) {
        return [v.State, v.total]
      }), barColor)
    }
    // Animating the pie-slice requiring a custom function which specifies
    // how the intermediate paths should be drawn.
    function arcTween (a) {
      const i = d3.interpolate(this._current, a)
      this._current = i(0)
      return function (t) { return arc(i(t)) }
    }
    return pC
  }

  // function to handle legend.
  function legend (lD) {
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
      .attr('fill', function (d) { return segColor(d.type) })

    // create the second column for each segment.
    tr.append('td').text(function (d) { return d.type })
      .style('font-size', '10px')

    // create the third column for each segment.
    tr.append('td').attr('class', 'legendFreq')
      .text(function (d) { return d3.format(',')(d.freq) })
      .style('font-size', '10px')

    // create the fourth column for each segment.
    tr.append('td').attr('class', 'legendPerc')
      .text(function (d) { return getLegend(d, lD) })
      .style('font-size', '10px')

    // Utility function to be used to update the legend.
    leg.update = function (nD) {
      // update the data attached to the row elements.
      let l = legend.select('tbody').selectAll('tr').data(nD)

      // update the frequencies.
      l.select('.legendFreq').text(function (d) { return d3.format(',')(d.freq) })

      // update the percentage column.
      l.select('.legendPerc').text(function (d) { return getLegend(d, nD) })
    }

    function getLegend (d, aD) { // Utility function to compute percentage.
      return d3.format('%')(d.freq / d3.sum(aD.map(function (v) { return v.freq })))
    }

    return leg
  }

  // calculate total frequency by segment for all state.
  let tF = ['yes', 'no', 'abstain'].map(function (d) {
    return { type: d, freq: d3.sum(fData.map(function (t) { return t.freq[d] })) }
  })

  // calculate total frequency by state for all segment.
  let sF = fData.map(function (d) { return [d.State, d.total] })

  let hG = histoGram(sF) // create the histogram.
  let pC = pieChart(tF) // create the pie-chart.
  let leg = legend(tF) // create the legend.
}
export default class BarPieChart {

  constructor (element,data,categories) {
    createData(categories,data).then(results => {
      dashboard(element, results)
    })

  }
}
 export async function createData(categories,data){
  let dataArray = []
  let yesCounter =0
  let noCounter=0
  let abtsainCounter =0
  let temp = {}

  categories.forEach(category => {
    data.forEach(bill=>{
      if(bill.billData.category.trim().localeCompare(category.toLowerCase().trim()) == 0){
        if(bill.voteRecord.yea == true){
          yesCounter++
        }else if(bill.voteRecord.yea == false){
          noCounter++
        }else{
          abtsainCounter++
        }
      }
    })
  temp = {State: category, freq: { yes: yesCounter, no: noCounter, abstain: abtsainCounter }}
  console.log(temp)
    dataArray.push(temp)
  })

   return dataArray
}

function segColor (c) { return { yes: '#43D0C4', no: '#de425b', abstain: '#f68155' }[c] }