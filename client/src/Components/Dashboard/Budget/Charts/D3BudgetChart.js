import * as d3 from "d3";
import TotalEmployeeCosts from "../MPCalculations/TotalEmployeeCosts";
import AverageEmployee from "../AverageCalculations/AverageEmployee";

let data = [
  { categoryName: "Employee", amount: 0.09492 },
  { categoryName: "Avg. Employee", amount: 0.01492 }
];

export default class D3BudgetChart {
  constructor(element) {
    const margin = { top: 40, right: 20, bottom: 30, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const formatPercent = d3.format(".0%");

    let x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.4);

    let y = d3.scaleLinear().range([height, 0]);

    let xAxis = d3.axisBottom(x);

    let yAxis = d3.axisLeft(y).tickFormat(formatPercent);

    // let tip = d3
    //   .tip()
    //   .attr("class", "d3-tip")
    //   .offset([-10, 0])
    //   .html(function(d) {
    //     return (
    //       "<strong>amount:</strong> <span style='color:red'>" +
    //       d.amount +
    //       "</span>"
    //     );
    //   });

    var svg = d3
      .select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.call(tip);

    x.domain(
      data.map(function(d) {
        return d.categoryName;
      })
    );
    y.domain([
      0,
      d3.max(data, function(d) {
        return d.amount;
      })
    ]);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("amount");

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.categoryName);
      })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        return y(d.amount);
      })
      .attr("height", function(d) {
        return height - y(d.amount);
      });
    // .on("mouseover", tip.show)
    // .on("mouseout", tip.hide);
  }
}

function type(d) {
  d["gdp"] = +d["gdp"];
  d["infant.mortality"] = +d["infant.mortality"];
  return d;
}
