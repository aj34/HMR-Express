import d3 from 'd3';
import _ from 'lodash';
import './assets/styles.css';

const SUMMARY_URL = 'https://raw.githubusercontent.com/hackoregon/hack-u-dynamic-data-viz-sum16/week3/hw/OR_sum.json';

const summary = [
  {
    "in":353648758.9, // total money coming in
    "out":341146543.64, // total money going out
    "from_within":91600635.93, // money from within OR
    "to_within":71467440.8999999, // money staying inside OR
    "from_outside":262048122.97, // money from out of state
    "to_outside":269679102.74, // money sent out of state
    "total_grass_roots":44503420.66, // total of contributions under $250
    "total_from_in_state":233200288.870001 // total money from inside OR
  }
];


const margin = {
  top: 50,
  right: 75,
  bottom: 50,
  left: 75
};
const width = 1000 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;


var parseDate = d3.time.format('%Y-%m-%d').parse;

d3.json(SUMMARY_URL, function(json) {

  var dataTotalFromWithin = json.map(function (item) {
    return {
      date: parseDate(item.tran_date),
      amount: item.total_from_within,
    }
  });

  var dataTotalFromOutside = json.map(function (item) {
    return {
      date: parseDate(item.tran_date),
      amount: item.total_from_the_outside,
    }
  });

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
    .ticks(5);

  var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    .ticks(15);

  // Define the line
  var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.amount); });

  // Adds the svg canvas
  var svg = d3.select("#content")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(dataTotalFromOutside, function(d) { return d.date; }));
  y.domain([0, d3.max(dataTotalFromOutside, function(d) { return d.amount; })]);

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
  
  // Add the valueline path for "within"
  svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(dataTotalFromWithin))
    .attr("stroke", "orange");

  // Add the scatterplot for "within
  svg.selectAll("dot")
    .data(dataTotalFromWithin)
    .enter().append("circle")
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.amount); })
    .attr('fill', "orangeRed");

  // Add the valueline path for "from outside"
  svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(dataTotalFromOutside))
    .attr("stroke", "SteelBlue");

  // Add the scatterplot for "from outside"
  svg.selectAll("dot")
    .data(dataTotalFromOutside)
    .enter().append("circle")
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.amount); })
    .attr('fill', "Navy");

});

/*
 * ignore this code below - it's for webpack to know that this
 * code needs to be watched and not to append extra elements
 */
const duplicateNode = document.querySelector('#content');

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    duplicateNode.parentNode.removeChild(duplicateNode);
  });
}
