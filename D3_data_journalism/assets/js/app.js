// placing the variables for widths and margins
var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// creating SVG wrapper, appending an SVG group that will hold chart, and shift the latter by left and top margins
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// importing data
d3.csv("assets/data/data.csv").then(function(censusData) {
  // parsing Data/Cast as numbers
  censusData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
  });

  // creating scale variables
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty) * 0.8,
    d3.max(censusData, d => d.poverty) * 1.2
    ]).range([0, width]);
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);

  // creating axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // appending a SVG group
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // appending Axes to the chart
  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup
    .append("g")
    .call(leftAxis);

  // creating Circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(censusData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "10")
  .attr("class", "stateCircle");

  // adding circle labels
  chartGroup.selectAll("null").data(censusData)
  .enter()
  .append("text")
  .text(function(d) { return d.abbr})
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .attr("class", "stateText")
  .attr('font-size', 10);

  // initializing tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .html(function(d) {
      return (`${d.state}<hr>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`);
    });
  
  // creating tooltip in the chart
  chartGroup.call(toolTip);

  // creating event listeners to display and hide the tooltip
  circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // creating axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

}).catch(function(error) {
  console.log(error);
});