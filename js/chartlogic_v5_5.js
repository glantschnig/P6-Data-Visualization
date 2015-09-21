// add new svg(parentSelector, width, height)

var svg = dimple.newSvg("#chartContainer", 1180, 600);
d3.csv("baseball_data.csv", function(data) {

    // to ensure one iteration for the animation
    var selectedBMI = 1;
    // set the BMI area for filtering
    var BMIArray = ["21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];

    // Filter for BMI
    data = dimple.filterData(data, "BMI", BMIArray);

    // Create the indicator chart on the right of the main chart
    // BMI to filter, length by HR
    var indicator = new dimple.chart(svg, data);

    // Pick blue as the default and orange for the selected month
    var defaultColor = indicator.defaultColors[0];
    var indicatorColor = indicator.defaultColors[2];

    // The frame duration for the animation in milliseconds
    var frame = 2000;

    var firstTick = true;

    // Place the indicator bar chart to the right
    // setBounds(x, y, width, height)-Set size of the plot within svg
    indicator.setBounds(900, 49, 153, 511);

    // Add dates along the y axis
    var y = indicator.addCategoryAxis("y", ["BMI"]);
    y.addOrderRule("BMI", "Asc");

    // Use sales for bar size and hide the axis
    var x = indicator.addMeasureAxis("x", ["HR"]);
    x.hidden = true;

    // Add the bars to the indicator and add event handlers
    var s = indicator.addSeries(null, dimple.plot.bar);
    s.addEventHandler("click", onClick);
    
    // Draw the side chart
    indicator.draw();

    // Remove the title from the y axis
    y.titleShape.remove();

    // Remove the lines from the y axis
    y.shapes.selectAll("line,path").remove();

    // Move the y axis text inside the plot area
    y.shapes.selectAll("text").style("text-anchor", "start")
    	.style("font-size", "11px")
    	.attr("transform", "translate(18, 0.5)");

    // adds the legend title. I put it into a d3 data
    svg.selectAll("title_text").data(["BMI distribution", "by Home Runs.", "Click on numbers to filter"])
    	.enter().append("text").attr("x", 900).attr("y", function(d, i) {
        return 15 + i * 12;
    })
    	.style("font-family", "sans-serif")
    	.style("font-size", "10px")
    	.style("color", "Black")
    	.text(function(d) {
        return d;
    });

    // Manually set the bar colors
    s.shapes.attr("rx", 10).attr("ry", 10).style("fill", function(d) {
        return (d.y === '21' ? indicatorColor.fill : defaultColor.fill)
    }).style("stroke", function(d) {
        return (d.y === '21' ? indicatorColor.stroke : defaultColor.stroke)
    }).style("opacity", 0.4);

    // Draw the main chart
    bubbles = new dimple.chart(svg, data);
    bubbles.setBounds(60, 50, 820, 510);

    bubblesX = bubbles.addMeasureAxis("x", ["avg"]);
    // use title property to adjust display text
    bubblesX.title = "average";
    bubblesX.overrideMin = 0.1;
    bubblesX.overrideMax = 0.32;
    bubblesX.showGridlines = false;

    bubblesY = bubbles.addLogAxis("y", "HR", 2);
    bubblesY.title = "Home Run";
    bubblesY.overrideMax = 1024;
    bubblesY.showGridlines = true;
    
    BaseballPlayer = bubbles.addSeries(["name", "BMI", "handedness"], dimple.plot.bubble);
    // use afterdraw to manipulate the chart apperance
    BaseballPlayer.afterDraw = function(shape, data) {
        d3.select(shape).attr("r", "8");
		bubblesY.shapes.selectAll("line,path").remove();
        // add the log 2 scale numbers
        var i = 0;
        bubblesY.shapes.selectAll("text.dimple-custom-axis-label")[0].forEach(function(e){
            e.textContent = i;
            i = i < 1 ? i + 1 : i * 2;
        });
    };
    // set the colors and opacity
    bubbles.addLegend(60, 10, 410, 60);
    bubbles.assignColor("Right", "#008744", "#008744", 0.5);
    bubbles.assignColor("Left", "#0057e7", "#0057e7", 0.5);
    bubbles.assignColor("Both", "#ffa700", "#ffa700", 0.5);

    // Draw the bubble chart
    bubbles.draw();
	bubbles.svg.selectAll("line").attr("stroke-dasharray", "10,10");
    
    bubbles.legends = [];

    // On click of the side chart
    function onClick(e) {
        activate(e.yValue);
    }

    function activate(BMI) {
        BaseballPlayer.data = dimple.filterData(data, "BMI", [BMI]);
        bubbles.draw();

        // Color all shapes the same
        s.shapes.transition().duration(250 / 2).style("fill", function(d) {
            return (d.y === BMI ? indicatorColor.fill : defaultColor.fill)
        }).style("stroke", function(d) {
            return (d.y === BMI ? indicatorColor.stroke : defaultColor.stroke)
        });
    }

    activate(BMIArray[0]);
	// run the animation	
    setInterval(function(){ if (selectedBMI < BMIArray.length) {activate(BMIArray[selectedBMI]); selectedBMI = selectedBMI + 1;} }, frame);
});
