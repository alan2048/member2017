$(function () {
	addMenu();
	winResize();
});
function addMenu() {
	var data=[{
			title:"班务管理",
			icon:"menu01",
			url:"",
			list:[{
				title:"幼儿信息",
				url:"./html/class/children.html"
			},{
				title:"班级管理",
				url:"./html/class/chass.html"
			}]
	},{
			title:"萌宝成长",
			icon:"menu02",
			url:"",
			list:[{
				title:"幼儿信息",
				url:""
			},{
				title:"幼儿信息",
				url:""
			}]
	},{
			title:"观察记录",
			icon:"menu03",
			url:"",
			list:[{
				title:"幼儿信息",
				url:""
			},{
				title:"幼儿信息",
				url:""
			}]
	},{
			title:"成长档案",
			icon:"menu04",
			url:"",
			list:[{
				title:"幼儿信息",
				url:""
			},{
				title:"幼儿信息",
				url:""
			}]
	},{
			title:"通知管理",
			icon:"menu05",
			url:"",
			list:[{
				title:"幼儿信息",
				url:""
			},{
				title:"幼儿信息",
				url:""
			}]
	},{
			title:"月周计划",
			icon:"menu06",
			url:"",
			list:[{
				title:"幼儿信息",
				url:""
			},{
				title:"幼儿信息",
				url:""
			}]
	},{
			title:"保健管理",
			icon:"menu07",
			url:"",
			list:[{
				title:"幼儿信息",
				url:""
			},{
				title:"幼儿信息",
				url:""
			}]
	},{
			title:"管理统计",
			icon:"menu08",
			url:"",
			list:[{
				title:"幼儿信息",
				url:""
			},{
				title:"幼儿信息",
				url:""
			}]
	},{
			title:"设置",
			icon:"menu09",
			url:"",
			list:[{
				title:"幼儿信息",
				url:""
			},{
				title:"幼儿信息",
				url:""
			}]
	}];
	var data01={data:data};
	var html=template("menuBox_script",data01);
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