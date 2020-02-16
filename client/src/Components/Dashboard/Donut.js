import britecharts from 'britecharts'
import * as d3 from 'd3'
import React, {useEffect, useState} from 'react'


let donutData = {
    data:[
        {name: "Shiny", id: 1, quantity: 86},
        {name: "Blazing", id: 2, quantity: 300},
        {name: "Dazzling", id: 3, quantity: 276},
        {name: "Radiant", id: 4, quantity: 195},
        {name: "Sparkling", id: 5, quantity: 36},
        {name: "Other", id: 0, quantity: 814}
    ]
}

function createDonutChart() {
    let donutChart = britecharts.donut(),
        donutContainer = d3.select('.js-donut-chart-container'),
        containerWidth = donutContainer.node() ? donutContainer.node().getBoundingClientRect().width : false,
        legendChart = britecharts.legend(),
        legendContainer;

    donutChart
        .isAnimated(true)
        .highlightSliceById(2)
        .width(containerWidth)
        .height(containerWidth)
        .externalRadius(containerWidth/2.5)
        .internalRadius(containerWidth/5)
        .on('customMouseOver', function(data) {
            legendChart.highlight(data.data.id);
        })
        .on('customMouseOut', function() {
            legendChart.clearHighlight();
        });

    legendChart
        .width(300)
        .height(200)
        .numberFormat('s');

    donutContainer.datum(donutData.data).call(donutChart);
    legendContainer = d3.select('.js-legend-chart-container');
    legendContainer.datum(donutData.data).call(legendChart);

}

createDonutChart();