import * as d3 from 'd3'
import React, { useRef, useEffect } from 'react'

        const colors = d3.scaleOrdinal(d3.schemeCategory10)
        let duration = 1500,
            // width = window.innerWidth - 20,
            // height = window.innerHeight - 20,
            width = 100,
            height=100,
            radius = Math.min(width, height) / 3,
            format = d3.format(".0%"),
            pie = d3.pie().sort(null)

        const arc = d3.arc()
            .innerRadius(radius * .8)
            .outerRadius(radius)

export default class SimilaritiesPieChart {

    constructor(element,data) {

        let vis = this
       vis.svg = d3.select(element).append('svg')
            .attr("width", width)
            .attr("height", height)
             .append("g")
             .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")


        vis.update(data)
    }


          update (data){
              if(data){
                  let vis = this
                  vis.data = data
                  let path = vis.svg.selectAll("path")
                      .data(pie(data[0].lower))
                      .enter().append("path")
                      .attr('fill',(d,i)=> {return colors(i)})
                      .attr("d", arc)
                      .each(function (d) {
                          this._current = d;
                      });

                  let text = vis.svg.append("text")
                      .attr("text-anchor", "middle")
                      .attr("dy", ".3em");

                  let progress = 0;

                  console.log(vis.data[1])
                  let timeout = setTimeout(function () {
                      clearTimeout(timeout);
                      console.log(vis.data[0].upper)
                      path = path.data(pie(vis.data[0].upper));
                      path.transition().duration(duration).attrTween("d", function (a) {
                          let i = d3.interpolate(this._current, a);
                          let i2 = d3.interpolate(progress, vis.data[1])
                          this._current = i(0);
                          return function (t) {
                              text.text(format(i2(t) / 100));
                              return arc(i(t));
                          };
                      });
                  }, 250);
              }

        }


}




