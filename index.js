const canvas = d3.select('.canva')
const svg = canvas.append('svg')
                  .attr('width', window.innerWidth)
                  .attr('height', window.innerHeight)
//Margin
const margin =
  {
    top: 0,
    right: 60,
    bottom: 200,
    left: 60,
    padding: 0.3
  };


const graphWidth = window.innerWidth - margin.left - margin.right;
const graphHeight = window.innerHeight - margin.top - margin.bottom;

const mainCanvas = svg.append('g')
                .attr('height', graphHeight /2)
                .attr('width', graphWidth / 2)
                .attr('transform',`translate(${margin.left},${margin.top})`);


// Color selector
function colorSelector(amount){
  if(amount >= 0)
    return 'green'
  return 'red'
}




//CSV Data                
function getCSVData() {
  d3.csv('/data.csv', function(d){
    return d;
  }).then(drawChart);}

getCSVData();

function drawChart(data){
  var nodes = getWaterfallLayout(data)
  var array_num = [...data.map(d => parseFloat(d.expenses))]
  var max = d3.max(array_num)

  var firstBar = max
  var positive = 0
  var negetive = 0
  
  function yPlace(d) {
      if(d < 0)
        return negetive += d
      return negetive
    
  }


  const bargraph = mainCanvas.selectAll('g')
  .data(nodes)
  .enter()
  .append('g')

  //scaleLinear
  const y = d3.scaleLinear()
               .domain([0 ,60])
               .range([0, graphHeight])

  var tickname = data.map(d => d.type)
 
  
  const rectOfBars = bargraph
              .append('rect')
              .attr('width', 20)
              .attr('height', d => d.h)
              .attr('x', (d, i) => i*50)
              .attr('y', (d) =>  d.y)
              .attr('fill', d => colorSelector(d.value))
}

function getWaterfallLayout(data) {
  
  // Create empty nodes and alias variable names for columns
  var nodes = []
  var columns = data.columns
  var [colName, colValue] = columns

  // Create waterfall layout
  var h1 = 0
  var y1 = 0
  var v1 = 0
  data.forEach((e, i) => {
    // Callculate each node properties
    var name = e[colName]
    var v2 = parseFloat(e[colValue])
    var h2 = Math.abs(v2)
    var y2 = i == 0 ? 0 : getY2(v1,v2,y1,h1,h2)
    // Declare and push node object
    var node = {
      name,
      v1,
      value: v2,
      h: h2,
      y: y2
    }
    nodes.push(node)
    y1 = y2
    h1 = h2
    v1 = v2
  }
  )
  console.log(nodes)
  return nodes
}

function getY2(v1,v2,y1,h1,h2){
  var y2 = 0
  if(v1 >= 0 && v2 < 0)
    y2 = y1
  if(v1 >= 0 && v2 >= 0)
    y2 = y1 - h2
  if(v1 < 0 && v2 >= 0)
    y2 = y1 + h1 - h2
  if(v1 < 0 && v2 < 0)
    y2 = y1 + h1

  return y2
}