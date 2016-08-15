import d3 from 'd3';
import _ from 'lodash';
import './assets/styles.css';

/// bar chart

const INDIVIDUAL_DATA = 'http://54.213.83.132/hackoregon/http/oregon_individual_contributors/10/';
const COMMITTEE_DATA = 'http://54.213.83.132/hackoregon/http/oregon_committee_contributors/10/';
const BUSINESS_DATA = 'http://54.213.83.132/hackoregon/http/oregon_business_contributors/10/';


const margin = {
  top: 10,
  right: 75,
  bottom: 100,
  left: 75
};

var height = 400; // set vars for height & width
var width = 600;

var svg = d3.select('#barChart')
  .append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yScale = d3.scale.linear()
  .range([height, 0]) // set yScale linear

var xScale = d3.scale.ordinal()
  .rangeBands([0, width], 0.25, 0.25); // (width of data), padding between, padding outside

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .ticks(10);

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(10);

const visualize = (url) => {
  d3.json(url, function (json) {
    let data = json;
    let max = d3.max(data, d => d.sum);

    yScale.domain([0, max + 100000]); // domain manually set a little higher than max value
    xScale.domain(data.map(function (d) { return d.contributor_payee; }));

    let bar = svg.selectAll('rect')
      .data(data, function(d) { return d.contributor_payee; })

      bar.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) { return xScale(d.contributor_payee) })
        .attr('y', function (d) { return yScale(d.sum) })
        .attr('width', xScale.rangeBand()) // width determined by xScale.rangeBand
        .style('height', function (d) { return height - yScale(d.sum) })

      bar.exit().remove();

      bar
       .transition().duration(750)
       .attr('x', function (d) { return xScale(d.contributor_payee) })
       .attr('y', function (d) { return yScale(d.sum) })
       .attr('width', xScale.rangeBand()) // width determined by xScale.rangeBand
       .style('height', function (d) { return height - yScale(d.sum) })

    svg.select(".y.axis").remove();
    svg.select(".x.axis").remove();
    svg.selectAll("text").remove();

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
  });
}

const visualizeWithChoice = (url) => {
  if (url) {
    visualize(url);
  } else {
    switch ($('select option:selected').val()) {
      case 'individual':
        visualize(INDIVIDUAL_DATA);
        break;
      case 'business':
        return visualize(COMMITTEE_DATA);
        break;
      case 'committee':
        return visualize(BUSINESS_DATA);
        break;
      default:
    }
  }
}


// functions for the page interactions
$('#options')
  .on('change', (event, index, value) => {
    return visualizeWithChoice();
  });

// initial  chart
visualizeWithChoice(INDIVIDUAL_DATA);

/*
* ignore this code below - it's for webpack to know that this
* code needs to be watched and not to append extra elements
*/
const duplicateNode = document.querySelector('svg');
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    duplicateNode.parentNode.removeChild(duplicateNode);
  });
}