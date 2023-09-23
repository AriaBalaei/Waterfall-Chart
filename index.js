const canvas = d3.select('.canva')
const svg = canvas.append('svg')
                  .attr('width', window.innerWidth)
                  .attr('height', window.innerHeight)
//Margin
const margin =
  {
    top: 60,
    right: 60,
    bottom: 200,
    left: 80,
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
  if(amount < 0)
    return 'red'
  return 'blue'
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
  var totalAmount = 0
  for(key of array_num){
    totalAmount += key}
    
    var total = {
      name: 'Total',
      value: 'Total',
      h: totalAmount,
      v1: totalAmount,
      y: nodes[nodes.length-1].y
    }
    console.log(total)
    nodes.push(total)
  const bargraph = mainCanvas.selectAll('g')
  .data(nodes)
  .enter()
  .append('g')

  const xAxisGroup = mainCanvas.append('g')
                    .attr('transform', `translate(0, ${graphHeight})`)         
  const yAxisGroup = mainCanvas.append('g')


  //scaleLinear
  const y = d3.scaleLinear()
              .domain([0 , max])
              .range([0 ,graphHeight ])
  const z = d3.scaleLinear()
              .domain([max , 0])
              .range([0 ,graphHeight ])
  //scaleBand 
  const x = d3.scaleBand()
              .domain(nodes.map(item => item.value))
              .range([0, 800])
              .round(true)
              .paddingInner(0.42)
              .paddingOuter(0.5)
              
  
  var tickname = data.map(d => d.type)
  tickname.push('Total')

  const yAxis = d3.axisLeft(z)
                  .ticks(10, "$.2f") 
  const xAxis = d3.axisBottom(x)
                .tickFormat((d,i) => tickname[i])
  
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);   
  
  const rectOfBars = bargraph
              .append('rect')
              .attr('width',  x.bandwidth)
              .attr('height', d => y(d.h))
              .attr('x', (d, i) => x(d.value))
              .attr('y', (d) =>  y(d.y))
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