var user={
		pid:GetQueryString("pid"),
		sid:GetQueryString("sid")
};
var serverUrl01="https://www.member361.com";//84正式服务器
var serverUrl02="https://test.member361.com";//38测试服务器
var serverHost="https://www.member361.com";

var qiniu='https://filepublic.member361.com/';// 七牛公有文件

var path=""; //更改服务器地址可设置此值
if(window.location.host){
	path="https://"+window.location.host;// 线上环境host自动适配
}else{
	path=serverUrl02;// 开发环境默认38服务器
};

var httpUrl={
		// 基础
		loginId:getCookie("loginId"),
		path_img:qiniu, // 图片地址
		// path_img:path+"/file/getImage?md5=", // 图片地址
		download:path+"/file/downloadOne?", // 文件下载
		picUrl:path+"/file/upload2", // 图片上传地址
		upToken1:path+"/file/upToken1", // 获取公有文件上传token
		upToken2:path+"/file/upToken2", // 获取私有文件上传token
		downloadUrl1:path+"/file/downloadUrl1", // 获取私有资源下载URL
		streamUrl:path+"/file/streamUrl", // 获取私有资源的URL（文件流）
		basicFileUpload:path+"/file/business/upload", // 业务文件上传
		login:path+"/web/login/loginChecking",// 首页登入
		loginUserInfo:path+"/web/basic/loginUserInfo",// 获得登录人信息
		basicButton:path+"/web/ops/menu/button/list",// 获取菜单功能按钮列表
		basicMyClassInfo:path+"/web/basic/myClassInfo",// 获得当前人 所在班级列表
		basicAllClassInfo:path+"/web/basic/allClassInfo",// 获得登录人所在学校所有班级列表
		basicCompanyList:path+"/web/ops/company/list",// 获取所有的学校
		basicZip:path+"/file/zip",// 获取打包下载zip
		basicStudent:path+"/common/basic/class/student",// 获取当前班级学生列表

		// 菜单
		menuChildList:path+"/web/ops/user/menu/childList",// 获取子菜单列表
		menuButtonList:path+"/web/ops/menu/button/list",// 获取菜单功能按钮列表

		// 桔子俱乐部
		orangeCardList:path+"/web/pinge/card/record/list",// 获取所有的刷卡记录

		orangeCardRemove:path+"/web/pinge/student/card/remove",// 删除卡片信息
		orangeCardDetail:path+"/web/pinge/student/card/detail",// 卡片信息详情
		orangeCardAddOrUpdate:path+"/web/pinge/student/card/addOrUpdate",// 新增或编辑卡片信息
		orangeStudentCardList:path+"/web/pinge/student/card/list",// 获取卡片列表
		orangeStudentCardAll:path+"/web/pinge/school/student/all",// 获取学校所有学生里列表
		orangeStudentcardCheck:path+"/web/pinge/school/cardCheck/student/list",// 签到卡学生列表

		orangeEquipmentRemove:path+"/web/pinge/equipment/remove",// 删除设备信息
		orangeEquipmentAddOrUpdate:path+"/web/pinge/equipment/addOrUpdate",// 新增或编辑设备信息
		orangeEquipmentList:path+"/web/pinge/equipment/listOfAll",// 获取设备列表
		orangeEquipmentDetail:path+"/web/pinge/equipment/detail",// 获取设备详情

		orangeLinesList:path+"/web/pinge/school/line/list",// 获取所有线路列表
		orangeLinesDetail:path+"/web/pinge/school/line/detail",// 获取线路详情
		orangeLinesAddOrUpdate:path+"/web/pinge/school/line/addOrUpdate",// 新增或者编辑线路
		orangeLinesRemove:path+"/web/pinge/school/line/remove",// 删除路线
		orangeAddressAddOrUpdate:path+"/web/pinge/student/address/addOrUpdate",// 新增或者编辑学生地址
		orangeAddressOne:path+"/web/pinge/student/one/address",// 获取一个学生的地址
		orangeAddressSome:path+"/web/pinge/student/some/address",// 获取多个学生地址
		orangeStudentList:path+"/web/pinge/school/student/list",// 获取学校所有学生里列表

		orangeMessageAdd:path+"/web/pinge/school/message/add",// 添加推送消息
		orangeMessageList:path+"/web/pinge/school/message/list",// 获取推送消息列表

		// 08设置
		setting:'' 
};

function initAjax(url,param,callback,callback01,callback02) {
	$.ajax({
            type:"POST",
            url:url,
            data:param,
            dataType:"json",
            statusCode:{
                404:function(){
                    console.log("访问地址不存在或接口参数有误 错误代码404");
                },
                500:function(){
                    console.log("因为意外情况，服务器不能完成请求 错误代码500");
                    // window.location.href=httpUrl.loginHttp;
                },
                405:function(){
                    console.log("资源被禁止 错误代码405");
                }
            },
            beforeSend:function () {
            	// loadingIn();// loading载入
            },	
            success:function(result){
                callback(result,callback01,callback02);
                // loadingOut(); // loading退出
            },
            error:function(result){
                console.log("请求失败 ajax error!");
                // window.location.href=httpUrl.loginHttp;
            }
        });	
};


// loading载入函数
function loadingIn() {
	$("#page-loader").removeClass('hide');
	$("#page-loader").css("z-index","999999");
};
function loadingOut(argument) {
	$("#page-loader").addClass('hide');	
};

Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// 地址栏search参数筛选函数
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var result = window.location.search.substr(1).match(reg);
     return result?decodeURIComponent(result[2]):null;
}


// 设置cookie 过期时间s20代表20秒 h12代表12小时 d30代表30天
function setCookie(name,value,time){
	var strsec = getsec(time);
	var exp = new Date();
	exp.setTime(exp.getTime() + strsec*1);
	// document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+"path=/; domain="+domain;
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};
function getsec(str){
	var str1=str.substring(1,str.length)*1;
	var str2=str.substring(0,1);
	if (str2=="s"){
		return str1*1000;                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
	}
	else if (str2=="h")
	{
		return str1*60*60*1000;
	}
	else if (str2=="d")
	{
		return str1*24*60*60*1000;
	}
};
// 获取cookie
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return unescape(arr[2]);
	}
	else{
		return null;
	}
};
// 删除cookie
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null){
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	};
};


// niceScroll滚动条
function chooseNiceScroll(AA,color) {
    $(AA).niceScroll({ 
        cursorcolor: color || "#ccc",//#CC0071 光标颜色 
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
        touchbehavior: true, //使光标拖动滚动像在台式电脑触摸设备 
        cursorwidth: "5px", //像素光标的宽度 
        cursorborder: "0", //     游标边框css定义 
        cursorborderradius: "5px",//以像素为光标边界半径 
        autohidemode: true //是否隐藏滚动条 
    });
};

// 消息提示函数
function toastTip(heading,text,hideAfter,afterHidden) {
    $.toast({
            heading: heading,
            text: text,
            showHideTransition: 'slide',
            icon: 'success',
            hideAfter: hideAfter || 2500,
            loaderBg: '#edd42e',
            position: 'bottom-right',
            afterHidden: afterHidden
    });
};

// 退出清理cookie
$(function () {
	$(".userPic >a").click(function (e) {
        delCookie("loginId");
    });
});













































