import * as d3 from 'd3'
import { capitalizedName } from '../BillDialog'

const segColor = ['#eb4d55', '#43D0C4']
export default class BudgetChartD3 {
  constructor (element, data) {
    const budgetData = {
      labels: [
        'Employee', 'Advertising', 'Gifts',
        'Hospitality', 'Office', 'Printing', 'Travel'
      ],

      series: [data[0], data[1]]

    }

    const chartWidth = 800
    const barHeight = 30
    const groupHeight = barHeight * budgetData.series.length
    const gapBetweenGroups = 15
    const spaceForLabels = 150
    const spaceForLegend = 200

    // Zip the series data together (first values, second values, etc.)
    const zippedData = []
    for (let i = 0; i < budgetData.labels.length; i++) {
      for (let j = 0; j < budgetData.series.length; j++) {
        zippedData.push(budgetData.series[j].values[i])
      }
    }

    const chartHeight = barHeight * zippedData.length + gapBetweenGroups * budgetData.labels.length
    const x = d3.scaleLinear()
      .domain([0, d3.max(zippedData)])
      .range([90, chartWidth])

    const y = d3.scaleLinear()
      .range([chartHeight + gapBetweenGroups, 0])

    const yAxis = d3.axisLeft(y).tickFormat('')
      .tickSize(0)

    // Specify the chart area and dimensions
    const chart = d3.select(element).append('svg')
      .attr('width', spaceForLabels + chartWidth + spaceForLegend)
      .attr('height', chartHeight)

    // Create bars
    const bar = chart.selectAll('g')
      .data(zippedData)
      .enter().append('g')
      .attr('transform', function (d, i) {
        return 'translate(' + spaceForLabels + ',' + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / budgetData.series.length))) + ')'
      })
    let prevIndex = 0
    // Create rectangles of the correct width
    bar.append('rect')
      .attr('fill', function (d, i) {
        return segColor[i % budgetData.series.length]
      })
      .attr('class', 'bar')
      .attr('width', x)
      .attr('height', barHeight - 1)
      .on('mouseover', function (actual, i) {
        d3.select(this).attr('fill', 'red')
        prevIndex = i
      })
      .on('mouseleave', function (i, d) {
        d3.select(this).attr('fill', (d, i) => {
          console.log('the index is ' + i)
          return segColor[prevIndex % budgetData.series.length]
        })
      })
    // Add text label in bar
    bar.append('text')
      .attr('x', function (d) {
        return x(d) - 66
      })
      .attr('y', barHeight / 2)
      .style('fill', 'white')
      .attr('dy', '.35em')
      .text(function (d) {
        return d
      })

    // Draw labels
    bar.append('text')
      .attr('class', 'label')
      .attr('x', function (d) {
        return -110
      })
      .attr('y', groupHeight / 2)
      .attr('dy', '.35em')
      .text(function (d, i) {
        if (i % budgetData.series.length === 0) { return budgetData.labels[Math.floor(i / budgetData.series.length)] } else { return '' }
      })

    chart.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + spaceForLabels + ', ' + -gapBetweenGroups / 2 + ')')
      .call(yAxis)

    // Draw legend
    const legendRectSize = 18
    const legendSpacing = 4

    const legend = chart.selectAll('.legend')
      .data(budgetData.series)
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
        const height = legendRectSize + legendSpacing
        const offset = -gapBetweenGroups / 2
        const horz = spaceForLabels + chartWidth + 40 - legendRectSize
        const vert = i * height - offset
        return 'translate(' + horz + ',' + vert + ')'
      })

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', function (d, i) {
        return segColor[i]
      })
      .style('stroke', function (d, i) {
        return 'black'
      })

    legend.append('text')
      .attr('class', 'legend')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function (d) {
        return capitalizedName(d.label)
      })
  }
}
