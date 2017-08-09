var user={
		pid:GetQueryString("pid"),
		sid:GetQueryString("sid")
};
var serverUrl01="http://www.member361.com";//84正式服务器
var serverUrl02="https://121.43.150.38";//38测试服务器
var serverUrl03="http://121.43.150.38";//38测试服务器
var serverHost="http://www.member361.com";

var path=serverUrl02; //更改服务器地址可设置此值
var path01=serverUrl01; //更改服务器地址可设置此值
var httpUrl={
		// 基础接口
		
		// login:path01+"/jfinal_mbjy_basic/login",// 首页登入
		back:path01+"/jfinal_mbjy_basic/back",//首页登入回调
		loginHttp:path01+"/jfinal_mbjy_basic/", // 登入地址
		logoutHttp:path01, // 注销地址
		// path_img:path+"/jfinal_mbjy_basic/file/showImg?fileMd5=", // 图片地址
		
		
		memberRecord:path01+"/sample_front/memberRecord/memberRecord.html",//成长档案网址

		// 00公共接口
		permission:path01+"/jfinal_mbjy_basic/permission",// NAV导航栏和右侧树结构
		getTeacherList:path01+"/jfinal_mbjy_basic/account/getTeacherList", // 获取学校教师信息
		getUserClassInfo01:path01+"/jfinal_mbjy_basic/basic/GetUserClassInfo",//获取用户班级信息 与下面一接口相同
		getAllClassInfo:path01+"/jfinal_mbjy_basic/basic/getAllClassInfo",//获取全部班级列表
		getClassMemberInfo:path01+"/jfinal_mbjy_basic/basic/getClassMemberInfo",//获取班级成员信息
		getClassStudentInfo:path01+"/jfinal_mbjy_basic/basic/getClassStudentInfo",//获取学生信息
		
		// 01师资管理
		teacher:path01+"/jfinal_mbjy_basic/teacher",// 教师信息查询

		// 02班务管理

		// 03教学管理
		courseList:path01+"/jfinal_mbjy_sample/course/list",// 获取课程计划列表
		courseSave:path01+"/jfinal_mbjy_sample/course/save",// 新增课程
		courseUpdate:path01+"/jfinal_mbjy_sample/course/update",// 编辑课程
		courseDelete:path01+"/jfinal_mbjy_sample/course/delete",// 删除课程
		courseDetail:path01+"/jfinal_mbjy_sample/course/detail", // 查看课程详情
		getPersonCourse:path01+"/jfinal_mbjy_sample/course/getPersonCourse",// 获取个人观察计划列表
		courseDim:path01+"/jfinal_mbjy_sample/dim/courseDim",// 获取观察计划的维度列表
		
		dailyEvaluationList:path01+"/jfinal_mbjy_sample/record/list", //获取日常评价记录列表
		dailyEvaluationTypicalList:path01+"/jfinal_mbjy_sample/record/typicalList", //获取典型案例记录列表
		dailyEvaluationDelete:path01+"/jfinal_mbjy_sample/record/delete", // 日常评价删除
		dailyEvaluationSaveLevel:path01+"/jfinal_mbjy_sample/record/saveLevel", // 评价日常观察记录
		dailyEvaluationUpdate:path01+"/jfinal_mbjy_sample/record/update", // 更新日常观察记录
		dailyEvaluationDetail:path01+"/jfinal_mbjy_sample/record/detail", // 日常评价详情
		studentRecordList:path01+"/jfinal_mbjy_sample/record/studentRecordList",//获取班级学生观察记录列表

		watchDimensions:path01+"/jfinal_mbjy_sample/dim/list", // 观察维度树结构
		dimSave:path01+"/jfinal_mbjy_sample/dim/save",// 新增观察维度
		dimUpdate:path01+"/jfinal_mbjy_sample/dim/update",// 编辑观察维度
		dimDelete:path01+"/jfinal_mbjy_sample/dim/delete", // 删除观察维度
		
		getDimLevelList:path01+"/jfinal_mbjy_sample/dim/getDimLevelList", // 获取观察维度的水平描述
		saveDimLevel:path01+"/jfinal_mbjy_sample/dim/saveDimLevel", // 新增观察维度水平描述
		updateDimLevel:path01+"/jfinal_mbjy_sample/dim/updateDimLevel", // 编辑观察维度水平描述
		deleteDimLevel:path01+"/jfinal_mbjy_sample/dim/deleteDimLevel", // 删除观察维度水平描述
		
		//月周计划
		fileUpload:path01+":18081/FileCloud/fileUpload", // 上传
		fileDownload:path01+":18081/FileCloud/fileDownload", // 下载
		insertFileInfo:path01+":18081/FileCloud/insertFileInfo", // 添加新文件（夹）
		deleteFileInfo:path01+":18081/FileCloud/deleteFileInfo", // 删除文件（夹）
		updateFileName:path01+":18081/FileCloud/updateFileName", // 重命名文件（夹）
		updateEvaluate:path01+":18081/FileCloud/updateEvaluate", // 更改文件评级
		getRootFileUUID:path01+":18081/FileCloud/getRootFileUUID", // 获取根文件夹UUID
		getParentUUID:path01+":18081/FileCloud/getParentUUID", // 获取上级文件夹UUID
		getAllChildInfo:path01+":18081/FileCloud/getAllChildInfo", // 获取子级全部文件（夹）
		// 04保健管理
		getClassHealthInfo:path01+":18082/HealthInfo/getClassHealthInfo",//获得班级健康信息
		calculateAge:path01+":18082/HealthInfo/calculateAge",//根据导入日期计算年龄
		getExamDateListByClass:path01+":18082/HealthInfo/getExamDateListByClass",//根据班级获得检查日期列表
		insertHealthInfo:path01+":18082/HealthInfo/insertHealthInfo",//增加健康信息
		deleteHealthInfo:path01+":18082/HealthInfo/deleteHealthInfo",//删除健康信息
		updateHealthInfo:path01+":18082/HealthInfo/updateHealthInfo",//更新健康信息
		getPValue:path01+":18082/HealthInfo/getPValue",//取得p值
		getFatnessValue:path01+":18082/HealthInfo/getFatnessValue",//取得肥胖值
		getBirthdaySex:path01+":18082/HealthInfo/getBirthdaySex",//取得学员生日和性别
		getSingleHealthInfo:path01+":18082/HealthInfo/getSingleHealthInfo",// 健康信息编辑详情
		importHealthInfo:path01+":18082/HealthInfo/importHealthInfo",// 批量导入

		getDateList:path01+":18082/HealthInfo/getTableInfoList",// 获得菜谱日期列表
		healthGetTable:path01+":18082/HealthInfo/getTable",// 获得整张表的内容
		healthSaveTable:path01+":18082/HealthInfo/saveTable",// 新增编辑菜谱新表
		healthDeleteTable:path01+":18082/HealthInfo/deleteTable",// 删除菜谱

		//风险预警
		getCompanyHealthAlert:path01+":18082/HealthInfo/getCompanyHealthAlert",//获得预警信息
		insertHealthAlert:path01+":18082/HealthInfo/insertHealthAlert",//增加健康预警
		getAlertType:path01+":18082/HealthInfo/getAlertType",//获得预警类型
		getAlertAge:path01+":18082/HealthInfo/getAlertAge",//获得预警年龄
		deleteHealthAlert:path01+":18082/HealthInfo/deleteHealthAlert",//删除健康预警
		updateHealthAlert:path01+":18082/HealthInfo/updateHealthAlert",//编辑健康预警
		getHealthAlert:path01+":18082/HealthInfo/getHealthAlert",//编辑获得单条预警信息记录

		// 06消息发布
		GetClassNotifyInfos:path01+":12001/YY/GetClassNotifyInfos",// 获得班级活动列表
		getUserClassInfo:path01+":12001/YY/GetUserClassInfo",//获取用户班级信息
		AddNewClassInfo:path01+":12001/YY/AddNewClassInfo",// 获取班级信息

		GetSchoolNotifyInfos:path01+":12001/YY/GetSchoolNotifyInfos",// 获得学校通知列表
		AddNewSchoolInfo:path01+":12001/YY/AddNewSchoolInfo",// 新增学校通知

		GetParentsLessionInfos:path01+":12001/YY/GetParentsLessionInfos",// 获得家长课堂列表
		AddParentsLessionInfo:path01+":12001/YY/AddParentsLessionInfo",// 新增家长课堂

		GetHealthColumnInfos:path01+":12001/YY/GetHealthColumnInfos",// 获得健康专栏列表
		AddHealthColumnInfo:path01+":12001/YY/AddHealthColumnInfo",// 新增健康专栏

		GetNotify2Info:path01+":12001/YY/GetNotify2Info",// 长桥 新闻总口
		AddNotify2Info:path01+":12001/YY/AddNotify2Info",// 长桥 新闻总口 新增

		// 07管理与统计
		getPersonEvaluate:path01+":48080/jfinal_mbjy_sample/report/getPersonEvaluate",// 个人综合能力评价
		getClassEvaluate:path01+":48080/jfinal_mbjy_sample/report/getClassEvaluate",// 班级综合能力水平
		classRecord:path01+":15001/jfinal_mbjy_sample/report/classRecord",// 班级观察记录统计
		classRecordDim:path01+":15001/jfinal_mbjy_sample/report/classRecordDim",// 观察指标对应观察记录统计
		getStudentAbility:path01+":15001/imsInterface/TJ_GCJL_GetStudentAbilityStrong",// 个人综合能力评价 雷达图
		getStudentCourseAbility:path01+":15001/imsInterface/TJ_GCJL_GetStudentCourseAbility",// 个人课程 能力评价 雷达图
		getClassesAbilibySimple:path01+":15001/imsInterface/TJ_GCJL_GetClassesAbilibySimple",// 班级综合能力水平 
		getCourseAbilibySimple:path01+":15001/imsInterface/TJ_GCJL_GetCourseAbilibySimple",// 班级课程能力水平 
		getClassAbilibySimple:path01+":15001/imsInterface/TJ_GCJL_GetClassAbilibySimple",// 班级综合能力水平 雷达图
		getCourseSimpleTJ:path01+":15001/imsInterface/TSCourse_getCourseSimpleTJ",// 自选活动 活动统计 
		getCourseClassTJ:path01+":15001/imsInterface/TSCourse_getCourseClassTJ",// 自选活动 班级统计 
		getCourseStudentTJ:path01+":15001/imsInterface/TSCourse_getCourseStudentTJ",// 自选活动 学生统计 
		getCourseStudentDetailTJ:path01+":15001/imsInterface/TSCourse_getCourseStudentDetailTJ",// 自选活动 活动统计详情 


















		// 新版接口
		// 基础
		loginId:getCookie("loginId"),
		path_img:path+"/file/getImage?md5=", // 图片地址
		picUrl:path+"/file/upload", // 图片上传地址
		login:path+"/web/login/loginChecking",// 首页登入
		loginUserInfo:path+"/web/basic/loginUserInfo",// 获得登录人信息
		basicButton:path+"/web/ops/menu/button/list",// 获取菜单功能按钮列表
		basicMyClassInfo:path+"/web/basic/myClassInfo",// 获得当前人 所在班级列表
		basicAllClassInfo:path+"/web/basic/allClassInfo",// 获得登录人所在学校所有班级列表
		basicCompanyList:path+"/web/ops/company/list",// 获取所有的学校
		basicZip:path+"/file/zip",// 获取打包下载zip

		// 菜单
		menuList:path+"/web/ops/user/menu/list",// 菜单接口
		menuChildList:path+"/web/ops/user/menu/childList",// 获取子菜单列表
		menuButtonList:path+"/web/ops/menu/button/list",// 获取菜单功能按钮列表

		// 菜单管理
		menuButtonAddOrUpdate:path+"/web/ops/menu/button/addOrUpdate",// 新增或更新按钮信息
		menuAddOrUpdate:path+"/web/ops/menu/addOrUpdate",// 新增或更新菜单信息
		menuCompanyUpdate:path+"/web/ops/company/menu/update",// 更新学校菜单信息
		menuCompanyList:path+"/web/ops/company/menu/list",// 获取学校菜单列表
		menuButtonList:path+"/web/ops/button/list",// 获取菜单按钮列表
		menuDelete:path+"/web/ops/menu/delete",// 删除菜单
		menuButtonDelete:path+"/web/ops/menu/button/delete",// 删除菜单按钮
		menuDetail:path+"/web/ops/menu/detail",// 菜单详情
		menuButtonDetail:path+"/web/ops/menu/button/detail",// 按钮详情

		menuRoleButtonUpdate:path+"/web/ops/role/button/update",// 更新角色按钮权限
		menuRoleButtonList:path+"/web/ops/role/buttonList",// 获得角色所有按钮(含选中信息)
		
		// 学校角色管理
		schoolTypeList:path+"/web/ops/role/typeList",// 获取所有的角色
		schoolMenuList:path+"/web/ops/company/role/menuList",// 获取学校角色菜单
		schoolMenuUpdate:path+"/web/ops/company/role/menu/update",// 更新学校角色菜单

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
		growthStudent:path+"/common/basic/class/student",// 萌宝成长 获取当前班级学生列表
		growthLabel:path+"/web/growth/label/list",// 萌宝成长 获取学校所有的标签
		growthAddordelete:path+"/web/growth/praise/addordelete",// 萌宝成长 点赞或者取消点赞
		growthCancelSticky:path+"/web/growth/message/cancelSticky",// 萌宝成长 取消内容置顶
		growthCommentAdd:path+"/web/growth/comment/add",// 萌宝成长 新增一条评论或者回复
		growthCommentDelete:path+"/web/growth/comment/delete",// 萌宝成长 删除某一条评论
		growthMessageDelete:path+"/web/growth/message/delete",// 萌宝成长 删除一条内容

		// 观察记录
		watchCourseList:path+"/web/sample/search/course/list",// (查询)个人观察计划列表
		watchClassList:path+"/web/sample/search/class/list",// (查询)获取个人所在班级
		watchTeacherList:path+"/web/sample/search/teacher/list",// (查询)获取班级所有老师
		watchDimList:path+"/web/sample/search/dim/list",// (查询)观察计划维度列表
		watchRecordUpdate:path+"/web/sample/student/record/update",// 更新观察记录
		watchRecordList:path+"/web/sample/student/record/list",// 获取学生观察记录列表
		watchStudentList:path+"/web/sample/record/student/list",// 获取观察记录学生列表
		watchRecordDetail:path+"/web/sample/student/record/detail",// 获取观察记录详情
		watchRecordDelete:path+"/web/sample/record/delete",// 删除观察记录

		// 观察计划
		watchPlanList:path+"/web/sample/company/course/list",// 获取观察计划列表
		watchPlanDetail:path+"/web/sample/company/course/detail",// 获取观察计划详情
		watchPlanAddOrUpdate:path+"/web/sample/company/course/addOrUpdate",// 新增或更新观察计划
		watchPlanDelete:path+"/web/sample/company/course/delete",// 删除观察计划
		watchPlanTeacherList:path+"/web/sample/company/teacherList",// 关联教师

		// 观察维度
		dimLevelDelete:path+"/web/sample/company/dimLevel/delete",// 删除学校维度水平
		dimDelete:path+"/web/sample/company/dim/delete",// 删除学校观察维度
		dimLevelAddOrUpdate:path+"/web/sample/company/dimLevel/addOrUpdate",// 新增或更新学校维度水平
		dimAddOrUpdate:path+"/web/sample/company/dim/addOrUpdate",// 新增或更新学校观察维度
		dimLevelList:path+"/web/sample/company/dimLevel/list",// 获取学校维度水平列表
		dimList:path+"/web/sample/company/dim/list",// 获取学校观察维度

		// 家园互动
		recordStudent:path+"/web/mbtrack/dan/student",// 获取学生列表（含档案信息）
		recordList:path+"/web/mbtrack/danbook/list",// 获取档案册列表
		recordMonthList:path+"/web/mbtrack/danbook/danList",// 获取档案册档案页详情
		recordNewDanbook:path+"/web/mbtrack/danbook/save",// 新建档案册
		recordDownload:path+"/file/patch/download",//图片批量下载（档案页）
		recordDanbookUpdate:path+"/web/mbtrack/danbook/update",// 档案册名更新

		// 考勤
		attendGetChildOfClass:path+"/web/attendance/teacher/getChildOfClass",// 获得班级所有幼儿信息
		attendGetAttendanceRecord:path+"/web/attendance/teacher/getAttendanceRecord",// 获得考勤记录
		attendCheckConfirm:path+"/web/attendance/teacher/checkConfirm",// 教师端检查确认
		attendDisPlayAttendDays:path+"/web/attendance/teacher/disPlayAttendDays",// 查看已设置的考勤天数
		attendUpdateAttendDays:path+"/web/attendance/teacher/updateAttendDays",// 修改考勤天数设置
		attendResetAttendDays:path+"/web/attendance/teacher/resetAttendDays",// 复位考勤天数设置
		attendGetClassAttendanceInfo:path+"/web/attendance/teacher/getClassAttendanceInfo",// 获得班级考勤
		attendGetPersonalAttendance:path+"/web/attendance/parent/getPersonalAttendance",// 获得个人考勤

		// 公告
		getMyClassInfo:path+"/web/basic/getMyClassInfo",// 获取我的班级信息
		getClassStuAndTeachers:path+"/web/basic/getClassStuAndTeachers",// 获取班级所有学生和老师
		noticeGetDesc:path+"/web/notice/getNoticeDesc",// 获取公告描述
		noticeReaded:path+"/web/notice/markNoticeReaded",// 公告置为已读
		noticeAddNew:path+"/web/notice/addNewNotice",// 新增新的公告内容
		noticeGetContentList:path+"/web/notice/getNoticeContent",// 获取某个公告内容列表
		noticeGetReadDetail:path+"/web/notice/getReadDetail",// 获取某条公告内容阅读详情

		// 每周菜谱
		menuSaveTable:path+"/web/cookbook/saveTable",// 保存表格
		menuDeleteTable:path+"/web/cookbook/deleteTable",// 删除整张表
		menuUpdateTitle:path+"/web/cookbook/updateTitle",// 更新菜谱标题
		menuSelectCell:path+"/web/cookbook/selectCell",// 获得某个单元
		menuGetTitleList:path+"/web/cookbook/getTitleList",// 获得菜谱标题列表
		menuStructuringTableCell:path+"/web/cookbook/structuringTableCell",// 通过开始日期获取表单

		// 自选课程 剧场活动
		GetSchoolIds:path+"/web/activity/TSCourse_GetSchoolIds",//特色课程 获取学校课程id
		GetSchoolJYIds:path+"/web/activity/TSCourse_GetSchoolJYIds",//剧场活动 id
		GetSchoolCourses:path+"/web/activity/TSCourse_GetSchoolCourses",//特色课程 获取学校课程
		AddCourse:path+"/web/activity/TSCourse_AddCourse",//特色课程 新增
		GetCourseDetails:path+"/web/activity/TSCourse_GetCourseDetails",//获取学校课程详情
		tsDelCourse:path+"/web/activity/TSCourse_DelCourse",// 删除学校课程
		tsGetBookedChildren:path+"/web/activity/TSCourse_GetBookedChildren",// 签到学生列表
		tsCallRoll:path+"/web/activity/TSCourse_CallRoll",// 签到
		tsCancelRoll:path+"/web/activity/TSCourse_CancelRoll",// 取消签到
		tsTempBookCourse:path+"/web/activity/TSCourse_tempBookCourse",// 补加预约人数
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
function toastTip(heading,text,hideAfter,afterHidden) {
    $.toast({
            heading: heading,
            text: text,
            showHideTransition: 'slide',
            icon: 'success',
            hideAfter: hideAfter || 1500,
            loaderBg: '#edd42e',
            position: 'bottom-right',
            afterHidden: afterHidden
    });
};














































