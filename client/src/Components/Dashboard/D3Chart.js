import * as d3 from 'd3'
import React, { useRef, useEffect } from 'react'

//https://medium.com/@jeffbutsch/using-d3-in-react-with-hooks-4a6c61f1d102
 export const D3Chart = (props)=> {

        const ref = useRef(null);

        const createPie = d3
            .pie()
            .value(d => d.value)
            .sort(null);

        const createArc = d3
            .arc()
            .innerRadius(props.innerRadius)
            .outerRadius(props.outerRadius)


        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        const format = d3.format(".2f");

        useEffect(
            ()=> {

            const data = createPie(props.data);

            const group = d3.select(ref.current);
            const groupWithData = group.selectAll("g.arc").data(data);

            groupWithData.exit().remove();

            const groupWithUpdate = groupWithData
                .enter()
                .append("g")
                .attr("class", "arc");

            const path = groupWithUpdate
                .append("path")
                .merge(groupWithData.select("path.arc"));

            path
                .attr("class", "arc")
                .attr("d", createArc)
                .attr("fill", (d, i) => colors(i));

            const text = groupWithUpdate
                .append("text")
                .merge(groupWithData.select("text"));

            text
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("transform", d => `translate(${createArc.centroid(d)})`)
                .style("fill", "white")
                .style("font-size", 10)
                .text(d => format(d.value));
        }
        , [props.data]);

    return (
        <div>
             <svg width={props.width} height={props.height}>
                <g
                ref={ref}
                transform={`translate(${props.outerRadius+600} ${props.outerRadius})`}
                />
            </svg>
        </div>
)

}
