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
	$("#password").keydown(function (e) {
		if(e.keyCode == 13){
			if($(this).val() && $("#username").val()){
				$("#loginIn").click();
			}else{
				dialogMiss("提示","请先将账号密码填写完整！");
			}
		};
	});

	$("#username").keydown(function (e) {
		if(e.keyCode == 13){
			if($(this).val()){
				// 100毫秒自动补全
				setTimeout(function () {
					if($("#password").val()){
						$("#loginIn").click();
					}else{
						$("#password").focus();
					}
				},100);
			};
		};
	});

	$("#loginIn").click(function (e) {
		if($("#username").val() && $("#password").val()){
    		$.ajax({
				type : "POST",
				url : httpUrl.login,
				data:{username:$("#username").val(),password:$("#password").val()},
				dataType : "json",
				success : function(res) {
		  			if(res.code==200){
		  				dialogMiss("提示",res.info);
		 				var data=JSON.parse(res.data);
						delCookie("loginId");
		 				setCookie("loginId",data.loginId,"d30");
		 	  	    
		   	 			// 初始化加载页面
		   	 			window.location.href="menu.html";
		   	 			// window.location.href=httpUrl.back;
		  			}else{
			 			dialogMiss("提示",res.info+"，账号或密码错误！");
		   			}
				},
				error : function(textStatus) {
						dialogMiss("提示",'系统内部错误！');
				}
			});
		}else{
			dialogMiss("提示","请先将账号密码填写完整！");
		}
	});
};

function dialogMiss(title,content) {
	var d = dialog({
				title: title,
				content: content
	});
	d.show();
	setTimeout(function () {
		d.close().remove();
	}, 1500);
};