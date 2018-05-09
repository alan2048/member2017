var user={
		useruuid:GetQueryString("useruuid")
};
if(!user.useruuid){
	alert("useruuid为空");
};
var serverUrl01="https://www.member361.com";//84正式服务器
var serverUrl02="https://121.43.150.38";//38测试服务器

var qiniu='https://filepublic.member361.com/';// 七牛公有文件

var path=""; //更改服务器地址可设置此值
if(window.location.host){
    path="https://"+window.location.host;// 线上环境host自动适配
}else{
    path=serverUrl02;// 开发环境默认38服务器
};

var httpUrl={
		path_img:qiniu, // 图片地址
        loginUserInfo:path+"/app/basic/loginUserInfo", // 获得登录人员信息
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
                    alert("访问地址不存在或接口参数有误 错误代码404");
                },
                500:function(){
                    console.log("因为意外情况，服务器不能完成请求 错误代码500");
                    // window.location.href=httpUrl.loginHttp;
                },
                405:function(){
                    alert("资源被禁止 错误代码405");
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
                console.log("请求失败 error!");
                // window.location.href=httpUrl.loginHttp;
            }
        });	
};

// 地址栏search参数筛选函数
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var result = window.location.search.substr(1).match(reg);
     return result?decodeURIComponent(result[2]):null;
};


