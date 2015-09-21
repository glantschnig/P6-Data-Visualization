var margin = {top: 20, right: 20, bottom: 40, left: 20};

function showGraphic(selector) {
    d3.select(selector).transition().duration(500).style("opacity", 1);
}

var handedness = ['R', 'L', 'B'],
    translateHandedness = {
        "R": "right",
        "L": "left",
        "B": "both"
    };

function histPlotHandedness(baseballData) {
    var width = document.getElementById("histogram").offsetWidth - margin.left - margin.right,
        height = document.getElementById("histogram").offsetHeight - margin.top - margin.bottom;

    var avgsPerHandedness = [];

    for (var i = 0; i < handedness.length; i++) {
        var avgs = baseballData.filter(function(e){
            return e.handedness === handedness[i];
        }).map(function(e) { return parseFloat(e.avg); });
        avgsPerHandedness.push(avgs);
    }

    var binCount = 40;
    
    var x = d3.scale.linear()
        //.domain([0.05, 0.35])
        .domain([0.1, 0.35])
        .range([0, width]);

    // binning
    var hist = d3.layout.histogram().bins(x.ticks(binCount));
    var data = [
        hist(avgsPerHandedness[0]),
        hist(avgsPerHandedness[1]),
        hist(avgsPerHandedness[2])
    ];

    var y = d3.scale.linear()
        // find largest occurence of one bin
        .domain([0, d3.max(data, function(d) { return d3.max(d, function(e) { return e.y; }); })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select("#histogram")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate("+ margin.left +", 0)");

    var area = d3.svg.area()
        .interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y0(height)
        .y1(function(d) { return y(d.y); });

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    // add graph for each hand
    for (var i = 0; i < data.length; i++) {
        var hand = translateHandedness[handedness[i]],
            mean = d3.mean(avgsPerHandedness[i]);
            subGraphic = svg.append('g').attr("class", "batting_average " + hand);

        d3.select(".hist > .mean."+hand+" > span").text(mean.toFixed(3));

        subGraphic.append("path")
            .attr("class", "area")
            .attr("d", area(data[i]))
        subGraphic.append("path")
            .attr("class", "line")
            .attr("d", line(data[i]));
        
        subGraphic.append("line")
            .attr("class", "mean")
            .attr("y1", 0)
            .attr("y2", height + 20 + i*14)
            .attr("x1", x(mean))
            .attr("x2", x(mean))
        subGraphic.append("text")
            .attr("class", "mean")
            .attr("y", height + 30 + i*14)
            .attr("x", x(mean))
            .text("µ( " + hand + " ) = " + mean.toFixed(3));
    };

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
}

function ranking (baseballData) {
    var width = document.getElementById("ranking").offsetWidth - margin.left - margin.right,
        height = document.getElementById("ranking").offsetHeight - margin.top - margin.bottom,
        barHeight = 30,
        nameWidth = 100;

    var data = baseballData.sort(function(a, b){
        return b.avg - a.avg;
    }).slice(0, 10);

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(e){ return parseFloat(e.avg); })])
        .range([0, width - nameWidth]);
    
    var svg = d3.select("#ranking")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate("+ margin.left +", 0)");

    var position = svg.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", function(d){ return translateHandedness[d.handedness]; })
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    position.append("rect")
        .attr("x", nameWidth)
        .attr("width", function(e){ return x(e.avg); })
        .attr("height", barHeight - 1);

    position.append("text")
        .attr("class", "name")
        .attr("x", 0)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

    position.append("text")
        .attr("class", "avg")
        .attr("x", nameWidth + 10)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return translateHandedness[d.handedness] + " - avg: " + d.avg; });
}

d3.csv("data/baseball_data.csv", function(baseballData) {
    histPlotHandedness(baseballData);
    ranking(baseballData);

    window.setTimeout(function(){showGraphic("g.right")}, 0);
    window.setTimeout(function(){showGraphic("g.both")}, 2000);
    window.setTimeout(function(){showGraphic("g.left")}, 4000);
    window.setTimeout(function(){showGraphic("#ranking")}, 6000);
});