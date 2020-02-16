import * as d3 from 'd3'
import React, { Component } from 'react'
var width = 400;
var arcSize = ( 5* width / 100);
var innerRadius = arcSize * 3;
const opacity = 0.8
const opacityHover = 1
const otherOpacityOnHover = 0.8
var data = [
    {value: 45, label: "Liberal", color: '#96d1c7'},
    {value: 33, label: "Conservative", color: '#79bac1'},
    {value: 66, label: "NDP", color: '#e4f9ff'},
    {value: 50, label: "BQ", color: '#ffe196'},
    {value: 90, label: "Green", color: '#ffba5a'},
    {value: 100, label: "People", color: '#feb72b'}
];


export default class D3GaugeChart extends Component {
    constructor (element) {
        super(element)

            // .style('pointerEvents', 'none')

        const svg = d3.select(element).append('svg')
            .attr('width', width)
            .attr('height', width)
            .attr('viewBox', `0 0 ${width} ${width}`)

        const arcs = data.map(function (obj, i) {
            return d3.arc()
                .innerRadius(i * arcSize + innerRadius)
                .outerRadius((i + 1) * arcSize - (width / 100) + innerRadius);
        });
        console.log(arcs)
        const arcsGrey = data.map(function (obj, i) {
            return d3.arc()
                .innerRadius(i * arcSize + (innerRadius + ((arcSize / 2) - 2)))
                .outerRadius((i + 1) * arcSize - ((arcSize / 2)) + (innerRadius));
        });

        const pieData = data.map(function (obj, i) {
            return [
                {value: obj.value * 0.75, arc: arcs[i], object: obj},
                {value: (100 - obj.value) * 0.75, arc: arcsGrey[i], object: obj},
                {value: 100 * 0.25, arc: arcs[i], object: obj}];
        });
        console.log(pieData)

        const pie = d3.pie()
            .sort(null)
            .value(function (d) {
            return d.value;
        })


        let g = svg.selectAll('g').data(pieData).enter()
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + width / 2 + ') rotate(180)');

        let gText = svg.selectAll('g.textClass').data([{}]).enter()
            .append('g')
            .classed('textClass', true)
            .attr('transform', 'translate(' + width / 2 + ',' + width / 2 + ') rotate(180)');

        g.selectAll('path').data(function (d) {
            return pie(d);
        }).enter().append('path')
            .attr('id', function (d, i) {
                if (i == 1) {
                    return "Text" + d.data.object.label
                }
            })
            .attr('d', function (d) {
                return d.data.arc(d);
            }).attr('fill', function (d, i) {
            return i == 0 ? d.data.object.color : i == 1 ? '#D3D3D3' : 'none';
        })


        const div = svg.append('div')
            .attr('class', 'tooltip')
            .style('opacity', 1)
            .style('testAlign', 'center')
            .style('width', '30px')
            .style('height', '28px')
            .style('padding', '2px')
            .style('font', 'sansSerif')
            .style('background', 'lightsteelblue')
            .style('border', '0px')
            .style('border-radius', '8px')
            .style('position', 'absolute')
            .style('transform', 'translate(' + width / 2 + ',' + width / 2 + ')')

        svg.selectAll('g').each(function (d, index) {
            let el = d3.select(this);
            let path = el.selectAll('path').each(function (r, i) {
                if (i === 1) {
                    let centroid = r.data.arc.centroid({
                        startAngle: r.startAngle + 0.05,
                        endAngle: r.startAngle + 0.001 + 0.05
                    });
                    let lableObj = r.data.object;
                    g.append('text')
                        .attr('font-size', ((5 * width) / 100))
                        .attr('dominant-baseline', 'central')
                        .append("textPath")
                        .attr("textLength", function (d, i) {
                            return 0;
                        })
                        // .attr("xlink:href", "#Text" + r.data.object.label)
                        // .attr("startOffset", '5')
                        // .attr("dy", '-3em')
                        // .text(lableObj.value + '%');
                }
                if (i === 0) {
                    let centroidText = r.data.arc.centroid({
                        startAngle: r.startAngle,
                        endAngle: r.startAngle
                    });
                    let lableObj = r.data.object;
                    gText.append('text')
                        .attr('font-size', ((5 * width) / 100))
                        .text(lableObj.label)
                        .attr('transform', "translate(" + (centroidText[0] - ((1.5 * width) / 100)) + "," + (centroidText[1] + ") rotate(" + (180) + ")"))
                        .attr('dominant-baseline', 'central')
                }
            }).on('mouseover', function (d) {
                d3.selectAll('path')
                    .style('opacity', otherOpacityOnHover)
                d3.select(this)
                    .style('opacity', opacityHover)

              g.append("text")
                  .attr('class', 'test')
                  .attr('transform', " rotate(" + (180) + ")")
                  .attr("text-anchor", "middle")
                    .attr('font-size', '2em')
                    .attr('y', 20)
                    .text(`${d.data.object.value} %`)
                  .style('display','block')
            })
                .on('mouseout', function (d) {
                    d3.selectAll('path')
                        .style('opacity', opacity)

                    d3.selectAll('.test').remove()

                })
                .on('touchstart', function (d) {
                    d3.selectAll('path')
                        .style('opacity', otherOpacityOnHover)
                    d3.select(this)
                        .style('opacity', opacityHover)

                    div.transition()
                        .duration(200)
                        .style('opacity', 0.9)
                })
        });
    }
}