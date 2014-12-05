$(document).ready(function(){

	// Setup for the D3 bubbles
	var diameter = getSVGHeight();
	var format = d3.format(",d");
	var color = d3.scale.category10();
	var duration = 500;
	var delay = 0;
	var toggleAttr = "numTimesUsed";
	var currentTree = {}; //Keep track of the current dataset being used in the visualization

	var bubble = d3.layout.pack()
	    .sort(null)
	    .size([diameter, diameter])
	    .padding(2);

	var svg1 = d3.select(".domainBubbles")
		.append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter)
	    .attr("class", "bubble");

	// Objects for reading and storing data from the CSV in correct formats
	var typeTotals = {
		image: { numTimesUsed: 0, avgComments: 0, avgRank: 0, avgScore: 0, numDomains: 0 },
		video: { numTimesUsed: 0, avgComments: 0, avgRank: 0, avgScore: 0, numDomains: 0 },
		webpage: { numTimesUsed: 0, avgComments: 0, avgRank: 0, avgScore: 0, numDomains: 0 },
		selfpost: { numTimesUsed: 0, avgComments: 0, avgRank: 0, avgScore: 0, numDomains: 0 }
	};

	var typeRoot = { name: "Types", children: [] };

	var domainRoots = {
		image: { name: "Images", children: [] },
		video: { name: "Videos", children: [] },
		webpage: { name: "Webpages", children: [] },
		selfpost: { name: "Selfposts", children: [] }
	};
	

	// Read in the CSV
	// CSV headers: domain, type, numTimesUsed, avgComments, avgRank, avgScore
	// ---------------------------------------------------------------------------------------------------
	d3.csv("datasets/domains.csv", function(error, data) {

		createTrees(data);
		currentTree = typeRoot;

		// Create initial bubbles representing types of posts
		var node = svg1
			.selectAll(".node")
			.data(bubble.nodes(typeRoot)
				.filter(function(d){ return !d.children;})
			);

		node.enter() // Here is where the original data is entered
			.append("g")
			.attr("class","node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.append("title")
			.text(function(d) { return d.name + "\n " + format(d.value); })
			//.attr("title", function(d){ return d.name });

		node.append("title")
			.text(function(d) { return d.name + "\n " + format(d.value); });

		node.append("circle")
			.attr("r", function(d) { return d.r; })
			.style("fill", function(d) { return color(d.group); })
			.on("click", function(d) { // Onclick redraw the bubbles
		        console.log(d.child)
		        redrawDiagram(d.child);
		        $("#domainKey").text(d.name.charAt(0).toUpperCase() + d.name.slice(1) + "s");
		       	$(".resetBTN").show();
		    });

		node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.text(function(d) { return d.name.substring(0, d.r / 3); });

		$('.gobackbtn').click(function(){
			redrawDiagram(typeRoot);
			$("#domainKey").text("Post types");
			$(".resetBTN").hide();
		});

		// Update the bubbles with the selected attribute
		$(".domainbtn").click(function(){
			$(this).addClass("active").siblings().removeClass("active");
			toggleAttr = $(this).attr("att");
			redrawDiagram(currentTree);
		});

	});

	// Redraw bubbles with new dataset
	function redrawDiagram(data)
	{
		currentTree = data;

		// Rewrite data to use the correct attribute
		for (i = 0; i < data.children.length; i++)
		{
			var entry = data.children[i];
			entry.value = Number(entry.original[toggleAttr]);
		}

		var node = svg1
			.selectAll(".node")
			.data(bubble.nodes(data)
				.filter(function(d){ return !d.children;})
			);

		var nodeEnter = node.enter() // Here is where the original data is entered
			.append("g")
			.attr("class","node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			//.attr("title", function(d){ return d.name });

			nodeEnter.append("title")
				.text(function(d) { return d.name + "\n " + format(d.value); });

			nodeEnter.append("circle")
				//.attr("title", function(d) { return d.name + " : " + d.value; })
				.attr("r", function(d) { return d.r; })
				.style("fill", function(d) { return color(d.group); })

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

	function createTrees(data)
	{
		// Sum up the totals for each domain type
		// Post processing will take care of averaging out the '/avg.*/' columns
		for (i = 0; i < data.length; i++)
		{
			var entry = data[i];

			typeTotals[entry.type].numTimesUsed += parseInt(entry.numTimesUsed);
			typeTotals[entry.type].avgComments += parseInt(entry.avgComments);
			typeTotals[entry.type].avgRank += parseInt(entry.avgRank);
			typeTotals[entry.type].avgScore += parseInt(entry.avgScore);
			typeTotals[entry.type].numDomains += 1;

			// Build out the csv entry item and add it to the appropriate root
			var item = {};
			item.name = entry.domain;
			item.value = Number(entry.numTimesUsed);
			item.group = Number(entry.numTimesUsed);
			item.original = entry;
			domainRoots[entry.type].children.push(item);

		}

		// Create the initial tree of domain types
		for (var property in typeTotals) 
		{
			var item = {};
			var type = typeTotals[property];

			// Finalize the '/avg.*/' property calculation
			type.avgComments /= type.numDomains;
			type.avgRank /= type.numDomains;
			type.avgScore /= type.numDomains;

			item.name = property;
			item.value = Number(type.numTimesUsed);
			item.group = Number(type.numTimesUsed);
			item.original = type;
			item.child = domainRoots[property];
			typeRoot.children.push(item);
		}
	}

	d3.select(self.frameElement).style("height", diameter + "px");

});

