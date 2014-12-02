$(document).ready(function(){

	var diameter = 960,
	    format = d3.format(",d"),
	    color = d3.scale.category20c();

	var bubble = d3.layout.pack()
	    .sort(null)
	    .size([diameter, diameter])
	    .padding(1.5);

	var svg = d3.select("body").append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter)
	    .attr("class", "bubble");

	var root = {};
	root.name = "Interactions";
	root.children = new Array();

	// Hit GitHub to retrieve the dataset
	$.ajax({
        type: "GET",
        url: "https://rawgit.com/JackLot/Reddit-Post-Analysis-CMSC498O/master/pulls/dataset/csvExport/domains.csv",
        dataType: "text",
        success: function(data) { processData(data); }
     });
	
	function processData(allText) {

	    var record_num = 2;  // or however many elements there are in each row
	    var allTextLines = allText.split(/\r\n|\n/);
	    var entries = allTextLines[0].split(',');
	    var lines = [];

	    var headings = entries.splice(0,record_num);
	    while (entries.length>0) {
	        var tarr = [];
	        for (var j=0; j<record_num; j++) {
	            tarr.push(headings[j]+":"+entries.shift());
	        }
	        lines.push(tarr);
	    }
	    console.log(lines);
	}

	/*for (i = 0; i < dataframe.length; i++){
		var item = {};
		item.name = dataframe[i][0];
		item.value = Number(dataframe[i][1]);
		item.group = dataframe[i][2];
		root.children.push(item);
	}*/
	
});

