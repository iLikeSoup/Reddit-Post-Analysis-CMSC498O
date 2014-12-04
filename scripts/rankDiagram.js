$(document).ready(function(){

	var margin = {top: 0, right: 10, bottom: 30, left: 40};
	var width = $(".rankChart").width();
	var height = getSVGHeight()/2 - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom");

	var yAxis = d3.svg.axis().scale(y).orient("left");

	var svg = d3.select(".rankChart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		  	.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("datasets/rank.csv", type, function(error, data) {

		x.domain(data.map(function(d) { return d.rank; }));
		y.domain([0, d3.max(data, function(d) { return d.avgUpvotes; })]);

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
		      //.text("Average # of upvotes");

		svg.selectAll(".bar")
		  .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.rank); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.avgUpvotes); })
		      .attr("height", function(d) { return height - y(d.avgUpvotes); });

		//Listener for the toggle button click
		$(".rtbtn").click(function(){
			$(this).addClass("active").siblings().removeClass("active");
			$(".rtKey #rtytext").text($(this).attr("ylabel"));
			redrawBars($(this).attr("att"));

		});

		function redrawBars(yattribute){

			// Redraw the height of the bars
			svg.selectAll("rect")
				.data(data)
				.transition()
				.duration(1000)
				.attr("y", function(d) { return y(d[yattribute]); })
			    .attr("height", function(d) { return height - y(d[yattribute]); });
		}

	});

	function type(d) {
	  d.avgUpvotes = +d.avgUpvotes;
	  return d;
	}

});