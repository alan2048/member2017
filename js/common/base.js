var user={
		// useruuid:GetQueryString("useruuid") || "ca47d137-90eb-4a60-8c4b-fd46d14c0966",// 许
		useruuid:GetQueryString("useruuid") || "db951cc0-a6b4-41d3-8ebb-607c04a1f812",// 鱼
		pid:GetQueryString("pid"),
		sid:GetQueryString("sid"),
		classId:GetQueryString("classId") || 2,
		perssionNames:GetQueryString("perssionNames")
};
var serverUrl01="http://www.member361.com";//84正式服务器
var serverUrl02="https://121.43.150.38";//38测试服务器
var serverHost="http://www.member361.com";

var path01="http://172.168.90.101";//38测试服务器

var path=serverUrl02; //更改服务器地址可设置此值
var httpUrl={
		// 基础接口
		
		// login:path+"/jfinal_mbjy_basic/login",// 首页登入
		back:path+"/jfinal_mbjy_basic/back",//首页登入回调
		loginHttp:path+"/jfinal_mbjy_basic/", // 登入地址
		logoutHttp:path, // 注销地址
		// path_img:path+"/jfinal_mbjy_basic/file/showImg?fileMd5=", // 图片地址
		
		picUrl:path+"/jfinal_mbjy_basic/file/upload", // 图片上传地址
		memberRecord:path+"/sample_front/memberRecord/memberRecord.html",//成长档案网址

		// 00公共接口
		permission:path+"/jfinal_mbjy_basic/permission",// NAV导航栏和右侧树结构
		getTeacherList:path+"/jfinal_mbjy_basic/account/getTeacherList", // 获取学校教师信息
		getUserClassInfo01:path+"/jfinal_mbjy_basic/basic/GetUserClassInfo",//获取用户班级信息 与下面一接口相同
		getAllClassInfo:path+"/jfinal_mbjy_basic/basic/getAllClassInfo",//获取全部班级列表
		getClassMemberInfo:path+"/jfinal_mbjy_basic/basic/getClassMemberInfo",//获取班级成员信息
		getClassStudentInfo:path+"/jfinal_mbjy_basic/basic/getClassStudentInfo",//获取学生信息
		
		// 01师资管理
		teacher:path+"/jfinal_mbjy_basic/teacher",// 教师信息查询

		// 02班务管理

		// 03教学管理
		courseList:path+"/jfinal_mbjy_sample/course/list",// 获取课程计划列表
		courseSave:path+"/jfinal_mbjy_sample/course/save",// 新增课程
		courseUpdate:path+"/jfinal_mbjy_sample/course/update",// 编辑课程
		courseDelete:path+"/jfinal_mbjy_sample/course/delete",// 删除课程
		courseDetail:path+"/jfinal_mbjy_sample/course/detail", // 查看课程详情
		getPersonCourse:path+"/jfinal_mbjy_sample/course/getPersonCourse",// 获取个人观察计划列表
		courseDim:path+"/jfinal_mbjy_sample/dim/courseDim",// 获取观察计划的维度列表
		
		dailyEvaluationList:path+"/jfinal_mbjy_sample/record/list", //获取日常评价记录列表
		dailyEvaluationTypicalList:path+"/jfinal_mbjy_sample/record/typicalList", //获取典型案例记录列表
		dailyEvaluationDelete:path+"/jfinal_mbjy_sample/record/delete", // 日常评价删除
		dailyEvaluationSaveLevel:path+"/jfinal_mbjy_sample/record/saveLevel", // 评价日常观察记录
		dailyEvaluationUpdate:path+"/jfinal_mbjy_sample/record/update", // 更新日常观察记录
		dailyEvaluationDetail:path+"/jfinal_mbjy_sample/record/detail", // 日常评价详情
		studentRecordList:path+"/jfinal_mbjy_sample/record/studentRecordList",//获取班级学生观察记录列表

		watchDimensions:path+"/jfinal_mbjy_sample/dim/list", // 观察维度树结构
		dimSave:path+"/jfinal_mbjy_sample/dim/save",// 新增观察维度
		dimUpdate:path+"/jfinal_mbjy_sample/dim/update",// 编辑观察维度
		dimDelete:path+"/jfinal_mbjy_sample/dim/delete", // 删除观察维度
		
		getDimLevelList:path+"/jfinal_mbjy_sample/dim/getDimLevelList", // 获取观察维度的水平描述
		saveDimLevel:path+"/jfinal_mbjy_sample/dim/saveDimLevel", // 新增观察维度水平描述
		updateDimLevel:path+"/jfinal_mbjy_sample/dim/updateDimLevel", // 编辑观察维度水平描述
		deleteDimLevel:path+"/jfinal_mbjy_sample/dim/deleteDimLevel", // 删除观察维度水平描述
		
		//月周计划
		fileUpload:path+":18081/FileCloud/fileUpload", // 上传
		fileDownload:path+":18081/FileCloud/fileDownload", // 下载
		insertFileInfo:path+":18081/FileCloud/insertFileInfo", // 添加新文件（夹）
		deleteFileInfo:path+":18081/FileCloud/deleteFileInfo", // 删除文件（夹）
		updateFileName:path+":18081/FileCloud/updateFileName", // 重命名文件（夹）
		updateEvaluate:path+":18081/FileCloud/updateEvaluate", // 更改文件评级
		getRootFileUUID:path+":18081/FileCloud/getRootFileUUID", // 获取根文件夹UUID
		getParentUUID:path+":18081/FileCloud/getParentUUID", // 获取上级文件夹UUID
		getAllChildInfo:path+":18081/FileCloud/getAllChildInfo", // 获取子级全部文件（夹）
		// 04保健管理
		getClassHealthInfo:path+":18082/HealthInfo/getClassHealthInfo",//获得班级健康信息
		calculateAge:path+":18082/HealthInfo/calculateAge",//根据导入日期计算年龄
		getExamDateListByClass:path+":18082/HealthInfo/getExamDateListByClass",//根据班级获得检查日期列表
		insertHealthInfo:path+":18082/HealthInfo/insertHealthInfo",//增加健康信息
		deleteHealthInfo:path+":18082/HealthInfo/deleteHealthInfo",//删除健康信息
		updateHealthInfo:path+":18082/HealthInfo/updateHealthInfo",//更新健康信息
		getPValue:path+":18082/HealthInfo/getPValue",//取得p值
		getFatnessValue:path+":18082/HealthInfo/getFatnessValue",//取得肥胖值
		getBirthdaySex:path+":18082/HealthInfo/getBirthdaySex",//取得学员生日和性别
		getSingleHealthInfo:path+":18082/HealthInfo/getSingleHealthInfo",// 健康信息编辑详情
		importHealthInfo:path+":18082/HealthInfo/importHealthInfo",// 批量导入

		getDateList:path+":18082/HealthInfo/getTableInfoList",// 获得菜谱日期列表
		healthGetTable:path+":18082/HealthInfo/getTable",// 获得整张表的内容
		healthSaveTable:path+":18082/HealthInfo/saveTable",// 新增编辑菜谱新表
		healthDeleteTable:path+":18082/HealthInfo/deleteTable",// 删除菜谱

		//风险预警
		getCompanyHealthAlert:path+":18082/HealthInfo/getCompanyHealthAlert",//获得预警信息
		insertHealthAlert:path+":18082/HealthInfo/insertHealthAlert",//增加健康预警
		getAlertType:path+":18082/HealthInfo/getAlertType",//获得预警类型
		getAlertAge:path+":18082/HealthInfo/getAlertAge",//获得预警年龄
		deleteHealthAlert:path+":18082/HealthInfo/deleteHealthAlert",//删除健康预警
		updateHealthAlert:path+":18082/HealthInfo/updateHealthAlert",//编辑健康预警
		getHealthAlert:path+":18082/HealthInfo/getHealthAlert",//编辑获得单条预警信息记录

		// 05家园互动
		recordStudent:path+":15001/mbtrack/dan/student",// 获取学生列表（含档案信息）
		recordList:path+":15001/mbtrack/danbook/list",// 获取档案册列表
		recordMonthList:path+":15001/mbtrack/danbook/danList",// 获取档案册档案页详情
		recordNewDanbook:path+":15001/mbtrack/danbook/save",// 新建档案册
		recordDownload:path+":15001/file/patch/download",//图片批量下载（档案页）
		recordDanbookUpdate:path+":15001/mbtrack/danbook/update",// 档案册名更新

		GetSchoolIds:path+":15001/imsInterface/TSCourse_GetSchoolIds",//特色课程 获取学校课程id
		GetSchoolJYIds:path+":15001/imsInterface/TSCourse_GetSchoolJYIds",//剧场活动 id
		GetSchoolCourses:path+":15001/imsInterface/TSCourse_GetSchoolCourses",//特色课程 获取学校课程
		AddCourse:path+":15001/imsInterface/TSCourse_AddCourse",//特色课程 新增
		GetCourseDetails:path+":15001/imsInterface/TSCourse_GetCourseDetails",//获取学校课程详情
		tsDelCourse:path+":15001/imsInterface/TSCourse_DelCourse",// 删除学校课程
		tsGetBookedChildren:path+":15001/imsInterface/TSCourse_GetBookedChildren",// 签到学生列表
		tsCallRoll:path+":15001/imsInterface/TSCourse_CallRoll",// 签到
		tsCancelRoll:path+":15001/imsInterface/TSCourse_CancelRoll",// 取消签到

		// 06消息发布
		GetClassNotifyInfos:path+":12001/YY/GetClassNotifyInfos",// 获得班级活动列表
		getUserClassInfo:path+":12001/YY/GetUserClassInfo",//获取用户班级信息
		AddNewClassInfo:path+":12001/YY/AddNewClassInfo",// 获取班级信息

		GetSchoolNotifyInfos:path+":12001/YY/GetSchoolNotifyInfos",// 获得学校通知列表
		AddNewSchoolInfo:path+":12001/YY/AddNewSchoolInfo",// 新增学校通知

		GetParentsLessionInfos:path+":12001/YY/GetParentsLessionInfos",// 获得家长课堂列表
		AddParentsLessionInfo:path+":12001/YY/AddParentsLessionInfo",// 新增家长课堂

		GetHealthColumnInfos:path+":12001/YY/GetHealthColumnInfos",// 获得健康专栏列表
		AddHealthColumnInfo:path+":12001/YY/AddHealthColumnInfo",// 新增健康专栏

		GetNotify2Info:path+":12001/YY/GetNotify2Info",// 长桥 新闻总口
		AddNotify2Info:path+":12001/YY/AddNotify2Info",// 长桥 新闻总口 新增

		// 07管理与统计
		getPersonEvaluate:path+":48080/jfinal_mbjy_sample/report/getPersonEvaluate",// 个人综合能力评价
		getClassEvaluate:path+":48080/jfinal_mbjy_sample/report/getClassEvaluate",// 班级综合能力水平
		classRecord:path+":15001/jfinal_mbjy_sample/report/classRecord",// 班级观察记录统计
		classRecordDim:path+":15001/jfinal_mbjy_sample/report/classRecordDim",// 观察指标对应观察记录统计
		getStudentAbility:path+":15001/imsInterface/TJ_GCJL_GetStudentAbilityStrong",// 个人综合能力评价 雷达图
		getStudentCourseAbility:path+":15001/imsInterface/TJ_GCJL_GetStudentCourseAbility",// 个人课程 能力评价 雷达图
		getClassesAbilibySimple:path+":15001/imsInterface/TJ_GCJL_GetClassesAbilibySimple",// 班级综合能力水平 
		getCourseAbilibySimple:path+":15001/imsInterface/TJ_GCJL_GetCourseAbilibySimple",// 班级课程能力水平 
		getClassAbilibySimple:path+":15001/imsInterface/TJ_GCJL_GetClassAbilibySimple",// 班级综合能力水平 雷达图
		getCourseSimpleTJ:path+":15001/imsInterface/TSCourse_getCourseSimpleTJ",// 自选活动 活动统计 
		getCourseClassTJ:path+":15001/imsInterface/TSCourse_getCourseClassTJ",// 自选活动 班级统计 
		getCourseStudentTJ:path+":15001/imsInterface/TSCourse_getCourseStudentTJ",// 自选活动 学生统计 
		getCourseStudentDetailTJ:path+":15001/imsInterface/TSCourse_getCourseStudentDetailTJ",// 自选活动 活动统计详情 


















		// 新版接口
		// 基础
		loginId:getCookie("loginId"),
		path_img:path+"/file/getImage?md5=", // 图片地址
		login:path+"/web/login/loginChecking",// 首页登入
		loginUserInfo:path+"/web/basic/loginUserInfo",// 获得登录人信息
		basicButton:path+"/web/ops/menu/button/list",// 获取菜单功能按钮列表
		basicMyClassInfo:path+"/web/basic/myClassInfo",// 获得当前人 所在班级列表
		basicAllClassInfo:path+"/web/basic/allClassInfo",// 获得登录人所在学校所有班级列表
		basicCompanyList:path+"/web/ops/company/list",// 获取所有的学校

		// 菜单
		menuList:path+"/web/ops/user/menu/list",// 菜单接口
		menuChildList:path+"/web/ops/user/menu/childList",// 获取子菜单列表
		menuButtonList:path+"/web/ops/menu/button/list",// 获取菜单功能按钮列表

		// 教师信息
		teacherAdd:path+"/web/basic/staff/add",// 新建教职工
		teacherSingleStaffInfo:path+"/web/basic/staff/singleStaffInfo",//  获得单项教职工条目
		teacherUpdate:path+"/web/basic/staff/update",// 更新教职工条目
		teacherDelete:path+"/web/basic/staff/delete",// 移除教职工
		teacherAllType:path+"/web/basic/staff/allType",// 获得所有教职工类型
		teacherMyClassInfo:path+"/web/basic/myClassInfo",//  获得教职工所在班级列表
		teacherStaffInfo:path+"/web/basic/staff/staffInfo",//  获得教职工列表

		// 幼儿信息
		childrenAdd:path+"/web/basic/child/add",// 新建幼儿
		childrenSingleChildInfo:path+"/web/basic/child/singleChildInfo",//  获得单项幼儿条目
		childrenUpdate:path+"/web/basic/child/update",// 更新幼儿条目
		childrenDelete:path+"/web/basic/child/delete",// 移除幼儿
		childrenMyClassInfo:path+"/web/basic/myClassInfo",//  获得幼儿所在班级列表
		childrenInfo:path+"/web/basic/child/childInfo",//  获得幼儿列表
		childrenParentInfo:path+"/web/basic/child/parentInfo",//  获得幼儿家长列表

		// 班级管理
		classAdd:path+"/web/basic/org/add",// 新建班级
		classUpdate:path+"/web/basic/org/update",// 更新班级
		classDelete:path+"/web/basic/org/delete",// 移除班级
		classGradeList:path+"/web/basic/org/gradeList",// 获得年级列表
		classInfo:path+"/web/basic/org/classInfo",// 获得班级列表及人员数量
		classOfStaff:path+"/web/basic/org/staffOfClass",// 获得班级教职工列表
		classSingleClassInfo:path+"/web/basic/org/singleClassInfo",//  获得单项班级条目
		classBasicInfo:path+"/web/basic/org/classBasicInfo",//  获得所有班级基础信息
		classUpgrade:path+"/web/basic/org/upgrade",//  升班
		classChange:path+"/web/basic/org/changeClass",//  调班
		classMemberBasic:path+"/web/basic/org/memberBasic",//  获取班级幼儿及教职工名单

		// 萌宝成长
		growthBanner:path+"/web/ops/company/banner/list",// 萌宝成长 获取学校banner
		growthAdd:path+"/web/growth/message/add",// 萌宝成长 新增
		growthList:path+"/web/growth/message/list",// 萌宝成长 获取班级内容列表
		growthStudent:path+"/web/common/basic/class/student",// 萌宝成长 获取当前班级学生列表
		growthLabel:path+"/web/growth/label/list",// 萌宝成长 获取学校所有的标签
		growthAddordelete:path+"/web/growth/praise/addordelete",// 萌宝成长 点赞或者取消点赞
		growthCancelSticky:path+"/web/growth/message/cancelSticky",// 萌宝成长 取消内容置顶
		growthCommentAdd:path+"/web/growth/comment/add",// 萌宝成长 新增一条评论或者回复
		growthCommentDelete:path+"/web/growth/comment/delete",// 萌宝成长 删除某一条评论
		growthMessageDelete:path+"/web/growth/message/delete",// 萌宝成长 删除一条内容

		// 菜单管理
		menuButtonAddOrUpdate:path+"/web/ops/menu/button/addOrUpdate",// 新增或更新按钮信息
		menuAddOrUpdate:path+"/web/ops/menu/addOrUpdate",// 新增或更新菜单信息
		menuCompanyUpdate:path+"/web/ops/company/menu/update",// 更新学校菜单信息
		menuCompanyList:path+"/web/ops/company/menu/list",// 获取学校菜单列表
		menuButtonList:path+"/web/ops/button/list",// 获取菜单按钮列表

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
function GetQueryString(name)
{
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
function toastTip(heading,text,hideAfter) {
    $.toast({
            heading: heading,
            text: text,
            showHideTransition: 'slide',
            icon: 'success',
            hideAfter: hideAfter || 1500,
            loaderBg: '#13b5dd',
            position: 'bottom-right',
            afterHidden: function () {
                // window.location.href=httpUrl.loginHttp;
            }
    });
};
















// 菜单
function menu() {
    menuChildList_port(user.pid);
    $("#switch").click(function () {
        var aa=$(this);
        $(this).prev("#sidebarBox").fadeToggle(function () {
            aa.toggleClass("active");
            $(".content").toggleClass("active");
        });
    });
    $("#subMenu").on("click","a.hasTitle",function () {
    	$(this).toggleClass("active");
    });
};
// 左侧 菜单接口
function menuChildList_port(menuId) {
    var data={
            menuId:menuId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuChildList,param,menuChildList_callback,menuId);
};
function menuChildList_callback(res,menuId) {
    if(res.code==200){
        var data={
        		arr:JSON.parse(res.data),
        		path_img:httpUrl.path_img
        };
        for(var i=0;i<data.arr.length;i++){
        	data.arr[i].iconArr=data.arr[i].icon.split(",");
        	data.arr[i].pid=menuId;
        	data.arr[i].url=data.arr[i].url.split("/")[2];
        	if(data.arr[i].id == user.sid){
        		data.arr[i].current=true;
        	}else{
        		data.arr[i].current=false;
        	};
        };
        
        var html=template("menu_script",data);
        $("#subMenu").empty().append(html);
        chooseNiceScroll("#sidebarBox","transparent");

        loginUserInfo_port();
        basicButton_port();
    }else if(res.coed =404){
    	// window.location.href=path;
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
        $("#user >.userName").text(data.name);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
        	background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / contain"
        });
    };
};

// 获取菜单功能按钮列表
function basicButton_port() {
    var data={
            menuId:user.sid
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicButton,param,basicButton_callback);
};
function basicButton_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("buttonBox_script",data);
        $("#buttonBox").append(html);
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    };
};






























