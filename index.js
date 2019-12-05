"use strict";
(function() {
    let svgContainer = "";
    let popContainer = "";
    var margin = {top: 10, right: 40, bottom: 130, left: 140},
        width = 560 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    window.onload = function() {
        svgContainer = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        svgContainer.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", 250)
            .attr("y", 400)
            .text("Current Status");   
        svgContainer.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", -90)
            .attr("y", -100)
            //.attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Number of Cases");  

        /* popContainer = d3.select("#popChart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            popContainer.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", 250)
                .attr("y", 400)
                .text("Victim Sex");   
            popContainer.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("x", -90)
                .attr("y", -100)
                //.attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("Number of Cases");  
 */
    // get the data
        d3.csv("data.csv", 
        function(data) {
        console.log(data);
        
        var d = d3.nest()
            .key(function(d) {
                return d["Status Description"];
            })
            .rollup(function(v) {
                console.log(v.length);
                return v.length;
                
            }).entries(data);
            console.log(d);

    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    var y = d3.scaleLinear()
          .range([height, 0]);

    x.domain(d.map(function(d) { return d.key; }));
    y.domain([0, d3.max(d, function(d) { return d.value; })]);
        
    //d.forEach(function(d) {
    //   d.key = +d.key;
    //});
          // append the rectangles for the bar chart

    let div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
    
    let header = div.append("h1")
        .text("Victim Gender in Status ")
  
      // let toolTipChart = div.append("div").attr("id", "tipChart")
      //let toolChart = div.append('svg')
      //    .attr('width', small_msm.width)
      //    .attr('height', small_msm.height)
  
      // let toolTipChart = div.append("div").attr("id", "tipChart")
      let toolChart = div.append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
          /*   toolChart.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", 25)
                .attr("y", 400)
                .text("Victim Sex");   
            toolChart.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("x", -90)
                .attr("y", -100)
                //.attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("Number of Cases"); */  


    svgContainer.selectAll(".bar")
        .data(d)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", "#f57b42")
        .on("mouseover", (d) => {
            toolChart.selectAll("*").remove()
            div.transition()
                .duration(200)
                .style("opacity", .9);
            plotGender(d.key,data,toolChart)
            div//.html("Fertility:       " + d.fertility + "<br/>" +
                    // "Life Expectancy: " + d.life_expectancy + "<br/>" +
                    // "Population:      " + numberWithCommas(d["population"]) + "<br/>" +
                    // "Year:            " + d.year + "<br/>" +
                    // "Country:         " + d.country)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 100) + "px");
            
        })
        .on("mouseout", (d) => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

          // add the x Axis
    svgContainer.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));
        
          // add the y Axis
    svgContainer.append("g")
              .call(d3.axisLeft(y));


/*         // X axis: scale and draw:
        var x = d3.scaleLinear()
            .domain([90, 122])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, width]);
        svgContainer.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(function(d) { return d["TOEFL Score"]; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(11)); // then the numbers of bins

        // And apply this function to data to get the bins
        var bins = histogram(data);

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
            .range([height, 0]);
            y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        svgContainer.append("g")
            .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        svgContainer.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "#69b3a2")*/

        })}
        function plotGender(key, data, toolChart) {

            let keyData = data.filter((row) => {return row['Status Description'] == key});

            var d = d3.nest()
            .key(function(d) {
                return d["Victim Sex"];
            })
            .rollup(function(v) {
            console.log(v.length);
                return v.length;
        
            }).entries(keyData);

    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    var y = d3.scaleLinear()
          .range([height, 0]);

    x.domain(d.map(function(d) { return d.key; }));
    y.domain([0, d3.max(d, function(d) { return d.value; })]);
    
    toolChart.selectAll(".bar")
        .data(d)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", "#b082aa")

          // add the x Axis
    toolChart.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));
        
          // add the y Axis
    toolChart.append("g")
              .call(d3.axisLeft(y));
    }

    toolChart.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", 25)
                .attr("y", 40)
                .text("Victim Sex");   
    toolChart.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("x", -90)
                .attr("y", -100)
                //.attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("Number of Cases");
})()