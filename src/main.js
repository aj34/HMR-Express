import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
import data from './example';

//const url = 'https://gist.githubusercontent.com/d3byex/25129228aa50c30ef01f/raw/2f8664d0eb75ef606f412f9647116954ff0af41d/radial.json';

const data_url = "http://54.213.83.132/hackoregon/http/current_candidate_transactions_in/5591/";

d3.json(data_url, (error, data) => {
  var mungedData = d3.nest()
    .key(function (d) { return d.filer; })
    .key(function (d) { return d.book_type; })
    .entries(data);

  var topNode = mungedData[0];

  topNode.children = topNode.values.filter(d => {
    if (d.key === 'Individual' || d.key == 'null' || d.key === 'Political Committee' || d.key === 'Business Entity') {
      d.children = d.values.map(d => {
        return {
          key: d.contributor_payee,
          children: [],
          amount: d.amount
        };
      })
        .sort(function(a, b) { return b.amount - a.amount })
        .slice(0, 10);

      delete d.values;
      return d;
    }
  });

  delete topNode.values;
  console.log(topNode);
  
  const width = 500,
    height = 500,
    nodeRadius = 4.5;
  const svg = d3.select('#content')
    .append('svg')
    .attr({
      width: width + 600,
      height: height + 600
    });
  const radius = width / 2;
  const mainGroup = svg.append('g')
    .attr("transform", "translate(" + width + "," + height + ")");
  const cluster = d3.layout.cluster()
    .size([360, radius - 50]);
  const nodes = cluster.nodes(topNode);
  const links = cluster.links(nodes);
  const diagonal = d3.svg.diagonal.radial()
    .projection(d => {
      return [
        d.y,
        d.x / 180 * Math.PI
      ];
    });
  mainGroup.selectAll('path')
    .data(links)
    .enter()
    .append('path')
    .attr({
      'd': diagonal,
      fill: 'none',
      stroke: '#ccc',
      'stroke-width': 1
    });
  const nodeGroups = mainGroup.selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", d => {
      return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
    });
  nodeGroups.append("circle")
    .attr({
      r: nodeRadius,
      fill: '#fff',
      stroke: 'tomato',
      'stroke-width': 1.5
    });
  nodeGroups.append("text")
    .attr({
      dy: ".31em",
      'text-anchor': d => {
        return d.x < 180 ? "start" : "end";
      },
      'transform': d => {
        return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
      }
    })
    .style('font', '10px Open Sans')
    .text(d => {
      return `${d.key.substr(0, 33)} - ${d.amount ? '$'+ d.amount : ''}`;
    });
});
/*
 * ignore this code below - it's for webpack to know that this
 * code needs to be watched and not to append extra elements
 */
if (module.hot) {
  const duplicateNode = document.querySelector('svg');
  module.hot.accept();
  module.hot.dispose(() => {
    if (duplicateNode) {
      duplicateNode.parentNode.removeChild(duplicateNode);
    }
  });
}


/*
var data1 ={
  zoomer: "1",
  children: [
    {
      cat: "1-1",
      children: [
        {
          dog: "1-1-1",
          children: [ ]
        },
        {
          name: "1-1-2",
          wonder: [ ]
        },
        {
          name: "1-1-3",
          children: [ ]
        },
        {
          name: "1-1-4",
          children: [ ]
        },
        {
          name: "1-1-5",
          children: [ ]
        },
        {
          name: "1-1-6",
          children: [ ]
        },
        {
          name: "1-1-7",
          children: [ ]
        },
        {
          name: "1-1-8",
          children: [ ]
        },
        {
          name: "1-1-9",
          children: [ ]
        }
      ]
    },
    {
      name: "1-2",
      children: [
        {
          name: "1-2-1",
          children: [ ]
        },
        {
          name: "1-2-2",
          children: [ ]
        },
        {
          name: "1-2-3",
          children: [ ]
        },
        {
          name: "1-2-4",
          children: [ ]
        },
        {
          name: "1-2-5",
          children: [ ]
        },
        {
          name: "1-2-6",
          children: [ ]
        },
        {
          name: "1-2-7",
          children: [ ]
        },
        {
          name: "1-2-8",
          children: [ ]
        },
        {
          name: "1-2-9",
          children: [ ]
        }
      ]
    },
    {
      name: "1-3",
      children: [
        {
          name: "1-3-1",
          children: [ ]
        },
        {
          name: "1-3-2",
          children: [ ]
        },
        {
          name: "1-3-3",
          children: [ ]
        },
        {
          name: "1-3-4",
          children: [ ]
        },
        {
          name: "1-3-5",
          children: [ ]
        },
        {
          name: "1-3-6",
          children: [ ]
        },
        {
          name: "1-3-7",
          children: [ ]
        },
        {
          name: "1-3-8",
          children: [ ]
        },
        {
          name: "1-3-9",
          children: [ ]
        }
      ]
    },
    {
      name: "1-4",
      children: [
        {
          name: "1-4-1",
          children: [ ]
        },
        {
          name: "1-4-2",
          children: [ ]
        },
        {
          name: "1-4-3",
          children: [ ]
        },
        {
          name: "1-4-4",
          children: [ ]
        },
        {
          name: "1-4-5",
          children: [ ]
        },
        {
          name: "1-4-6",
          children: [ ]
        },
        {
          name: "1-4-7",
          children: [ ]
        },
        {
          name: "1-4-8",
          children: [ ]
        },
        {
          name: "1-4-9",
          children: [ ]
        }
      ]
    }
  ]
}*/
