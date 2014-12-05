$(document).ready(function(){
	/*$('body').tooltip({
    	'selector': 'circle',
    	'container': 'body',
    	'placement': 'top'
	});*/
});

function getSVGHeight(){
	if($( window ).height() > 960){
		return 900;
	}else{
		return $( window ).height();
	}
}