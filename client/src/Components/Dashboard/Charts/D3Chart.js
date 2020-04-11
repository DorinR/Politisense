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

    const width = 150
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

    const svg = d3.select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('preserveAspectRatio', 'xMinYMin')
      .attr('viewBox', '0 0 400 150')

    const g = svg.append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')

    const arcs = g.selectAll('arc')
      .data(createPie(totalYesNoVotes))
      .enter()
      .append('g')
      .attr('class', 'arc')

    arcs.append('path')
      .attr('fill', (d, i) => { return colors[i] })
      .attr('d', createArc)
      .style('opacity', opacity)

    var legend = svg.append('svg')
      .attr('preserveAspectRatio', 'xMinYMin')
      .attr('class', 'legend')
      .selectAll('g')
      .data(totalYesNoVotes)
      .enter().append('g')
      .attr('transform', function (d, i) { return 'translate(' + (180) + ',' + (30 + (i * 20)) + ')' })

    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', function (d, i) { return colors[i] })

    legend.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .text(d => `${d.name} (${d.value})`)
  }
}
