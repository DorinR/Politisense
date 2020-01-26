import * as d3 from 'd3'
import {capitalizedName} from '../BillDialog'
let segColor  = ['#eb4d55', '#43D0C4' ]

export default class BudgetChartD3 {

    constructor (element,data) {
        console.log(data)

            let test = {

                labels: [
                    'Employee', 'Advertising', 'Gifts',
                    'Hospitality', 'Office', 'Printing', 'Travel'
                ],

                series: [data[0], data[1]]

            }

            let chartWidth = 800,
                barHeight = 30,
                groupHeight = barHeight * test.series.length,
                gapBetweenGroups = 15,
                spaceForLabels = 150,
                spaceForLegend = 200;

        // Zip the series data together (first values, second values, etc.)
            let zippedData = [];
            for (let i = 0; i < test.labels.length; i++) {
                for (let j = 0; j < test.series.length; j++) {
                    zippedData.push(test.series[j].values[i]);
                }
            }

        // Color scale
            let color = d3.scaleOrdinal(d3.schemeCategory10);
            let chartHeight = barHeight * zippedData.length + gapBetweenGroups * test.labels.length;
//d3.min(zippedData)
            let x = d3.scaleLinear()
                .domain([0, d3.max(zippedData)])
                .range([90, chartWidth]);

            let y = d3.scaleLinear()
                .range([chartHeight + gapBetweenGroups, 0]);

            let yAxis = d3.axisLeft(y).tickFormat('')
                .tickSize(0)


        // Specify the chart area and dimensions
            let chart = d3.select(element).append('svg')
                .attr("width", spaceForLabels + chartWidth + spaceForLegend)
                .attr("height", chartHeight);

        // Create bars
            let bar = chart.selectAll("g")
                .data(zippedData)
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / test.series.length))) + ")";
                });
            let prevIndex = 0
        // Create rectangles of the correct width
            bar.append("rect")
                .attr("fill", function (d, i) {
                    return segColor[i % test.series.length]
                })
                .attr("class", "bar")
                .attr("width", x)
                .attr("height", barHeight - 1)
                .on('mouseover', function (actual, i) {
                    d3.select(this).attr('fill', 'red')
                    prevIndex = i
                })
                .on('mouseleave', function (i, d) {
                    d3.select(this).attr('fill', (d, i) => {
                        console.log('the index is ' + i)
                        return segColor[prevIndex % test.series.length]
                    })
                })
        // Add text label in bar
            bar.append("text")
                .attr("x", function (d) {
                    return x(d) -66;
                })
                .attr("y", barHeight / 2)
                .style("fill", "white")
                .attr("dy", ".35em")
                .text(function (d) {
                    return d;
                });

        // Draw labels
            bar.append("text")
                .attr("class", "label")
                .attr("x", function (d) {
                    return -110;
                })
                .attr("y", groupHeight / 2)
                .attr("dy", ".35em")
                .text(function (d, i) {
                    if (i % test.series.length === 0)
                        return test.labels[Math.floor(i / test.series.length)];
                    else
                        return ""
                });

            chart.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
                .call(yAxis);

        // Draw legend
            let legendRectSize = 18,
                legendSpacing = 4;

            let legend = chart.selectAll('.legend')
                .data(test.series)
                .enter()
                .append('g')
                .attr('transform', function (d, i) {
                    let height = legendRectSize + legendSpacing;
                    let offset = -gapBetweenGroups / 2;
                    let horz = spaceForLabels + chartWidth + 40 - legendRectSize;
                    let vert = i * height - offset;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', function (d, i) {
                    return segColor[i];
                })
                .style('stroke', function (d, i) {
                    return 'black';
                });

            legend.append('text')
                .attr('class', 'legend')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .text(function (d) {
                    return capitalizedName(d.label);
                });


    }
}


