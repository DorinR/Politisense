import * as d3 from 'd3'

export default class D3Chart {
  constructor (element, data, categoryType) {
    const filteredDataByCategory = data.filter(element => element.billData.category === categoryType.toLowerCase())

    let yeaCounter = 0
    let nayCounter = 0

    if (filteredDataByCategory.length !== 0) {
      filteredDataByCategory.forEach(element => {
        if (element.voteRecord.yea === true) {
          yeaCounter++
        } else if (element.voteRecord.yea === false) {
          nayCounter++
        }
      })
    }
    const totalYesNoVotes = [
      { index: 0, name: 'Yeas', value: yeaCounter },
      { index: 1, name: 'Nays', value: nayCounter }
    ]

    const width = 200
    const height = 150
    const opacity = 0.8
    const radius = Math.min(width, height) / 2

    // The d3.pie() function takes in a dataset and creates handy data for us to generate a pie chart in the SVG.
    // It calculates the start angle and end angle for each wedge of the pie chart.
    // These start and end angles can then be used to create actual paths for the wedges in the SVG.
    // basically it takes the data and outputs an array for each element
    const createPie = d3
      .pie()
      .value(d => d.value)
      .sort(null)
    // creates a path for each element
    const createArc = d3
      .arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)

    const colors = ['#3282b8', '#26d06d']

    // adding svg element
    const svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', '0 0 150 200')
      .attr('class', 'pieChart')

    const g = svg.append('g')
      .attr('transform', 'translate(' + (width / 3) + ',' + (height / 2) + ')')

    const arcs = g.selectAll('arc')
      .data(createPie(totalYesNoVotes))
      .enter()
      .append('g')
      .attr('class', 'arc')

    arcs.append('path')
      .attr('fill', (d, i) => { return colors[i] })
      .attr('d', createArc)
      .style('opacity', opacity)

    const legend = d3.select(element)
      .append('div')
      .attr('class', 'legend')
      .style('margin-top', '-120px')
      .style('margin-left', '180px')

    const keys = legend.selectAll('.key')
      .data(totalYesNoVotes)
      .enter().append('div')
      .attr('class', 'key')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('margin-right', '-200px')

    keys.append('div')
      .attr('class', 'symbol')
      .style('height', '10px')
      .style('width', '10px')
      .style('margin', '5px 5px')
      .style('background-color', (d, i) => colors[i])

    keys.append('div')
      .attr('class', 'name')
      .text(d => `${d.name} (${d.value})`)

    keys.exit().remove()
  }
}
