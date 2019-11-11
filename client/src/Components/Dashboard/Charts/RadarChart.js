import React, {Component} from 'react';
import {Radar, Pie} from 'react-chartjs-2';
class RadarChart extends Component{
    constructor(props){
        super(props);
        this.state = {
            chartData:props.chartData
        }
    }
    static defaultProps = {
        displayTitle:true,
        displayLegend: true,
        legendPosition:'right',
    }
    render(){
        return (
            <div className="chart">
                <Radar
                    data={{
                        labels: ['Economics', 'Social Issues', 'Health Care'],
                        datasets: [
                            {
                                label: 'Trend',
                                data: [
                                    100,
                                    200,
                                    300,
                                ],
                                backgroundColor: [
                                    'rgba(54, 162, 235, 0.6)',
                                    'rgba(255, 99, 132, 0.6)',
                                    'rgba(255, 206, 86, 0.6)',
                                    'rgba(255, 99, 132, 0.6)',
                                ],
                            }
                        ],
                        hoverBackgroundColor: [
                            '#FF6384',
                        ]
                    }}
                    width={400}
                    height={350}
                    options={{
                        legend:{
                            display:"ACTIVE RATE",
                            position:"bottom"
                        },
                    }}
                />
            </div>
        )
    }
}
export default RadarChart;