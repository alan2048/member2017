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
		download:serverUrl01+"/file/downloadOne?", // 文件下载
		picUrl:path+"/file/upload2", // 图片上传地址
		upToken1:serverUrl01+"/file/upToken1", // 获取公有文件上传token 
		upToken2:serverUrl01+"/file/upToken2", // 获取私有文件上传token 
		downloadUrl1:serverUrl01+"/file/downloadUrl1", // 获取私有资源下载URL
		streamUrl:serverUrl01+"/file/streamUrl", // 获取私有资源的URL（文件流）
		basicFileUpload:path+"/file/business/upload", // 业务文件上传
		login:path+"/web/login/loginChecking",// 首页登入
		login2:path+"/web/login/loginChecking2",// 首页登入2
		loginUserInfo:path+"/web/basic/loginUserInfo",// 获得登录人信息
		basicButton:path+"/web/ops/menu/button/list",// 获取菜单功能按钮列表
		basicMyClassInfo:path+"/web/basic/myClassInfo",// 获得当前人 所在班级列表
		basicAllClassInfo:path+"/web/basic/allClassInfo",// 获得登录人所在学校所有班级列表
		basicCompanyList:path+"/web/ops/company/list",// 获取所有的学校
		basicZip:path+"/file/zip",// 获取打包下载zip
		basicStudent:path+"/common/basic/class/student",// 获取当前班级学生列表

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

		teacherGetImportUserInfo:path+"/web/basic/import/getImportUserInfo",//  获得用户导入表信息
		teacherDeleteImportUser:path+"/web/basic/import/deleteImportUser",//  用户导入表-删除
		teacherSubmitUserData:path+"/web/basic/import/submitUserData",//  用户导入表 提交数据
		teacherGetSingleImportUserInfo:path+"/web/basic/import/getSingleImportUserInfo",//  获得用户导入表单项导入信息
		teacherUpdateImportUser:path+"/web/basic/import/updateImportUser",//  用户导入表-编辑

		// 幼儿信息
		childrenAdd:path+"/web/basic/child/add",// 新建幼儿
		childrenSingleChildInfo:path+"/web/basic/child/singleChildInfo",//  获得单项幼儿条目
		childrenUpdate:path+"/web/basic/child/update",// 更新幼儿条目
		childrenDelete:path+"/web/basic/child/delete",// 移除幼儿
		childrenMyClassInfo:path+"/web/basic/myClassInfo",//  获得幼儿所在班级列表
		childrenInfo:path+"/web/basic/child/childInfo",//  获得幼儿列表
		childrenParentInfo:path+"/web/basic/child/parentInfo",//  获得幼儿家长列表

		childrenGetImportUserInfo:path+"/web/basic/import/getImportChildInfo",//  获得用户导入表信息
		childrenDeleteImportUser:path+"/web/basic/import/deleteImportChild",//  用户导入表-删除
		childrenSubmitUserData:path+"/web/basic/import/submitChildData",//  用户导入表 提交数据
		childrenGetSingleImportUserInfo:path+"/web/basic/import/getSingleImportChildInfo",//  获得用户导入表单项导入信息
		childrenUpdateImportUser:path+"/web/basic/import/updateImportChild",//  幼儿导入表-编辑

		childrenParentDelete:path+"/web/basic/parent/delete",//  删除家长条目
		childrenSingleParentInfo:path+"/web/basic/parent/singleParentInfo",//  获得单项家长条目
		childrenParentUpdate:path+"/web/basic/parent/update",//  更新家长条目

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

		// 萌宝成长标签
		growthLabelDelete:path+"/web/growth/label/delete",// 萌宝成长标签 删除
		growthLabelAddOrUpdate:path+"/web/growth/label/addOrUpdate",// 新增或者编辑标签

		// 萌宝成长统计
		growthTeacherStat:path+"/web/growth/report/message/teacher",// 萌宝成长统计 教师发帖数量
		growthClassStat:path+"/web/growth/report/message/class",// 萌宝成长统计 班级发帖数量
		growthLivelyStat:path+"/web/growth/report/parent/lively",// 萌宝成长统计 点赞评论数量

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

		watchTeacherStat:path+"/web/sample/report/teacher",// 观察记录统计
		watchClassStat:path+"/web/sample/report/class",// 观察记录统计01
		watchCourseStat:path+"/web/sample/report/course/dim",// 观察计划维度统计

		watchDimStructure:path+"/web/sample/course/dim_structure/list",// 获取观察计划及其下维度列表（新增观察记录前）
		watchDimLevel_map:path+"/web/sample/dimLevel_map",// 所选维度的水平映射结构（用于选择水平）
		watchBatchAdd:path+"/web/sample/student/record/batch",// 批量新增
		watchUpdate2:path+"/web/sample/student/record/update2",// 更新观察记录
		watchSingle_detail:path+"/web/sample/student/record/single_detail",// 获取单项观察记录详情

		// 观察计划
		watchPlanList:path+"/web/sample/company/course/list",// 获取观察计划列表
		watchPlanDetail:path+"/web/sample/company/course/detail",// 获取观察计划详情
		watchPlanAddOrUpdate:path+"/web/sample/company/course/addOrUpdate",// 新增或更新观察计划
		watchPlanDelete:path+"/web/sample/company/course/delete",// 删除观察计划
		watchPlanTeacherList:path+"/web/sample/company/teacherList",// 关联教师

		// 综合评价
		watchStudentInfo:path+"/web/sample/evaluate/evaluateStudentInfo",// 月度评价学生列表
		watchStudentDetail:path+"/web/sample/evaluate/student/detail",// 学生月度评价详情
		watchStudentAddOrUpdate:path+"/web/sample/evaluate/student/addOrUpdate",// 新增或编辑学生月度评价

		watchConfigMonthList:path+"/web/sample/evaluate/config/monthList",// 获取所有月份配置列表
		watchConfigAdd:path+"/web/sample/evaluate/config/add",// 新增月度评价配置
		watchConfigAllDim:path+"/web/sample/evaluate/config/allDim",// 获取学校配置所有维度
		watchConfigDetail:path+"/web/sample/evaluate/config/detail",// 获取月度评价配置详情

		// 观察维度
		dimLevelDelete:path+"/web/sample/company/dimLevel/delete",// 删除学校维度水平
		dimDelete:path+"/web/sample/company/dim/delete",// 删除学校观察维度
		dimLevelAddOrUpdate:path+"/web/sample/company/dimLevel/addOrUpdate",// 新增或更新学校维度水平
		dimAddOrUpdate:path+"/web/sample/company/dim/addOrUpdate",// 新增或更新学校观察维度
		dimLevelList:path+"/web/sample/company/dimLevel/list",// 获取学校维度水平列表
		dimList:path+"/web/sample/company/dim/list",// 获取学校观察维度

		// 个体发展水平
		getStudentAbility:path+"/web/sample/TJ/TJ_GCJL_GetStudentAbilityStrong",// 个人综合能力评价 雷达图
		getStudentAbilityStrongChooseMonths:path+"/web/sample/TJ/TJ_GCJL_GetStudentAbilityStrongChooseMonths",// 个人综合能力评价 -手动选月份
		getStudentCourseAbility:path+"/web/sample/TJ/TJ_GCJL_GetStudentCourseAbility",// 个人课程 能力评价 雷达图
		getStudentCourseAbilityChooseMonths:path+"/web/sample/TJ/TJ_GCJL_GetStudentCourseAbilityChooseMonths",// 个人课程 能力评价 手动选月份
		

		// 班级发展水平
		getClassesAbilibySimple:path+"/web/sample/TJ/TJ_GCJL_GetClassesAbilibySimple",// 班级领域发展水平
		getCourseAbilibySimple:path+"/web/sample/TJ/TJ_GCJL_GetCourseAbilibySimple",// 班级游戏与生活观察
		getClassAbilibySimple:path+"/web/sample/TJ/TJ_GCJL_GetClassAbilibySimple",// 班级领域发展水平--数量统计 
		getCourseAbilibyCount:path+"/web/sample/TJ/TJ_GCJL_GetCourseAbilibyCount",// 课程发展水平--数量统计

		// 成长档案
		recordStudent:path+"/web/mbtrack/dan/student",// 获取学生列表（含档案信息）
		recordList:path+"/web/mbtrack/danbook/list",// 获取档案册列表
		recordMonthList:path+"/web/mbtrack/danbook/danList",// 获取档案册档案页详情
		recordNewDanbook:path+"/web/mbtrack/danbook/save",// 新建档案册
		recordDownload:path+"/file/patch/download",//图片批量下载（档案页）
		recordDanbookUpdate:path+"/web/mbtrack/danbook/update",// 档案册名更新

		recordTeacherStat:path+"/web/mbtrack/report/teacher",// 教师成长档案统计
		recordParentStat:path+"/web/mbtrack/report/parent",// 家长成长档案统计

		// 成长档案 模板设置
		recordTemAddOrUpdate:path+"/web/mbtrack/intelligence/monthPage/addOrUpdate",// 新增或编辑某月的模板
		recordTemCompanyMonthPageList:path+"/web/mbtrack/intelligence/companyMonthPageList",// 获取学校每月相册模版列表
		recordTemListOfAllPage:path+"/web/mbtrack/intelligence/listOfAllPage",// 获取所有可选的模板库

		// 考勤
		attendGetChildOfClass:path+"/web/attendance/teacher/getChildInfoOfClass",// 获得班级所有幼儿信息
		attendGetAttendanceRecord:path+"/web/attendance/teacher/getAttendanceRecord",// 获得考勤记录
		attendCheckConfirm:path+"/web/attendance/teacher/checkConfirm",// 教师端检查确认
		attendDisPlayAttendDays:path+"/web/attendance/teacher/disPlayAttendDays",// 查看已设置的考勤天数
		attendUpdateAttendDays:path+"/web/attendance/teacher/updateAttendDays",// 修改考勤天数设置
		attendResetAttendDays:path+"/web/attendance/teacher/resetAttendDays",// 复位考勤天数设置
		attendGetClassAttendanceInfo:path+"/web/attendance/teacher/getClassAttendanceInfo",// 获得班级考勤
		attendGetPersonalAttendance:path+"/web/attendance/parent/getPersonalAttendance",// 获得个人考勤
		attendExportRecordExcel:"/web/attendance/exportRecordExcel",// 请假记录导出(改)

		// 考勤统计
		attendClassStat:path+"/web/attendance/teacher/classStat",// 班级出勤人数统计(新)
		attendPersonalStat:path+"/web/attendance/teacher/personalStat",// 个人月出勤统计(新)
		attendExportPersonalExcel:"/web/attendance/exportPersonalExcel",// 个人出勤统计导出
		attendExportClassExcel:"/web/attendance/exportClassExcel",// 班级出勤人数统计导出
		attendExportSickLeaveExcel:"/web/attendance/exportSickLeaveExcel",// 病假事由统计导出
		attendSickLeaveStat:path+"/web/attendance/teacher/sickLeaveStat",// 病假事由统计(新)

		// 公告
		getMyClassInfo:path+"/web/basic/getMyClassInfo",// 获取我的班级信息
		getMyClassInfoIncludeTeacherGroup:path+"/web/basic/getMyClassInfoIncludeTeacherGroup",// 获取我的班级信息（包括教师群）
		getClassStuAndTeachers:path+"/web/basic/getClassStuAndTeachers",// 获取班级所有学生和老师
		getClassStus:path+"/web/basic/getClassStus",// 获取班级所有的学生
		noticeGetDesc:path+"/web/notice/getNoticeDesc",// 获取公告描述
		noticeReaded:path+"/web/notice/markNoticeReaded",// 公告置为已读
		noticeAddNew:path+"/web/notice/addNewNotice",// 新增新的公告内容
		noticeGetContentList:path+"/web/notice/getNoticeContent",// 获取某个公告内容列表
		noticeGetReadDetail:path+"/web/notice/getReadDetail",// 获取某条公告内容阅读详情
		noticeDelNoticeContent:path+"/web/notice/delNoticeContent",// 删除某条公告内容
		noticeUpdateNoticeContent:path+"/web/notice/updateNoticeContent",// 更新某条公告内容

		// 每周菜谱
		menuSaveTable:path+"/web/cookbook/saveTable",// 保存表格
		menuDeleteTable:path+"/web/cookbook/deleteTable",// 删除整张表
		menuUpdateTitle:path+"/web/cookbook/updateTitle",// 更新菜谱标题
		menuSelectCell:path+"/web/cookbook/selectCell",// 获得某个单元
		menuGetTitleList:path+"/web/cookbook/getTitleList",// 获得菜谱标题列表
		menuStructuringTableCell:path+"/web/cookbook/structuringTableCell",// 通过开始日期获取表单

		// 风险预警
		riskGetCompanyHealthAlert:path+"/web/healthAlert/getCompanyHealthAlert",// 获取登录人所在学校的所有预警
		riskGetAlertType:path+"/web/healthAlert/getAlertType",// 获取预警类型列表
		riskGetAlertAge:path+"/web/healthAlert/getAlertAge",// 获得预警年龄列表
		riskNewHealthAlert:path+"/web/healthAlert/newHealthAlert",// 新增风险预警
		riskGetHealthAlert:path+"/web/healthAlert/getHealthAlert",// 获取单条健康预警
		riskUpdateHealthAlert:path+"/web/healthAlert/updateHealthAlert",// 更改健康预警
		riskDeleteHealthAlert:path+"/web/healthAlert/deleteHealthAlert",// 删除健康预警

		// 健康信息
		healthGetExamDateList:path+"/web/healthInfo/getExamDateList",// 根据班级获得检查日期列表
		healthGetClassHealthInfo:path+"/web/healthInfo/getClassHealthInfo",// 获得班级健康信息
		healthGetChildListOfClass:path+"/web/healthInfo/getChildListOfClass",// 获得班级幼儿列表
		healthGetBirthdaySex:path+"/web/healthInfo/getBirthdaySex",// 获得幼儿生日及性别
		healthCalculateAge:path+"/web/healthInfo/calculateAge",// 根据生日，体检日期，计算年龄
		healthHPValue:path+"/web/healthInfo/HPValue",// 计算身高p值
		healthWPValue:path+"/web/healthInfo/WPValue",// 计算体重p值
		healthCalculateAll:path+"/web/healthInfo/calculateAll",// 计算数据(所有)
		healthFatnessValue:path+"/web/healthInfo/FatnessValue",// 计算肥胖值
		healthNewHealthInfo:path+"/web/healthInfo/newHealthInfo2",// 新增健康信息
		healthGetSingleHI:path+"/web/healthInfo/getSingleHI",// 获得单条健康信息
		healthUpdateHealthInfo:path+"/web/healthInfo/updateHealthInfo2",// 更新健康信息
		healthDeleteHealthInfo:path+"/web/healthInfo/deleteHealthInfo",// 删除健康信息
		healthImport:path+"/web/healthInfo/uploadExl",// 导入健康信息
		healthExport:"/web/healthInfo/exportExcel",// 导出健康信息详情

		// 成长曲线
		healthGraphWH:path+"/web/healthInfo/graphWH",// 按身高测体重(W/H)
		healthGraphHY:path+"/web/healthInfo/graphHY",// 按年龄测身高(H/Y)
		healthGraphWY:path+"/web/healthInfo/graphWY",// 按年龄测体重(W/Y)
		healthGraph:path+"/web/healthInfo/graph",// 按年龄测体重(W/Y)

		// 自选课程 剧场活动
		GetSchoolIds:path+"/web/activity/TSCourse_GetSchoolIds",//特色课程 获取学校课程id
		GetSchoolJYIds:path+"/web/activity/TSCourse_GetSchoolJYIds",//剧场活动 id
		GetSchoolCourses:path+"/web/activity/TSCourse_GetSchoolCourses",//特色课程 获取学校课程
		AddCourse:path+"/web/activity/TSCourse_AddCourse",//特色课程 新增
		AddCourse2:path+"/web/activity/TSCourse_AddCourse2",//特色课程 新增
		GetCourseDetails:path+"/web/activity/TSCourse_GetCourseDetails",//获取学校课程详情
		tsDelCourse:path+"/web/activity/TSCourse_DelCourse",// 删除学校课程
		tsGetBookedChildren:path+"/web/activity/TSCourse_GetBookedChildren",// 签到学生列表
		tsCallRoll:path+"/web/activity/TSCourse_CallRoll",// 签到
		tsCancelRoll:path+"/web/activity/TSCourse_CancelRoll",// 取消签到
		tsTempBookCourse:path+"/web/activity/TSCourse_tempBookCourse",// 补加预约人数

		getCourseSimpleTJ:path+"/web/activity/TSCourse_getCourseSimpleTJ",// 自选活动 活动统计 
		getCourseClassTJ:path+"/web/activity/TSCourse_getCourseClassTJ",// 自选活动 班级统计 
		getCourseStudentTJ:path+"/web/activity/TSCourse_getCourseStudentTJ",// 自选活动 学生统计 
		getCourseStudentDetailTJ:path+"/web/activity/TSCourse_getCourseStudentDetailTJ",// 自选活动 活动统计详情 
		getCourseAllTJ:path+"/web/activity/TSCourse_getCourseAllTJ2",// 自选活动 活动统计01

		// 文件中心
		fileGetRoot:path+"/web/fileCenter/getRoot",// 获取根目录
		fileGetChildFileInfo:path+"/web/fileCenter/getChildFileInfo",// 获取文件的所有子级文件
		fileGetSingleFileInfo:path+"/web/fileCenter/getSingleFileInfo",// 获取单项文件信息
		fileAddFileInfo:path+"/web/fileCenter/addFileInfo",// 增加一项文件信息
		fileDeleteFileInfo:path+"/web/fileCenter/deleteFileInfo",// 删除文件信息
		fileUpdateFileName:path+"/web/fileCenter/updateFileName",// 更新文件名

		// 个人区
		filePrivateGetRoot:path+"/web/fileCenter/private/getRoot",// 获取根目录
		filePrivateGetChildFileInfo:path+"/web/fileCenter/private/getChildFileInfo",// 获取文件的所有子级文件
		filePrivateGetSingleFileInfo:path+"/web/fileCenter/private/getSingleFileInfo",// 获取单项文件信息
		filePrivateAddFileInfo:path+"/web/fileCenter/private/addFileInfo",// 增加一项文件信息
		filePrivateDeleteFileInfo:path+"/web/fileCenter/private/deleteFileInfo",// 删除文件信息
		filePrivateUpdateFileName:path+"/web/fileCenter/private/updateFileName",// 更新文件名

		// 共享区
		filePublicGetRoot:path+"/web/fileCenter/public/getRoot",// 获取根目录
		filePublicGetChildFileInfo:path+"/web/fileCenter/public/getChildFileInfo",// 获取文件的所有子级文件
		filePublicGetSingleFileInfo:path+"/web/fileCenter/public/getSingleFileInfo",// 获取单项文件信息
		filePublicAddFileInfo:path+"/web/fileCenter/public/addFileInfo",// 增加一项文件信息
		filePublicDeleteFileInfo:path+"/web/fileCenter/public/deleteFileInfo",// 删除文件信息
		filePublicUpdateFileName:path+"/web/fileCenter/public/updateFileName",// 更新文件名

		fileCopy:path+"/web/fileCenter/copy",// 复制文件(夹)
		fileCut:path+"/web/fileCenter/cut",// 剪切文件(夹)

		// 调查问卷
		questionList:path+"/web/questionnaire/list",// 获取个人调查问卷列表
		questionReadUser:path+"/web/questionnaire/readUser/list",// 获取个人调查问卷列表
		questionDetail:path+"/web/questionnaire/detail/sumbit",// 查看问卷详情（已提交）
		questionAdd:path+"/web/questionnaire/add",// 新增调查问卷
		questionRemove:path+"/web/questionnaire/remove",// 删除调查问卷
		questionOption:path+"/web/questionnaire/option/userList",// 选项统计详情

		discoverKnowledgeList:path+"/web/discover/thirdLink/list",// 发现列表
		discoverKnowledgeAdd:path+"/web/discover/thirdLink/addOrUpdate",// 发现新增或编辑第三方链接
		discoverKnowledgeDetail:path+"/web/discover/thirdLink/detail",// 发现第三方链接详情
		discoverKnowledgeRemove:path+"/web/discover/thirdLink/remove",// 发现删除第三方链接

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
function chooseNiceScroll(AA,color,width) {
    $(AA).niceScroll({ 
        cursorcolor: color || "#ccc",//#CC0071 光标颜色 
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
        touchbehavior: true, //使光标拖动滚动像在台式电脑触摸设备 
        cursorwidth: width || "5px", //像素光标的宽度 
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













































