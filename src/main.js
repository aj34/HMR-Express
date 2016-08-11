import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
// import data from './example';

// constants
const width = 750;
const height = 500;
const radius = Math.min(width, height) / 2;

// fetch data & render inside for static visual
d3.json('http://54.213.83.132/hackoregon/http/oregon_individual_contributors/5/', data => {
  // append our svg with constants for w, h & offsets
  const svg = d3.select('#content')
    .append('svg')
    .attr({
      width: width,
      height: height
    })
    .append('g')
    .attr('transform', 'translate(' + radius + ',' + radius + ')');

  // this example uses sort & ascending - try d3.descending
  const pie = d3.layout.pie()
    .sort((a,b) => d3.ascending(a.sum,b.sum))
    .value(d => d.sum); // choosing the data to visualize

  // arc generator function gives us a slice per datum
  const sliceOfPie = d3.svg.arc()
    .innerRadius(40) // allows us to make donuts vs pies
    .outerRadius(radius - 10)
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle);

  // a separate arc function for our labels later
  const labelArc = d3.svg.arc()
    .outerRadius(radius-60)
    .innerRadius(radius-60);

  // our color function this time uses a built in helper
  const colors = d3.scale.category20c();

  // for less string interpolations
  const translate = (a,b) => `translate(${a},${b})`;

  // formatting the money
  const formatMoney = d3.format("$,");

  // creating and appending our slices
  const group = svg.selectAll('.slice')
    .data(pie(data)) // calling the pie func on data
    .enter()
    .append('g')
    .attr("class", "slice");

  // appending the path for each slice
  group.append('path')
    .attr({
      d: sliceOfPie, // data attribute
      stroke: 'white',
      'stroke-width': 4,
      fill: (d, i) => colors(i)
    })

  // adding our labels - note how both labels are done
  group.append("text")
    .attr("transform", d => translate(...labelArc.centroid(d))) // using spread operator for 2 arguments from array
    .text(d => `${d.data.contributor_payee}`);
  group.append('text')
  .attr("transform", d => translate(labelArc.centroid(d)[0],(labelArc.centroid(d)[1]+20))) // using the centroid numbers but customizing offsets
  .text(d => `${formatMoney(d.data.sum)}`);
});
/*
 * ignore this code below - it's for webpack to know that this
 * code needs to be watched and not to append extra elements
 */
const duplicateNode = document.querySelector('svg');
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    if (duplicateNode) {
      duplicateNode.parentNode.removeChild(duplicateNode);
    }
  });
}






window.data1 = [{
  "crimeType": "mip",
  "totalCrimes": 24
}, {
  "crimeType": "theft",
  "totalCrimes": 558
}, {
  "crimeType": "drugs",
  "totalCrimes": 81
}, {
  "crimeType": "arson",
  "totalCrimes": 3
}, {
  "crimeType": "assault",
  "totalCrimes": 80
}, {
  "crimeType": "burglary",
  "totalCrimes": 49
}, {
  "crimeType": "disorderlyConduct",
  "totalCrimes": 63
}, {
  "crimeType": "mischief",
  "totalCrimes": 189
}, {
  "crimeType": "dui",
  "totalCrimes": 107
}, {
  "crimeType": "resistingArrest",
  "totalCrimes": 11
}, {
  "crimeType": "sexCrimes",
  "totalCrimes": 24
}, {
  "crimeType": "other",
  "totalCrimes": 58
}];


window.data2 = [{
  "crimeType": "mip",
  "totalCrimes": 10
}, {
  "crimeType": "theft",
  "totalCrimes": 30
}, {
  "crimeType": "drugs",
  "totalCrimes": 10
}, {
  "crimeType": "arson",
  "totalCrimes": 3
}, {
  "crimeType": "assault",
  "totalCrimes": 80
}, {
  "crimeType": "burglary",
  "totalCrimes": 49
}, {
  "crimeType": "disorderlyConduct",
  "totalCrimes": 10
}, {
  "crimeType": "mischief",
  "totalCrimes": 389
}, {
  "crimeType": "dui",
  "totalCrimes": 507
}, {
  "crimeType": "resistingArrest",
  "totalCrimes": 11
}, {
  "crimeType": "sexCrimes",
  "totalCrimes": 24
}, {
  "crimeType": "other",
  "totalCrimes": 258
}];


var width1 = 800,
  height1 = 250,
  radius1 = Math.min(width1, height1) / 2;

var color = d3.scale.ordinal()
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
  .outerRadius(radius1 - 10)
  .innerRadius(0);

var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return d.totalCrimes;
  });


var svg = d3.select("#chartDiv").append("svg")
  .attr("width", width1)
  .attr("height", height1)
  .append("g")
  .attr("id", "pieChart")
  .attr("transform", "translate(" + width1 / 2 + "," + height1 / 2 + ")");

var path = svg.selectAll("path")
  .data(pie(data1))
  .enter()
  .append("path");

path.transition()
  .duration(500)
  .attr("fill", function(d, i) {
    return color(d.data.crimeType);
  })
  .attr("d", arc)
  .each(function(d) {
    this._current = d;
  }); // store the initial angles


window.change = function change(data) {
  path.data(pie(data));
  path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.

function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}



