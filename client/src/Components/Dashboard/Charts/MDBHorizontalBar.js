/* eslint-disable */
import React from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {capitalizedName} from "../Utilities/CommonUsedFunctions";
import IssuedBillsByMP from "../../MyMP/IssuedBillsByMP";

// export default class MDBHorizontalBar extends React.Component {
//
//     state = {
//             dataLine: {
//                 labels: [
//                     'Employee', 'Advertising', 'Gifts',
//                     'Hospitality', 'Office', 'Printing', 'Travel'
//                 ],
//                 datasets: [
//                     {
//                         label: capitalizedName(this.props.data[0].label),
//                         fill: true,
//                         lineTension: 0.3,
//                         backgroundColor: "rgba(225, 204,230, .3)",
//                         borderColor: "rgb(205, 130, 158)",
//                         borderCapStyle: "butt",
//                         borderDash: [],
//                         borderDashOffset: 0.0,
//                         borderJoinStyle: "miter",
//                         pointBorderColor: "rgb(205, 130,1 58)",
//                         pointBackgroundColor: "rgb(255, 255, 255)",
//                         pointBorderWidth: 10,
//                         pointHoverRadius: 5,
//                         pointHoverBackgroundColor: "rgb(0, 0, 0)",
//                         pointHoverBorderColor: "rgba(220, 220, 220,1)",
//                         pointHoverBorderWidth: 2,
//                         pointRadius: 1,
//                         pointHitRadius: 10,
//                         data: this.props.data[0].values
//                     },
//                     {
//                         label: this.props.data[1].label,
//                         fill: true,
//                         lineTension: 0.3,
//                         backgroundColor: "rgba(184, 185, 210, .3)",
//                         borderColor: "rgb(35, 26, 136)",
//                         borderCapStyle: "butt",
//                         borderDash: [],
//                         borderDashOffset: 0.0,
//                         borderJoinStyle: "miter",
//                         pointBorderColor: "rgb(35, 26, 136)",
//                         pointBackgroundColor: "rgb(255, 255, 255)",
//                         pointBorderWidth: 10,
//                         pointHoverRadius: 5,
//                         pointHoverBackgroundColor: "rgb(0, 0, 0)",
//                         pointHoverBorderColor: "rgba(220, 220, 220, 1)",
//                         pointHoverBorderWidth: 2,
//                         pointRadius: 1,
//                         pointHitRadius: 10,
//                         data: this.props.data[1].values
//                     }
//                 ]
//             }
//         };
//
//     render() {
//         return (
//             <MDBContainer>
//                 <Line data={this.state.dataLine} options={{ responsive: true }} />
//             </MDBContainer>
//         );
//     }
// }

const MDBHorizontalBar = props =>{
    const [state ] = React.useState(
        {
            dataLine: {
                labels: [
                    'Employee', 'Advertising', 'Gifts',
                    'Hospitality', 'Office', 'Printing', 'Travel'
                ],
                datasets: [
                    {
                        label: capitalizedName(props.data[0].label),
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
                        data: props.data[0].values
                    },
                    {
                        label: props.data[1].label,
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
                        data: props.data[1].values
                    }
                ]
            }
        }
    )
    return (
            <MDBContainer>
                <Line data={state.dataLine} options={{ responsive: true }} />
            </MDBContainer>
    )
}

export default MDBHorizontalBar
