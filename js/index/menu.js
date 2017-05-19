$(function () {
	// addMenu();
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
    	console.log(data);
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
// niceScroll滚动条
function chooseNiceScroll(AA,color) {
	$(AA).niceScroll({ 
    	cursorcolor: color || "#e8fcf8",//#CC0071 光标颜色 
    	cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
    	touchbehavior: true, //使光标拖动滚动像在台式电脑触摸设备 
    	cursorwidth: "5px", //像素光标的宽度 
    	cursorborder: "0", //     游标边框css定义 
    	cursorborderradius: "5px",//以像素为光标边界半径 
    	autohidemode: true //是否隐藏滚动条 
	});
};