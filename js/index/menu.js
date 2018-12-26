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
        var curArr=JSON.parse(res.data);
        // 判断是否url自带参数
        for(var i=0;i<curArr.length;i++){
            for(var j=0;j<curArr[i].childMenuList.length;j++){
                if(curArr[i].childMenuList[j].url.indexOf("?") >=0){
                    curArr[i].childMenuList[j].search=true;
                }else{
                    curArr[i].childMenuList[j].search=false;
                };
            };
        };


        var newArr=[];
        for(var i=0;i<curArr.length;i+=12){
            newArr.push(curArr.slice(i,i+12))
        };

        var data={
                arr:newArr,
                path_img:httpUrl.path_img,
                date:function () {t=new Date().getTime();return t;}()
        };
    	
		var html=template("menuBox_script",data);
		$("#myCarousel").empty().append(html);
        $('.carousel').carousel('pause');

		$(".menuBoxP").on({
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