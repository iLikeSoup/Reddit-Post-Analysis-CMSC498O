$(document).ready(function(){

	var margin = {top: 0, right: 0, bottom: 30, left: 30};
	var width = $(".titleChart").width();
	var height = getSVGHeight()/2 - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangeRoundBands([0, width]);

	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom");

	var yAxis = d3.svg.axis().scale(y).orient("left");

	var svg = d3.select(".titleChart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		  	.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// numChars,avgScore,numWords,avgComments,avgRank
	d3.csv("datasets/title.csv", type, function(error, data) {

		console.log(data);

		data.sort(function(a,b){
			return parseInt(a.numChars) - parseInt(b.numChars)
		});

		x.domain(data.map(function(d) { return d.numChars; }));
		y.domain([0, d3.max(data, function(d) { return d.avgRank; })]);

		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		      .selectAll("text")
			      .style("text-anchor", "end")
			      .attr("dx", "-1em")
			      .attr("dy", "-.55em")
			      .attr("transform", "rotate(-90)" );

		svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".9em")
		      .style("text-anchor", "end");

		svg.selectAll(".bar")
		  .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.numChars); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.avgRank); })
		      .attr("height", function(d) { return height - y(d.avgRank); })
		      .attr("title", function(d) { return "#Characters: " + d.numChars + ", \n avgRank: " + d.avgRank; });

		//Listener for the toggle button click
		$(".titlebtn").click(function(){
			$(this).addClass("active").siblings().removeClass("active");
			$(".titleKey #titleytext").text($(this).attr("ylabel"));
			redrawBars($(this).attr("att"));

		});

		function redrawBars(yattribute){

			y.domain([0, d3.max(data, function(d) { return d[yattribute]; })]);

			svg.selectAll("g.y.axis")
			  .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".9em")
			      .style("text-anchor", "end");

			// Redraw the height of the bars
			svg.selectAll("rect")
				.data(data)
				.transition()
				.duration(1000)
				.attr("y", function(d) { return y(d[yattribute]); })
			    .attr("height", function(d) { return height - y(d[yattribute]); })
			    .attr("title", function(d) { return "#Characters: " + d.numChars + ", \n" + d[yattribute] + ": " + d[yattribute]; });
		}

	});

	function type(d) {
	  d.avgUpvotes = +d.avgUpvotes;
	  return d;
	}

});