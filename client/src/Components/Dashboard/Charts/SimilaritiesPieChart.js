import * as d3 from 'd3'
import React, { useRef, useEffect } from 'react'
import axios from "axios";
import {fetchRepresentative, fetchUserRiding} from '../../../Components/Navbar'
export default class SimilaritiesPieChart {

    constructor(element,data) {
        let chart = this
        const colors = d3.scaleOrdinal(d3.schemeCategory10)
        let duration = 1500,
            transition = 200,
            percent = 45,
            width = window.innerWidth - 20,
            height = window.innerHeight - 20,
            radius = Math.min(width, height) / 3,
            format = d3.format(".0%"),
            pie = d3.pie().sort(null)

        chart.svg = d3.select(element).append('svg')
            .attr("width", width)
            .attr("height", height)


        const arc = d3.arc()
            .innerRadius(radius * .8)
            .outerRadius(radius);

        console.log("data from props "+ data[0])
        console.log("data from props "+ data[1])
        update(data)

        function calcPercent(percent) {
            return [percent, 100 - percent];
        };
        function update(data,element){
            let chart = this
            getalldata(data[0]).then(dataForHead1 =>{

                getalldata(data[1]).then(dataForHead2=>{

                    if( dataForHead1.length != 0 && dataForHead2.length != 0){

                        console.log(dataForHead1)
                        console.log(dataForHead2)
                        let similarities = 0
                        for(let i =0; i< dataForHead1.length;i++){
                            for(let j =0; j<dataForHead2.length; j++){
                                if(dataForHead1[i].billData.bill == dataForHead2[j].billData.bill
                                    && dataForHead1[i].voteRecord.yea == dataForHead2[j].voteRecord.yea) {
                                    similarities++
                                    console.log('im here inside the inner for loop i.e if statement')
                                }
                                // console.log('Here outside and the bill id is '+ data)
                                console.log('im here outside the if')
                            }
                        }

                        console.log('the similarities % !!!!!!!!'+ similarities/100+" %")

                        let dataset = {
                            lower: calcPercent(0),
                            upper: calcPercent(similarities)
                        }

                        chart.svg = d3.select(element).append('svg')
                            .attr("width", width)
                            .attr("height", height)

                        chart.g= chart.svg
                            .append("g")
                            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

                        let path = chart.svg.selectAll("path")
                            .data(pie(dataset.lower))
                            .enter().append("path")
                            .attr('fill',(d,i)=> {return colors(i)})
                            .attr("d", arc)
                            .each(function (d) {
                                this._current = d;
                            });

                        let text = chart.svg.append("text")
                            .attr("text-anchor", "middle")
                            .attr("dy", ".3em");

                        let progress = 0;

                        let timeout = setTimeout(function () {
                            clearTimeout(timeout);
                            path = path.data(pie(dataset.upper));
                            path.transition().duration(duration).attrTween("d", function (a) {
                                let i = d3.interpolate(this._current, a);
                                let i2 = d3.interpolate(progress, similarities)
                                this._current = i(0);
                                return function (t) {
                                    text.text(format(i2(t) / 100));
                                    return arc(i(t));
                                };
                            });
                        }, 200);
                    }


                })
            })
        }
        async function getAllBillsByHead (head) {
            let result = []
            await axios
                .get(`http://localhost:5000/api/bills/${head}/getAllBillsByHead`)
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data.data)
                        result= res.data.data

                    }
                })
                .catch(err => console.error(err))
            return result
        }
        async function getalldata(data) {
            let result = []
            let dataForDB =  await getAllBillsByHead(data)
            result = dataForDB
            return result
        }

    }




}

