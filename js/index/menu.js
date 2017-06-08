$(function () {
	menuList_port();
	winResize();
});
// 左侧 菜单接口
function menuList_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuList,param,menuList_callback);
};
function menuList_callback(res) {
    if(res.code==200){
    	var data={
    			arr:JSON.parse(res.data),
    			path_img:httpUrl.path_img
    	};
		var html=template("menuBox_script",data);
		$("#menuBox").empty().append(html);
		$("#menuBox").on({
			mouseover:function () {
				$(this).addClass("active").siblings().removeClass("active");
			},
			mouseout:function () {
				$(this).removeClass("active").siblings().removeClass("active");
			}
		},">li.has-list");
		chooseNiceScroll(".hasBox");
    };
};

function winResize() {
	var fs=$(window).width()/19.2;
	$("html").css("font-size",fs);
	$("#page-loader").addClass("hide");
	$(window).resize(function () {
		var fs01=$(window).width()/19.2;
		$("html").css("font-size",fs01);
	});
};