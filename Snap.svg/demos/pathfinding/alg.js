const assert = require('assert');
const fs = require('fs');

const outputFile = 'output.svg';

const cw = 3;
const ch = 2;

const header =
`
<svg version="1.1"
     baseProfile="full"
     width="100%"
     height="100%"
     viewBox="0 0 3 2"
     xmlns="http://www.w3.org/2000/svg">
`;

const background =
`
<rect width="3" height="2" fill="rgb(222,222,222)" />
`;

const footer = `
</svg>
`;

var content = '';

var startingPoint = 1;

var nodes = [
              {
                label : 'one'
              },
              {
                label : 'two'
              },
              {
                label : 'three'
              }
            ];

var r = cw / (nodes.length * 8);

nodes[0].x = cw / 2 - r;
nodes[0].y = ch / 10 + .5;

nodes[1].x = cw / 4 - r;
nodes[1].y = ch / 2 + .5;

nodes[2].x = ((3 * cw) / 4) - r;
nodes[2].y = ch / 2 + .5;

function drawNode(n,i,a) {

     content +=
   `
   <circle
         cx="${n.x}"
         cy="${n.y}"
         r="${r + .05}"
         fill="rgba(0,0,0,.5)"
   />
   <circle
         cx="${n.x}"
         cy="${n.y}"
         r="${r}"
         fill="rgba(66,66,66,1)"
   />

   <text
         x="${n.x - .005}"
         y="${n.y + .05}"
         font-size="${r + .01}"
         text-anchor="middle"
         fill="rgba(0,0,0,1)">
         ${n.label}
   </text>
   <text
         x="${n.x}"
         y="${n.y + .05}"
         font-size="${r}"
         text-anchor="middle"
         fill="rgba(255,255,255,1)">
         ${n.label}
   </text>
   `;



}

var edges = [
              {
                color : 'rgba(0,33,0,1)',
                nodes : [nodes[0],nodes[1]]
              },
              {
                color : 'rgba(0,33,0,1)',
                nodes : [nodes[0],nodes[2]]
              }
            ];

function drawEdge(e,i,a) {
  content += `
  <line x1="${e.nodes[0].x}" y1="${e.nodes[0].y}"
       x2="${e.nodes[1].x}" y2="${e.nodes[1].y}"
       stroke="${e.color}"
       stroke-width=".1"/>
  `;
}

var edgeCandidates = nodes.map(function (currentValue, index, array) {
  if(index < array.length - 1) {
    var tmp_nodes = nodes.slice(index + 1);
    return tmp_nodes.map(function(tmp_currentValue,tmp_index, tmp_array) {
      return {color: 'rgba(33,0,0,1)',nodes: [currentValue, tmp_currentValue]};
    });
  }
});

var flattenedEdgeCandidates = [].concat.apply([], edgeCandidates);

var definedAndFlattenedEdgeCandidates = flattenedEdgeCandidates.filter(function(currentValue, index, array) {
  if(typeof currentValue != 'undefined') {
      return true;
  } else {
    return false;
  }
});

var dafec = definedAndFlattenedEdgeCandidates;

edges.forEach(drawEdge);
// dafec.forEach(drawEdge);
nodes.forEach(drawNode);

const output = header + background + content + footer;

fs.writeFile(outputFile, output, (err) => {
  if (err) throw err;
  console.log('File saved!');
});
