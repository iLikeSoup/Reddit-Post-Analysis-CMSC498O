function getSVGHeight(){
	if($( window ).height() > 960){
		return 960;
	}else{
		return $( window ).height();
	}
}