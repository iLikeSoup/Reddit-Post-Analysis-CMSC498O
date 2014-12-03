$(document).ready(function(){

	// Setup for the D3 bubbles\

	var diameter = getSVGHeight() - 25;
	var format = d3.format(",d");
	var color = d3.scale.category20c();
	var duration = 600;
	var delay = 0;

	var bubble = d3.layout.pack()
	    .sort(null)
	    .size([diameter, diameter])
	    .padding(3);

	var svg1 = d3.select(".diagram2")
		.append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter)
	    .attr("class", "bubble");

	var dataframe = [];

	// Hit GitHub to retrieve the dataset
	$.ajax({
        type: "GET",
        url: "datasets/subreddits.csv",
        dataType: "text",
        success: function(data) { drawDiagramSetDataframe(data, "numComments"); }
     });
	
	function convertCSV(csvRaw){
		return $.csv.toObjects(csvRaw);
	}

	function drawDiagramSetDataframe(rawCSV, attribute){
		dataframe = convertCSV(rawCSV);

		var node = svg1
			.selectAll(".node")
			.data(bubble.nodes(getRoot(dataframe, attribute))
				.filter(function(d){ return !d.children;})
			);

		node.enter() // Here is where the original data is entered
			.append("g")
			.attr("class","node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.append("title")
			.text(function(d) { return d.name + "\n " + format(d.value); });

		node.append("title")
			.text(function(d) { return d.name + "\n " + format(d.value); });

		node.append("circle")
			.attr("r", function(d) { return d.r; })
			.style("fill", function(d) { return color(d.group); });

		node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.text(function(d) { return d.name.substring(0, d.r / 3); });

		//redrawDiagram(attribute);
	}

	function redrawDiagram(attribute)
	{

		console.log(attribute);

		var node = svg1
			.selectAll(".node")
			.data(bubble.nodes(getRoot(dataframe, attribute))
				.filter(function(d){ return !d.children;})
			);

		var nodeEnter = node.enter() // Here is where the original data is entered
			.append("g")
			.attr("class","node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

			nodeEnter.append("title")
				.text(function(d) { return d.name + "\n " + format(d.value); });

			nodeEnter.append("circle")
				.attr("r", function(d) { return d.r; })
				.style("fill", function(d) { return color(d.group); });

			nodeEnter.append("text")
				.attr("dy", ".3em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.name.substring(0, d.r / 3); });

		node.transition()
			.duration(duration)
			.delay(function(d, i) {delay = i * 7; return delay;}) 
			.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
			.attr('r', function(d) { return d.r; })
			.style('opacity', 1); // force to 1, so they don't get stuck below 1 at enter()

		node.select("circle")
	        .transition().duration(1000)
	        .attr("r", function (d) { return d.r; })

	    node.select("text")
	    	.text(function(d) { return d.name.substring(0, d.r / 3); });

		node.exit()
			.transition()
			.duration(duration + delay)
			.style('opacity', 0)
			.remove();

	}

	function getD1Group(numTimesUsed){
		var colors = ["color1"];
		return colors[0];
	}

	function getRoot(dataframe, attribute){

		var root = {};
		root.name = "Interactions";
		root.children = new Array();

		for (i=0; i < dataframe.length; i++){
			var item = {};
			item.name = dataframe[i]["subreddit"];
			item.value = Number(dataframe[i][attribute]);
			item.group = Number(dataframe[i]["numComments"]);
			root.children.push(item);
		}

		console.log(root);
		return root;
	}

	d3.select(self.frameElement).style("height", diameter + "px");

	// Update the bubbles with the selected attribute
	$(".d2btn").click(function(){
		redrawDiagram($(this).attr("att"));
	});

});

