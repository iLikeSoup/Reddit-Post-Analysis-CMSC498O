$(document).ready(function(){

	$('.titleChart').tooltip({
    	'selector': 'rect',
    	'container': 'body',
    	'placement': 'top'
	});

	$('.rankChart').tooltip({
    	'selector': 'rect',
    	'container': 'body',
    	'placement': 'top'
	});

	$('.domainBubbles').tooltip({
    	'selector': 'g.node',
    	'container': 'body',
    	'placement': 'top'
	});

});

function getSVGHeight(){
	if($( window ).height() > 960){
		return 900;
	}else{
		return $( window ).height();
	}
}