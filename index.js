const canvas = d3.select('.canva')
const svg = canvas.append('svg')
                  .attr('width', window.innerWidth)
                  .attr('height', window.innerHeight)
//Margin
const margin =
  {
    top: 0,
    right: 60,
    bottom: 20,
    left: 60
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

const xAxisGroup = mainCanvas.append('g')
                             .attr('transform', `translate(0, ${graphHeight})`)
const yAxisGroup = mainCanvas.append('g')

function drawChart(data){
  
  const bargraph = mainCanvas.selectAll('g')
  .data(data)
  .enter()
  .append('g')

   //scaleLinear
   const y = d3.scaleLinear()
               .domain([0, d3.max(data, d => d.expenses)])
               .range([graphHeight, 0]);
 
  //scaleBand 
  const x = d3.scaleBand()
              .domain()
              .range([0, 500])
              .paddingInner(0.15)
              .paddingOuter(0.15)

  var tickname = data.map(d => d.type)
  console.log(tickname)

  const yAxis = d3.axisLeft(y);
  const xAxis = d3.axisBottom(x)
                  .tickFormat((d,i) => tickname[i])

  const rectOfBars = bargraph.append('rect')


  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);    

}