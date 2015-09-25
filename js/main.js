var margin = {top: 20, right: 20, bottom: 40, left: 20};

/*  
showGraphic 
    selector - a css selector, that specifies a svg or html node
    
changes the opacity of the given node to 1
*/
function showGraphic(selector) {
    d3.select(selector).transition().duration(500).style("opacity", 1);
}

var translateHandedness = {
        "R": "right",
        "L": "left",
        "B": "both"
    };

/*
groupAvgsByHandedness
    baseballData - json derived from baseball data csv
    attribute - an attribute of the dataset records - such as "handedness"

Example Output: JSON for "handedness"
{
    "R": datasetPart1,
    "L": datasetPart2,
    ...
}
*/
function groupDatasetByAttribute(baseballData, attribute) {
    var result = {}
    for (var iterator in baseballData) {
        dataRecord = baseballData[iterator];
        if (dataRecord[attribute] in result) {
            result[dataRecord[attribute]].push(dataRecord);
        } else {
            result[dataRecord[attribute]] = [dataRecord];
        }
    }
    return result;
}

/*
selectAttributeFromData
    array - array of JSON Objects
    atrribute - an attribute that every of the Objects in the array have

Input:
    array = [{a: 1, b:1}, {a:2, b:3}, {a:3, b:5}, ..]
    atrribute = a

Output:
    [1, 2, 3]
*/
function selectAttributeFromData(array, attribute) {
    return array.map(function(e){
        return e[attribute];
    });
}

/*
selectAttributeFromGroupedData

Input:
    groupData = {
        r: [{a:1, b:1}, {a:2, b:3}, {a:3, b:5}, ..],
        l: [{a:1, b:1}, {a:2, b:3}, {a:3, b:5}, ..],
        b: [..]
    }
    attribute = a

Output:
    {
        r: [1, 2, 3],
        l: [1, 2, 3],
        ..
    }
*/
function selectAttributeFromGroupedData(groupData, attribute) {
    result = {}
    for (var group in groupData) {
        result[group] = selectAttributeFromData(groupData[group], attribute);
    }
    return result;
}

function ungroupData(groupData) {
    result = [];
    for (var group in groupData) {
        result = result.concat(groupData[group]);
    }
    return result;
}

function histPlotHandedness(baseballData) {
    var width = document.getElementById("histogram").offsetWidth - margin.left - margin.right,
        height = document.getElementById("histogram").offsetHeight - margin.top - margin.bottom,
        binCount = 40;
    
    // helper: to map the real x values to the pixel x values in the svg
    var x = d3.scale.linear()
        //.domain([0.05, 0.35])
        .domain([0.1, 0.35])
        .range([0, width]);

    // histograms show the distribution of values, the datasets contains continous average batting values
    // thus, we need to categorize the average values into bins, d3 provides binning given an array of numbers
    var avgsPerHandedness = groupDatasetByAttribute(baseballData, "handedness");
        avgsPerHandedness = selectAttributeFromGroupedData(avgsPerHandedness, "avg");

    // hist: function that counts occurences for each bin and returns a new data object
    // loop it since we have one histogram for each handedness
    var hist = d3.layout.histogram().bins(x.ticks(binCount));
    var histDataPerHandedness = {};
    for (var handedness in avgsPerHandedness) {
        histDataPerHandedness[handedness] = hist(avgsPerHandedness[handedness]);
    }

    var y = d3.scale.linear()
        // find the maximum y-value of all the histograms and use this as upper level for domain
        .domain([0, d3.max(selectAttributeFromData(ungroupData(histDataPerHandedness), 'y'))])
        .range([height, 0]);

    // create the svg 
    var svg = d3.select("#histogram")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate("+ margin.left +", 0)");

    // the svg.area() and line() methods help to generate a continous surface
    // the resulting functions (var area, var line) provide for every visible (rendered)
    // x value the y value
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
    var i = 0;
    for (var handedness in histDataPerHandedness) {
        var hand = translateHandedness[handedness],
            data = histDataPerHandedness[handedness],
            mean = d3.mean(avgsPerHandedness[handedness]);
            subGraphic = svg.append('g').attr("class", "batting_average " + hand);

        d3.select(".hist > .mean."+hand+" > span").text(mean.toFixed(3));

        // add the histogram area 
        // and a line to make it look better
        subGraphic.append("path")
            .attr("class", "area")
            .attr("d", area(data))
        subGraphic.append("path")
            .attr("class", "line")
            .attr("d", line(data));

        // add the vertical line indicating the mean
        // unlike for line and area, we set the x and y positions ourselves
        // the y2 depends on i in order to indent the text differently
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
            .text("mean( " + hand + " ) = " + mean.toFixed(3));

        i += 1;
    };

    // helper: will generate an x axis for the x scale
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
}

function ranking (baseballData) {
    var width = document.getElementById("ranking").offsetWidth - margin.left - margin.right,
        height = document.getElementById("ranking").offsetHeight - margin.top - margin.bottom,
        barHeight = 30,
        // nameWidth reserves the (x) space for the names - some kind of offset
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