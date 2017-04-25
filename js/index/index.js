$(function () {
	winResize();
});
function winResize() {
	var fs=$(window).width()/19.2;
	if(fs >100){
		fs=100
	};
	$("html").css("font-size",fs);
	$(window).resize(function () {
		var fs01=$(window).width()/19.2;
		if(fs01 >100){
			fs01=100
		};
		$("html").css("font-size",fs01);
	});
};