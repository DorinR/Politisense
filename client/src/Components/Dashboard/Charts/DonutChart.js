import * as d3 from 'd3'
import DescriptionIcon from '@material-ui/icons/Description';
import React from "react";

function segColor (c) { return { Liberal: '#D31F25', Conservative: '#1B447A', NDP: '#CD793E', People: '#243570', Green: '#439B3B', BQ: '#00A7EC' }[c] }

function createDonut (element, fData) {

  function pieChart (pD) {
    const pC = {}
    const pieDim = { w: 250, h: 250 }

    pieDim.r = Math.min(pieDim.w, pieDim.h) / 2

    // create svg for pie chart.
    const piesvg = d3.select(element).append('svg')
      .attr('width', pieDim.w).attr('height', pieDim.h)
      .attr('text', 'Bipartisan Index')
      .append('g')
      .attr('transform', 'translate(' + pieDim.w / 2 + ',' + pieDim.h / 2 + ')')

    // create function to draw the arcs of the pie slices.
    const arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(pieDim.r * 0.8)

    // var arc = d3.svg.arc()
    //     .innerRadius(0)
    //     .outerRadius(100);

    const arcOver = d3.arc()
        .innerRadius(pieDim.r * 0.8)
        .outerRadius(pieDim.r - 10 +10);

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
      .on('mouseover', mouseover)
        .on('mouseout', mouseout)

    // create function to update pie-chart. This will be used by histogram.
    pC.update = function (nD) {
      piesvg.selectAll('path').data(pie(nD)).transition().duration(500)
        .attrTween('d', arcTween)
    }

    // Utility function to be called on mouseover a pie slice.
    function mouseover (d) {
      d3.select(this)
        .attr('opacity', 0.7)
          .transition()
          .duration(1000)
          .attr("d", arcOver);

    }
    // Utility function to be called on mouseout a pie slice.
    function mouseout (d) {
      d3.select(this)
        .attr('opacity', 1)
          .transition()
          .duration(1000)
          .attr("d", arc);
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
  function legend (lD) {
    const leg = {}

    // create table for legend.
    const legend = d3.select(element).append('table')
        .attr('class', 'legend')
      .style('margin-bottom', 76)
      .style('display', 'inline-block')
      .style('border-collapse', 'collapse')
      .style('border-spacing', 0)
      .style('margin-top', '0px')
      .style('margin-left', '0px')
    // create one row per segment.
    const tr = legend.append('tbody').selectAll('tr').data(lD).enter().append('tr')

    // create the first column for each segment.
    tr.append('td')
       .append('svg')
        .attr('width', '25')
        .attr('height', '25')
        .append('image')
        .attr("xlink:href", (d,i)=>{
          switch(d.type){
            case "Liberal":
              return "https://admin-panel-dev.s3.amazonaws.com/6852c3dd16724bfebeb98e8d56b33adc-party-lpc.png"
              break
            case "Conservative" :
              return "https://admin-panel-dev.s3.amazonaws.com/f6adc6c1d0614bf98d66fa59dddd5ad2-party-cpc.jpg"
            break
            case "NDP":
              return "https://admin-panel-dev.s3.amazonaws.com/898912c0d7c64657a29cc9eb86c8a021-party-ndp.jpg"
            break
            case "People":
              return "https://admin-panel-dev.s3.amazonaws.com/8513f4e985ff411885a915479abd9e88-party-ppc-small.jpg"
            break
            case "Green":
              return "https://admin-panel-dev.s3.amazonaws.com/0778385402c64eec8129ecc36edff0ea-party-green.png"
            break
            case "BQ":
              return "https://admin-panel-dev.s3.amazonaws.com/5c7855ca2c6345fea26b2b9dfb662b45-party-bq.jpg"
              break
            default:
              return "https://admin-panel-dev.s3.amazonaws.com/5c7855ca2c6345fea26b2b9dfb662b45-party-bq.jpg"
          }

        } )
        .attr("x", 0.8)
        .attr("y", 0.8)
        .attr("width", 25)
        .attr("height", 25)



    // create the second column for each segment.
    tr.append('td').text(function (d) {
      return d.type
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
      const l = legend.select('tbody').selectAll('tr').data(nD)

      // update the frequencies.
      l.select('.legendFreq').text(function (d) {
        return d3.format(',')(d.freq)
      })

      // update the percentage column.
      l.select('.legendPerc').text(function (d) {
        return getLegend(d, nD)
      })
    }

  }
  const tF = ['Liberal', 'Conservative', 'NDP', 'People', 'Green', 'BQ'].map(function (d) {
    return { type: d, freq: d3.sum(fData.map(function (t) { return t.freq[d] })) }
  })
  pieChart(tF)
  legend(tF)
}

export default class DonutChart {
  constructor (element, data) {
    const freqData = [
      { State: 'Yes Votes', freq: data[0] }]
    createDonut(element, freqData)
  }
}
export function getLegend (d, aD) { // Utility function to compute percentage.
  // Utility function to compute percentage.
  let sum = 0
  aD.forEach(element => {
    sum = sum + element.freq
  })
  const fraction = ((d.freq / sum) * 100).toFixed(1)
  return fraction
}
