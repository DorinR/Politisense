import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
// import React, { Component } from 'react'
//
// // Resolves charts dependancy
// charts(FusionCharts);
//
// const dataSource = {
//     chart: {
//         caption: "Deaths reported because of insect bites in India",
//         yaxisname: "Number of deaths reported",
//         subcaption: "(As per government records)",
//         flatscrollbars: "0",
//         scrollheight: "12",
//         numvisibleplot: "8",
//         plottooltext:
//             "<b>$dataValue</b> people died because of $seriesName in $label",
//         theme: "fusion"
//     },
//     categories: [
//         {
//             category: [
//                 {
//                     label: "1994"
//                 },
//                 {
//                     label: "1995"
//                 },
//                 {
//                     label: "1996"
//                 },
//                 {
//                     label: "1997"
//                 },
//                 {
//                     label: "1998"
//                 },
//                 {
//                     label: "1999"
//                 },
//                 {
//                     label: "2000"
//                 },
//                 {
//                     label: "2001"
//                 },
//                 {
//                     label: "2002"
//                 },
//                 {
//                     label: "2003"
//                 },
//                 {
//                     label: "2004"
//                 },
//                 {
//                     label: "2005"
//                 },
//                 {
//                     label: "2006"
//                 },
//                 {
//                     label: "2007"
//                 },
//                 {
//                     label: "2008"
//                 },
//                 {
//                     label: "2009"
//                 },
//                 {
//                     label: "2010"
//                 },
//                 {
//                     label: "2011"
//                 },
//                 {
//                     label: "2012"
//                 },
//                 {
//                     label: "2013"
//                 },
//                 {
//                     label: "2014"
//                 },
//                 {
//                     label: "2015"
//                 },
//                 {
//                     label: "2016"
//                 },
//                 {
//                     label: "2017"
//                 }
//             ]
//         }
//     ],
//     dataset: [
//         {
//             seriesname: "Hymenoptera",
//             data: [
//                 {
//                     value: "15622"
//                 },
//                 {
//                     value: "10612"
//                 },
//                 {
//                     value: "15820"
//                 },
//                 {
//                     value: "26723"
//                 },
//                 {
//                     value: "35415"
//                 },
//                 {
//                     value: "25555"
//                 },
//                 {
//                     value: "81803"
//                 },
//                 {
//                     value: "47950"
//                 },
//                 {
//                     value: "42396"
//                 },
//                 {
//                     value: "19435"
//                 },
//                 {
//                     value: "9780"
//                 },
//                 {
//                     value: "23243"
//                 },
//                 {
//                     value: "28619"
//                 },
//                 {
//                     value: "8477"
//                 },
//                 {
//                     value: "3503"
//                 },
//                 {
//                     value: "14278"
//                 },
//                 {
//                     value: "30522"
//                 },
//                 {
//                     value: "61518"
//                 },
//                 {
//                     value: "24819"
//                 },
//                 {
//                     value: "16437"
//                 },
//                 {
//                     value: "21171"
//                 },
//                 {
//                     value: "1690"
//                 },
//                 {
//                     value: "2418"
//                 },
//                 {
//                     value: "11253"
//                 }
//             ]
//         },
//         {
//             seriesname: "Diptera",
//             data: [
//                 {
//                     value: "3622"
//                 },
//                 {
//                     value: "2612"
//                 },
//                 {
//                     value: "5820"
//                 },
//                 {
//                     value: "6723"
//                 },
//                 {
//                     value: "5415"
//                 },
//                 {
//                     value: "5555"
//                 },
//                 {
//                     value: "1803"
//                 },
//                 {
//                     value: "7950"
//                 },
//                 {
//                     value: "2396"
//                 },
//                 {
//                     value: "9435"
//                 },
//                 {
//                     value: "2780"
//                 },
//                 {
//                     value: "3243"
//                 },
//                 {
//                     value: "8619"
//                 },
//                 {
//                     value: "1477"
//                 },
//                 {
//                     value: "1503"
//                 },
//                 {
//                     value: "4278"
//                 },
//                 {
//                     value: "9522"
//                 },
//                 {
//                     value: "2518"
//                 },
//                 {
//                     value: "4819"
//                 },
//                 {
//                     value: "6437"
//                 },
//                 {
//                     value: "6171"
//                 },
//                 {
//                     value: "2690"
//                 },
//                 {
//                     value: "1418"
//                 },
//                 {
//                     value: "1253"
//                 }
//             ]
//         }
//     ]
// };
//
// export default class MDBHorizontalBar extends React.Component {
//     render() {
//         return (
//             <ReactFusioncharts
//                 type="scrollstackedcolumn2d"
//                 width="100%"
//                 height="50%"
//                 dataFormat="JSON"
//                 dataSource={dataSource}
//             />
//         );
//     }
// }
import React from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {capitalizedName} from "../Utilities/CommonUsedFunctions";

export default class MDBHorizontalBar extends React.Component {

     state = {
            dataLine: {
                labels: [
                    'Employee', 'Advertising', 'Gifts',
                    'Hospitality', 'Office', 'Printing', 'Travel'
                ],
                datasets: [
                    {
                        label: capitalizedName(this.props.data[0].label),
                        fill: true,
                        lineTension: 0.3,
                        backgroundColor: "rgba(225, 204,230, .3)",
                        borderColor: "rgb(205, 130, 158)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgb(205, 130,1 58)",
                        pointBackgroundColor: "rgb(255, 255, 255)",
                        pointBorderWidth: 10,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgb(0, 0, 0)",
                        pointHoverBorderColor: "rgba(220, 220, 220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.props.data[0].values
                    },
                    {
                        label: this.props.data[1].label,
                        fill: true,
                        lineTension: 0.3,
                        backgroundColor: "rgba(184, 185, 210, .3)",
                        borderColor: "rgb(35, 26, 136)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgb(35, 26, 136)",
                        pointBackgroundColor: "rgb(255, 255, 255)",
                        pointBorderWidth: 10,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgb(0, 0, 0)",
                        pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.props.data[1].values
                    }
                ]
            }
        };




    render() {
        return (
            <MDBContainer>
                <Line data={this.state.dataLine} options={{ responsive: true }} />
            </MDBContainer>
        );
    }
}
//
// import React from 'react';
// import { HorizontalBar } from 'react-chartjs-2';
// import { MDBContainer } from 'mdbreact';
//
// export default class MDBHorizontalBar extends React.Component {
//     state = {
//         dataHorizontal: {
//             labels: [
//                     'Employee', 'Advertising', 'Gifts',
//                     'Hospitality', 'Office', 'Printing', 'Travel'
//                 ],
//             datasets: [
//                 {
//                     label: this.props.data[0].label,
//                     data: this.props.data[0].values,
//                     fill: true,
//                     backgroundColor: '#67b7dc'
//                     ,
//                     borderColor: '#67b7dc',
//                     borderWidth: 1
//                 },
//                 {
//                     label: this.props.data[1].label,
//                     data: this.props.data[1].values,
//                     fill: true,
//                     backgroundColor: 'rgb(75, 192, 192)',
//                     borderColor: 'rgb(75, 192, 192)'
//                     ,
//                     borderWidth: 1
//                 }
//             ]
//         }
//     };
//
//     render() {
//         return (
//             <MDBContainer>
//                 <HorizontalBar
//                     data={this.state.dataHorizontal}
//                     options={{ responsive: true }}
//                 />
//             </MDBContainer>
//         );
//     }
// }
//
