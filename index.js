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
  .data(data)
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
              .attr('height', d => Math.abs(d.expenses/50))
              .attr('x', (d, i) => i*50)
              .attr('y', (d) =>  yPlace(d.expenses)/50)
              .attr('fill', d => colorSelector(d.expenses))
}