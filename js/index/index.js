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
				toastTip("提示","请先将账号或密码填写完整！",2500);
			}
		};
	});

	$("#username").keyup(function (e) {
		if($(this).val().length >=11){
			var reg=/^1(3|4|5|7|8)\d{9}$/;// 验证手机号码
			if(reg.test($(this).val())){
				$(this).parents(".nameBox").removeClass("empty");
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
			}else{
				toastTip("提示","手机号码格式不正确");
				$(this).parents(".nameBox").addClass("empty");
			};
		}else if(e.keyCode == 13){
			toastTip("提示","手机号码为11位");
		};
	});

	$("#loginIn").click(function (e) {
		if($("#username").val() && $("#password").val()){
			$(this).text("正在登录...");
			var data={
					account:$("#username").val(),
					password:$("#password").val()
			};
			var param={
            		params:JSON.stringify(data),
    		};
    		$.ajax({
				type : "POST",
				url : httpUrl.login,
				data:param,
				dataType : "json",
				success : function(res) {
		  			if(res.code==200){
		  				toastTip("提示",res.info);
		 				var data=JSON.parse(res.data);
						delCookie("loginId");
		 				setCookie("loginId",data,"d30");
		 	  	    
		   	 			// 初始化加载页面
		   	 			window.location.href="menu.html";
		   	 			// window.location.href=httpUrl.back;
		  			}else{
		  				$("#loginIn").text("登录");
		  				toastTip("提示",res.info);
		   			}
				},
				error : function(textStatus) {
						toastTip("提示","系统内部错误！");
				}
			});
		}else{
			toastTip("提示","请先将账号或密码填写完整！",2500);
		}
	});
};