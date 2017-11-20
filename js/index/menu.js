$(function () {
	menuList_port();
    loginUserInfo_port();
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
    			path_img:httpUrl.path_img,
                date:function () {t=new Date().getTime();return t;}()
    	};
    	
    	// 判断是否url自带参数
    	for(var i=0;i<data.arr.length;i++){
    		for(var j=0;j<data.arr[i].childMenuList.length;j++){
    			if(data.arr[i].childMenuList[j].url.indexOf("?") >=0){
    				data.arr[i].childMenuList[j].search=true;
    			}else{
    				data.arr[i].childMenuList[j].search=false;
    			};
    		};
    	};
    	
		var html=template("menuBox_script",data);
		$("#menuBox").empty().append(html);
		$("#menuBox").on({
			mouseover:function () {
				$(this).parent().addClass("active").siblings().removeClass("active");
			},
			mouseout:function () {
				$(this).parent().removeClass("active").siblings().removeClass("active");
			}
		},"li>.has-list");
		chooseNiceScroll(".hasBox");
    }else{
    	toastTip("提示",res.info,2000,function () {
    		window.location.href="index.html";
    	})
    };
};

// 获得登录人信息
function loginUserInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.loginUserInfo,param,loginUserInfo_callback);
};
function loginUserInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;

        $("#user .userName").text(data.name).attr("data-uuid",data.userUUID).attr("data-childuuid",data.childUUID);
        $("#user .userRole").text(data.jobTitle).attr("data-typeid",data.typeID);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        if(data.companyCoverMD5){
            $(".menuTitle img").attr('src',data.path_img+data.companyCoverMD5);
        };
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