$(function () {
	winResize();// 窗口
	login();// 登录函数
});
function winResize() {
	var fs=$(window).width()/19.2;
	$("html").css("font-size",fs);
	$("#page-loader").addClass("hide");
	$(window).resize(function () {
		var fs01=$(window).width()/19.2;
		$("html").css("font-size",fs01);
	});
};
function login(){
    var username =document.getElementById('username').value;
    var password =document.getElementById('password').value;

	$.ajax({
		type : "POST",
		url : httpUrl.login,
		data:{username:username,password:password},
		dataType : "json",
		success : function(res) {
		  	if(res.code==200){
		 	  	art.dialog({
		 	  	  	title:'提示信息',
		 			content: res.info
		 		}).time(1);
		 		var data=JSON.parse(res.data);
				delCookie("loginId");
		 		setCookie("loginId",data.loginId,"d30");
		 	  	    
		   	 	// 初始化加载页面
		   	 	window.location.href=httpUrl.back;
		  	}else{
			 	art.dialog({
			 	  	title:'提示信息',
			 		content: res.info
			 	}).time(1); 
		   	}
		},
		error : function(textStatus) {
		 	  	art.dialog({
		 	  	  	title:'错误信息',
		 			content: '系统内部错误！'
		 		}).time(1); 
		}
	});
};