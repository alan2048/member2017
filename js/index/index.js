$(function () {
	winResize();
});
function winResize() {
	var fs=$(window).width()/19.2;
	$("html").css("font-size",fs);
	$(window).resize(function () {
		var fs01=$(window).width()/19.2;
		$("html").css("font-size",fs01);
	});
};