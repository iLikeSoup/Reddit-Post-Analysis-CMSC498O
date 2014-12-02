$(document).ready(function(){

	// Setup for the D3 bubbles
	var diameter = 960,
	    format = d3.format(",d"),
	    color = d3.scale.category20c();

	var bubble = d3.layout.pack()
	    .sort(null)
	    .size([diameter, diameter])
	    .padding(1.5);

	var svg1 = d3.select(".diagram1")
		.append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter)
	    .attr("class", "bubble");


	// Hit GitHub to retrieve the dataset
	$.ajax({
        type: "GET",
        url: "datasets/domains.csv",
        dataType: "text",
        success: function(data) { diagram1(data); }
     });
	
	function convertCSV(csvRaw){
		return $.csv.toObjects(csvRaw);
	}

	function diagram1(rawCSV)
	{
		var dataframe = convertCSV(rawCSV);
		console.log(dataframe);

		//Building the datatree to be used with D3
		var root = {};
		root.name = "Interactions";
		root.children = new Array();
		for (i=0; i < dataframe.length; i++){
			var item = {};
			item.name = dataframe[i]["domain"];
			item.value = Number(dataframe[i]["numTimesUsed"]);
			item.group = getD1Group(dataframe[i]["numTimesUsed"]);
			root.children.push(item);
		}

		var node = svg1
			.selectAll(".node")
			.data(bubble.nodes(root)
			.filter(function(d){ return !d.children;}))
			.enter()
			.append("g")
			.attr("class","node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		var color = d3.scale.category20c();

		node.append("title")
			.text(function(d) { return d.name + "\n " + format(d.value); });

		node.append("circle")
			.attr("r", function(d) { return d.r; })
			.style("fill", function(d) { return color(d.value); });

		node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.text(function(d) { return d.name.substring(0, d.r / 3); });
	}

	function getD1Group(numTimesUsed){
		var colors = ["color1"];
		return colors[0];
	}

	d3.select(self.frameElement).style("height", diameter + "px");

});

