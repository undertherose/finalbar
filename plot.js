"use-strict";

let data = "";
let svgContainer = ""; // keep SVG reference in global scope
let popChartContainer = "";
const msm = {
    width: 1000,
    height: 800,
    radius: 300,
    marginAll: 50,
    marginLeft: 50,
}
const small_msm = {
    width: 800,
    height: 500,
    marginAll: 100,
    marginLeft: 80
}

// load data and make scatter plot after window loads
window.onload = function () {

    svgContainer = d3.select("#pie")
        .append('svg')
        .attr('width', msm.width)
        .attr('height', msm.height)
        .append("g")
            .attr("transform", "translate(" + msm.width / 2 + "," + msm.height / 2 + ")");
    svgContainer.append("g")
            .attr("class", "slices");
        svgContainer.append("g")
            .attr("class", "labels");
        svgContainer.append("g")
            .attr("class", "lines");

    svgB = d3.select("#chart")
    .append("svg")
    .attr("width", msm.width+200)
    .attr("height",msm.height+200)
    .append("g").attr("class", "container")
    .attr("transform", "translate("+ 100 +","+ 100 +")");

    popChartContainer = d3.select("#popChart")
        .append('svg')
        .attr('width', msm.width)
        .attr('height', msm.height);
    
    //var labelArc = d3.svg.arc()
    //    .outerRadius(radius - 40)
     //   .innerRadius(radius - 40);
    //
    // d3.csv is basically fetch but it can be be passed a csv file as a parameter
    d3.csv("data.csv")
        .then((d) => plotData(d))
}

function plotData(csvData) {
    let keyData = d.filter((row) => {return row['Status Description'] == "Ivest Cont"});

    var data = d3.nest()
    .key(function(d) {
        return d["Victim Sex"];
    })
    .rollup(function(v) {
        console.log(v.length);
        return v.length;
        
    }).entries(csvData);
    makeBar(data, csvData);
    //plotGender("Invest Cont", csvData,svgContainer);
}

function makePie(csvData) {
    
    var data1 = [{"letter":"q","presses":1},{"letter":"w","presses":5},{"letter":"e","presses":2}];
    var data2 = [26,25,10,30,30,50,33,56,38];
    var crimes = d3.csv(csvData, function(d) {
        return {
            d1: d['Date Occurred'],
            one: d['One']
        };
    })
    console.log('aaa');
    console.log("a", crimes);

    var data = d3.nest()
    .key(function(d) {
        return d["Status Description"];
    })
    .rollup(function(v) {
        console.log(v.length);
        return v.length;
        
    }).entries(csvData);
    
    console.log("s", data);

    data.forEach(function(d) {
        d.percentage = d.values  / 4129;
        console.log(d.percentage);
    });

    makeBar(data);
    var width = 300,
	height = 300,
	// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
    radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal()
    .range(["#2C93E8","#838690","#F56C4E", "#4E79A7",
    "#A0CBE8", "#f57b42",]);
    
    var pie = d3.pie()
    .value(function(d) { return d.value; })(data);
    
    var arc = d3.arc()
	.outerRadius(radius - 10)
	.innerRadius(0);

    var labelArc = d3.arc()
	.outerRadius(radius * 0.4)
    .innerRadius(radius);

/*     let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // let toolTipChart = div.append("div").attr("id", "tipChart")
    let toolChart = div.append('svg')
        .attr('width', small_msm.width)
        .attr('height', small_msm.height) */
    


var g = svgContainer.selectAll("arc")
	.data(pie)
	.enter().append("g")
	.attr("class", "arc");

    g.append("path")
	.attr("d", arc)
    .style("fill", function(d) { return color(d.data.key);})
    .on("mouseover", (d) => {
        toolChart.selectAll("*").remove()
        div.transition()
            .duration(200)
            .style("opacity", .9);
        plotGender(d.data.key,csvData, toolChart)
        div//.html("Fertility:       " + d.fertility + "<br/>" +
                // "Life Expectancy: " + d.life_expectancy + "<br/>" +
                // "Population:      " + numberWithCommas(d["population"]) + "<br/>" +
                // "Year:            " + d.year + "<br/>" +
                // "Country:         " + d.country)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        
    })
    .on("mouseout", (d) => {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });
    
    g.append("text").data(pie)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .style("fill", "#111")

      .attr("transform", function(d){
        var pos = labelArc.centroid(d);
        pos[0] = msm.radius * (midAngle(d) < Math.PI ? 1 : -1);

        return "translate("+ pos +")";
      })
      .text(function(d) {
          console.log(d.data.key);
        return d.data.key;
      });

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    var polyline = g.selectAll("polyline")
      .data(pie, function(d) {
        console.log(d);
        return d.data.key
      })
      .enter()
      .append("polyline")
      .attr("points", function(d) {
        console.log(d);
        var pos = labelArc.centroid(d);
            pos[0] = msm.radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        console.log([arc.centroid(d), labelArc.centroid(d), pos])    
        return [arc.centroid(d), labelArc.centroid(d), pos];
      })
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "2px");


   /*  g.append("text")
	.attr("transform", function(d) { var c = labelArc.centroid(d);
        return "translate(" + c[0]*1.2 +"," + c[1]*1.2 + ")";})
	.text(function(d) { return d.data.key;})
    .style("fill", "#fff"); */

/*     var text = svgContainer.select(".labels").selectAll("text")
    .data(data.key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return d.data.label;
    });
    
    var polyline = svgContainer.select(".lines").selectAll("polyline")
		.data(data.key);
	
	polyline.enter()
		.append("polyline"); */
}

function plotGender(key, d, toolChart) {
    let keyData = d.filter((row) => {return row['Status Description'] == key});
    var data = d3.nest()
    .key(function(d) {
        return d["Victim Sex"];
    })
    .rollup(function(v) {
        console.log(v.length);
        return v.length;
        
    }).entries(keyData);
    
    console.log("s", data);

    data.forEach(function(d) {
        d.percentage = d.values  / keyData.length;
        console.log(d.percentage);
    });

    var x = d3.scaleBand()
          .range([0, small_msm.width])
          .padding(0.1);
    var y = d3.scaleLinear()
          .range([small_msm.height, 0]);
    x.domain(d.map(function(d) { return d.key; }));
    y.domain([0, d3.max(d, function(d) { return d.value; })]);

    toolChart.selectAll(".bar")
        .data(d)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { console.log('aa', d);return y(d.value); })
        .attr("height", function(d) { return 500 - y(d.value)});
        
          // add the x Axis
    toolChart.append("g")
              .attr("transform", "translate(0," +small_msm.height + ")")
              .call(d3.axisBottom(x));
        
          // add the y Axis
    toolChart.append("g")
              .call(d3.axisLeft(y));

    /* data = data.sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    })

    //set up svg using margin conventions - we'll need plenty of room on the left for labels

    var svg = toolChart.append("svg")
        .attr("width", 1000)
        .attr("height", 700)
        .append("g")
        .attr("transform", "translate(" + small_msm.marginAll + "," + small_msm.marginAll + ")");

    var x = d3.scaleLinear()
        .range([0, small_msm.width])
        .domain([0, d3.max(data, function (d) {
            return d.value;
        })]);

    var y = d3.scaleOrdinal()
        .range([small_msm.height, 0], .1)
        .domain(data.map(function (d) {
            return d.key;
        }));

    //var xAxis = d3.axisBottom(xRange).tickFormat(function(d){ return d.x;});
    var yAxis = d3.axisLeft(y).tickSize(0);

    //make y axis to show bar names
    //var yAxis = d3.svg.axis()
     //   .scale(y)
     //   //no tick marks
     //   .tickSize(0)
     //   .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")

    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.key);
        })
        .attr("height", y.range())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.value);
        });

    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.key) + y.range() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.value) + 3;
        })
        .text(function (d) {
            return d.value;
        }); */
}

function makeBar(d, c) {
    
    var x = d3.scaleBand()
          .range([0, msm.width])
          .padding(0.1);
    var y = d3.scaleLinear()
          .range([msm.height, 0]);
    x.domain(d.map(function(d) { return d.key; }));
    y.domain([0, d3.max(d, function(d) { return d.value; })]);
        
    //d.forEach(function(d) {
    //   d.key = +d.key;
    //});
          // append the rectangles for the bar chart

          let div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
  
      // let toolTipChart = div.append("div").attr("id", "tipChart")
      let toolChart = div.append('svg')
          .attr('width', small_msm.width)
          .attr('height', small_msm.height)

    svgB.selectAll(".bar")
        .data(d)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return msm.height - y(d.value); })
        .style("fill", '#f57b42')
        .on("mouseover", (d) => {
            toolChart.selectAll("*").remove()
            div.transition()
                .duration(200)
                .style("opacity", .9);
            plotGender(d.key,c,toolChart)
            div//.html("Fertility:       " + d.fertility + "<br/>" +
                    // "Life Expectancy: " + d.life_expectancy + "<br/>" +
                    // "Population:      " + numberWithCommas(d["population"]) + "<br/>" +
                    // "Year:            " + d.year + "<br/>" +
                    // "Country:         " + d.country)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            
        })
        .on("mouseout", (d) => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
        
          // add the x Axis
    svgB.append("g")
              .attr("transform", "translate(0," + msm.height + ")")
              .call(d3.axisBottom(x));
        
          // add the y Axis
    svgB.append("g")
              .call(d3.axisLeft(y));


}