var user={
		// useruuid:GetQueryString("useruuid") || "ca47d137-90eb-4a60-8c4b-fd46d14c0966",// ��
		useruuid:GetQueryString("useruuid") || "db951cc0-a6b4-41d3-8ebb-607c04a1f812",// ��
		pid:GetQueryString("pid"),
		sid:GetQueryString("sid"),
		classId:GetQueryString("classId") || 2,
		perssionNames:GetQueryString("perssionNames")
};
var serverUrl01="http://www.member361.com";//84��ʽ������
var serverUrl02="https://121.43.150.38";//38���Է�����
var serverHost="http://www.member361.com";

var path01="http://172.168.90.101";//38���Է�����

var path=serverUrl02; //���ķ�������ַ�����ô�ֵ
var httpUrl={
		// �����ӿ�
		
		// login:path+"/jfinal_mbjy_basic/login",// ��ҳ����
		back:path+"/jfinal_mbjy_basic/back",//��ҳ����ص�
		loginHttp:path+"/jfinal_mbjy_basic/", // �����ַ
		logoutHttp:path, // ע����ַ
		// path_img:path+"/jfinal_mbjy_basic/file/showImg?fileMd5=", // ͼƬ��ַ
		
		picUrl:path+"/jfinal_mbjy_basic/file/upload", // ͼƬ�ϴ���ַ
		memberRecord:path+"/sample_front/memberRecord/memberRecord.html",//�ɳ�������ַ

		// 00�����ӿ�
		permission:path+"/jfinal_mbjy_basic/permission",// NAV���������Ҳ����ṹ
		getTeacherList:path+"/jfinal_mbjy_basic/account/getTeacherList", // ��ȡѧУ��ʦ��Ϣ
		getUserClassInfo01:path+"/jfinal_mbjy_basic/basic/GetUserClassInfo",//��ȡ�û��༶��Ϣ ������һ�ӿ���ͬ
		getAllClassInfo:path+"/jfinal_mbjy_basic/basic/getAllClassInfo",//��ȡȫ���༶�б�
		getClassMemberInfo:path+"/jfinal_mbjy_basic/basic/getClassMemberInfo",//��ȡ�༶��Ա��Ϣ
		getClassStudentInfo:path+"/jfinal_mbjy_basic/basic/getClassStudentInfo",//��ȡѧ����Ϣ
		
		// 01ʦ�ʹ���
		teacher:path+"/jfinal_mbjy_basic/teacher",// ��ʦ��Ϣ��ѯ

		// 02�������

		// 03��ѧ����
		courseList:path+"/jfinal_mbjy_sample/course/list",// ��ȡ�γ̼ƻ��б�
		courseSave:path+"/jfinal_mbjy_sample/course/save",// �����γ�
		courseUpdate:path+"/jfinal_mbjy_sample/course/update",// �༭�γ�
		courseDelete:path+"/jfinal_mbjy_sample/course/delete",// ɾ���γ�
		courseDetail:path+"/jfinal_mbjy_sample/course/detail", // �鿴�γ�����
		getPersonCourse:path+"/jfinal_mbjy_sample/course/getPersonCourse",// ��ȡ���˹۲�ƻ��б�
		courseDim:path+"/jfinal_mbjy_sample/dim/courseDim",// ��ȡ�۲�ƻ���ά���б�
		
		dailyEvaluationList:path+"/jfinal_mbjy_sample/record/list", //��ȡ�ճ����ۼ�¼�б�
		dailyEvaluationTypicalList:path+"/jfinal_mbjy_sample/record/typicalList", //��ȡ���Ͱ�����¼�б�
		dailyEvaluationDelete:path+"/jfinal_mbjy_sample/record/delete", // �ճ�����ɾ��
		dailyEvaluationSaveLevel:path+"/jfinal_mbjy_sample/record/saveLevel", // �����ճ��۲��¼
		dailyEvaluationUpdate:path+"/jfinal_mbjy_sample/record/update", // �����ճ��۲��¼
		dailyEvaluationDetail:path+"/jfinal_mbjy_sample/record/detail", // �ճ���������
		studentRecordList:path+"/jfinal_mbjy_sample/record/studentRecordList",//��ȡ�༶ѧ���۲��¼�б�

		watchDimensions:path+"/jfinal_mbjy_sample/dim/list", // �۲�ά�����ṹ
		dimSave:path+"/jfinal_mbjy_sample/dim/save",// �����۲�ά��
		dimUpdate:path+"/jfinal_mbjy_sample/dim/update",// �༭�۲�ά��
		dimDelete:path+"/jfinal_mbjy_sample/dim/delete", // ɾ���۲�ά��
		
		getDimLevelList:path+"/jfinal_mbjy_sample/dim/getDimLevelList", // ��ȡ�۲�ά�ȵ�ˮƽ����
		saveDimLevel:path+"/jfinal_mbjy_sample/dim/saveDimLevel", // �����۲�ά��ˮƽ����
		updateDimLevel:path+"/jfinal_mbjy_sample/dim/updateDimLevel", // �༭�۲�ά��ˮƽ����
		deleteDimLevel:path+"/jfinal_mbjy_sample/dim/deleteDimLevel", // ɾ���۲�ά��ˮƽ����
		
		//���ܼƻ�
		fileUpload:path+":18081/FileCloud/fileUpload", // �ϴ�
		fileDownload:path+":18081/FileCloud/fileDownload", // ����
		insertFileInfo:path+":18081/FileCloud/insertFileInfo", // ������ļ����У�
		deleteFileInfo:path+":18081/FileCloud/deleteFileInfo", // ɾ���ļ����У�
		updateFileName:path+":18081/FileCloud/updateFileName", // �������ļ����У�
		updateEvaluate:path+":18081/FileCloud/updateEvaluate", // �����ļ�����
		getRootFileUUID:path+":18081/FileCloud/getRootFileUUID", // ��ȡ���ļ���UUID
		getParentUUID:path+":18081/FileCloud/getParentUUID", // ��ȡ�ϼ��ļ���UUID
		getAllChildInfo:path+":18081/FileCloud/getAllChildInfo", // ��ȡ�Ӽ�ȫ���ļ����У�
		// 04��������
		getClassHealthInfo:path+":18082/HealthInfo/getClassHealthInfo",//��ð༶������Ϣ
		calculateAge:path+":18082/HealthInfo/calculateAge",//���ݵ������ڼ�������
		getExamDateListByClass:path+":18082/HealthInfo/getExamDateListByClass",//���ݰ༶��ü�������б�
		insertHealthInfo:path+":18082/HealthInfo/insertHealthInfo",//���ӽ�����Ϣ
		deleteHealthInfo:path+":18082/HealthInfo/deleteHealthInfo",//ɾ��������Ϣ
		updateHealthInfo:path+":18082/HealthInfo/updateHealthInfo",//���½�����Ϣ
		getPValue:path+":18082/HealthInfo/getPValue",//ȡ��pֵ
		getFatnessValue:path+":18082/HealthInfo/getFatnessValue",//ȡ�÷���ֵ
		getBirthdaySex:path+":18082/HealthInfo/getBirthdaySex",//ȡ��ѧԱ���պ��Ա�
		getSingleHealthInfo:path+":18082/HealthInfo/getSingleHealthInfo",// ������Ϣ�༭����
		importHealthInfo:path+":18082/HealthInfo/importHealthInfo",// ��������

		getDateList:path+":18082/HealthInfo/getTableInfoList",// ��ò��������б�
		healthGetTable:path+":18082/HealthInfo/getTable",// ������ű������
		healthSaveTable:path+":18082/HealthInfo/saveTable",// �����༭�����±�
		healthDeleteTable:path+":18082/HealthInfo/deleteTable",// ɾ������

		//����Ԥ��
		getCompanyHealthAlert:path+":18082/HealthInfo/getCompanyHealthAlert",//���Ԥ����Ϣ
		insertHealthAlert:path+":18082/HealthInfo/insertHealthAlert",//���ӽ���Ԥ��
		getAlertType:path+":18082/HealthInfo/getAlertType",//���Ԥ������
		getAlertAge:path+":18082/HealthInfo/getAlertAge",//���Ԥ������
		deleteHealthAlert:path+":18082/HealthInfo/deleteHealthAlert",//ɾ������Ԥ��
		updateHealthAlert:path+":18082/HealthInfo/updateHealthAlert",//�༭����Ԥ��
		getHealthAlert:path+":18082/HealthInfo/getHealthAlert",//�༭��õ���Ԥ����Ϣ��¼

		// 05��԰����
		recordStudent:path+":15001/mbtrack/dan/student",// ��ȡѧ���б���������Ϣ��
		recordList:path+":15001/mbtrack/danbook/list",// ��ȡ�������б�
		recordMonthList:path+":15001/mbtrack/danbook/danList",// ��ȡ�����ᵵ��ҳ����
		recordNewDanbook:path+":15001/mbtrack/danbook/save",// �½�������
		recordDownload:path+":15001/file/patch/download",//ͼƬ�������أ�����ҳ��
		recordDanbookUpdate:path+":15001/mbtrack/danbook/update",// ������������

		GetSchoolIds:path+":15001/imsInterface/TSCourse_GetSchoolIds",//��ɫ�γ� ��ȡѧУ�γ�id
		GetSchoolJYIds:path+":15001/imsInterface/TSCourse_GetSchoolJYIds",//�糡� id
		GetSchoolCourses:path+":15001/imsInterface/TSCourse_GetSchoolCourses",//��ɫ�γ� ��ȡѧУ�γ�
		AddCourse:path+":15001/imsInterface/TSCourse_AddCourse",//��ɫ�γ� ����
		GetCourseDetails:path+":15001/imsInterface/TSCourse_GetCourseDetails",//��ȡѧУ�γ�����
		tsDelCourse:path+":15001/imsInterface/TSCourse_DelCourse",// ɾ��ѧУ�γ�
		tsGetBookedChildren:path+":15001/imsInterface/TSCourse_GetBookedChildren",// ǩ��ѧ���б�
		tsCallRoll:path+":15001/imsInterface/TSCourse_CallRoll",// ǩ��
		tsCancelRoll:path+":15001/imsInterface/TSCourse_CancelRoll",// ȡ��ǩ��

		// 06��Ϣ����
		GetClassNotifyInfos:path+":12001/YY/GetClassNotifyInfos",// ��ð༶��б�
		getUserClassInfo:path+":12001/YY/GetUserClassInfo",//��ȡ�û��༶��Ϣ
		AddNewClassInfo:path+":12001/YY/AddNewClassInfo",// ��ȡ�༶��Ϣ

		GetSchoolNotifyInfos:path+":12001/YY/GetSchoolNotifyInfos",// ���ѧУ֪ͨ�б�
		AddNewSchoolInfo:path+":12001/YY/AddNewSchoolInfo",// ����ѧУ֪ͨ

		GetParentsLessionInfos:path+":12001/YY/GetParentsLessionInfos",// ��üҳ������б�
		AddParentsLessionInfo:path+":12001/YY/AddParentsLessionInfo",// �����ҳ�����

		GetHealthColumnInfos:path+":12001/YY/GetHealthColumnInfos",// ��ý���ר���б�
		AddHealthColumnInfo:path+":12001/YY/AddHealthColumnInfo",// ��������ר��

		GetNotify2Info:path+":12001/YY/GetNotify2Info",// ���� �����ܿ�
		AddNotify2Info:path+":12001/YY/AddNotify2Info",// ���� �����ܿ� ����

		// 07������ͳ��
		getPersonEvaluate:path+":48080/jfinal_mbjy_sample/report/getPersonEvaluate",// �����ۺ���������
		getClassEvaluate:path+":48080/jfinal_mbjy_sample/report/getClassEvaluate",// �༶�ۺ�����ˮƽ
		classRecord:path+":15001/jfinal_mbjy_sample/report/classRecord",// �༶�۲��¼ͳ��
		classRecordDim:path+":15001/jfinal_mbjy_sample/report/classRecordDim",// �۲�ָ���Ӧ�۲��¼ͳ��
		getStudentAbility:path+":15001/imsInterface/TJ_GCJL_GetStudentAbilityStrong",// �����ۺ��������� �״�ͼ
		getStudentCourseAbility:path+":15001/imsInterface/TJ_GCJL_GetStudentCourseAbility",// ���˿γ� �������� �״�ͼ
		getClassesAbilibySimple:path+":15001/imsInterface/TJ_GCJL_GetClassesAbilibySimple",// �༶�ۺ�����ˮƽ 
		getCourseAbilibySimple:path+":15001/imsInterface/TJ_GCJL_GetCourseAbilibySimple",// �༶�γ�����ˮƽ 
		getClassAbilibySimple:path+":15001/imsInterface/TJ_GCJL_GetClassAbilibySimple",// �༶�ۺ�����ˮƽ �״�ͼ
		getCourseSimpleTJ:path+":15001/imsInterface/TSCourse_getCourseSimpleTJ",// ��ѡ� �ͳ�� 
		getCourseClassTJ:path+":15001/imsInterface/TSCourse_getCourseClassTJ",// ��ѡ� �༶ͳ�� 
		getCourseStudentTJ:path+":15001/imsInterface/TSCourse_getCourseStudentTJ",// ��ѡ� ѧ��ͳ�� 
		getCourseStudentDetailTJ:path+":15001/imsInterface/TSCourse_getCourseStudentDetailTJ",// ��ѡ� �ͳ������ 


















		// �°�ӿ�
		// ����
		loginId:getCookie("loginId"),
		path_img:path+"/file/getImage?md5=", // ͼƬ��ַ
		login:path+"/web/login/loginChecking",// ��ҳ����
		loginUserInfo:path+"/web/basic/loginUserInfo",// ��õ�¼����Ϣ
		basicButton:path+"/web/ops/menu/button/list",// ��ȡ�˵����ܰ�ť�б�
		basicMyClassInfo:path+"/web/basic/myClassInfo",// ��õ�ǰ�� ���ڰ༶�б�
		basicAllClassInfo:path+"/web/basic/allClassInfo",// ��õ�¼������ѧУ���а༶�б�
		basicCompanyList:path+"/web/ops/company/list",// ��ȡ���е�ѧУ

		// �˵�
		menuList:path+"/web/ops/user/menu/list",// �˵��ӿ�
		menuChildList:path+"/web/ops/user/menu/childList",// ��ȡ�Ӳ˵��б�
		menuButtonList:path+"/web/ops/menu/button/list",// ��ȡ�˵����ܰ�ť�б�

		// ��ʦ��Ϣ
		teacherAdd:path+"/web/basic/staff/add",// �½���ְ��
		teacherSingleStaffInfo:path+"/web/basic/staff/singleStaffInfo",//  ��õ����ְ����Ŀ
		teacherUpdate:path+"/web/basic/staff/update",// ���½�ְ����Ŀ
		teacherDelete:path+"/web/basic/staff/delete",// �Ƴ���ְ��
		teacherAllType:path+"/web/basic/staff/allType",// ������н�ְ������
		teacherMyClassInfo:path+"/web/basic/myClassInfo",//  ��ý�ְ�����ڰ༶�б�
		teacherStaffInfo:path+"/web/basic/staff/staffInfo",//  ��ý�ְ���б�

		// �׶���Ϣ
		childrenAdd:path+"/web/basic/child/add",// �½��׶�
		childrenSingleChildInfo:path+"/web/basic/child/singleChildInfo",//  ��õ����׶���Ŀ
		childrenUpdate:path+"/web/basic/child/update",// �����׶���Ŀ
		childrenDelete:path+"/web/basic/child/delete",// �Ƴ��׶�
		childrenMyClassInfo:path+"/web/basic/myClassInfo",//  ����׶����ڰ༶�б�
		childrenInfo:path+"/web/basic/child/childInfo",//  ����׶��б�
		childrenParentInfo:path+"/web/basic/child/parentInfo",//  ����׶��ҳ��б�

		// �༶����
		classAdd:path+"/web/basic/org/add",// �½��༶
		classUpdate:path+"/web/basic/org/update",// ���°༶
		classDelete:path+"/web/basic/org/delete",// �Ƴ��༶
		classGradeList:path+"/web/basic/org/gradeList",// ����꼶�б�
		classInfo:path+"/web/basic/org/classInfo",// ��ð༶�б���Ա����
		classOfStaff:path+"/web/basic/org/staffOfClass",// ��ð༶��ְ���б�
		classSingleClassInfo:path+"/web/basic/org/singleClassInfo",//  ��õ���༶��Ŀ
		classBasicInfo:path+"/web/basic/org/classBasicInfo",//  ������а༶������Ϣ
		classUpgrade:path+"/web/basic/org/upgrade",//  ����
		classChange:path+"/web/basic/org/changeClass",//  ����
		classMemberBasic:path+"/web/basic/org/memberBasic",//  ��ȡ�༶�׶�����ְ������

		// �ȱ��ɳ�
		growthBanner:path+"/web/ops/company/banner/list",// �ȱ��ɳ� ��ȡѧУbanner
		growthAdd:path+"/web/growth/message/add",// �ȱ��ɳ� ����
		growthList:path+"/web/growth/message/list",// �ȱ��ɳ� ��ȡ�༶�����б�
		growthStudent:path+"/web/common/basic/class/student",// �ȱ��ɳ� ��ȡ��ǰ�༶ѧ���б�
		growthLabel:path+"/web/growth/label/list",// �ȱ��ɳ� ��ȡѧУ���еı�ǩ
		growthAddordelete:path+"/web/growth/praise/addordelete",// �ȱ��ɳ� ���޻���ȡ������
		growthCancelSticky:path+"/web/growth/message/cancelSticky",// �ȱ��ɳ� ȡ�������ö�
		growthCommentAdd:path+"/web/growth/comment/add",// �ȱ��ɳ� ����һ�����ۻ��߻ظ�
		growthCommentDelete:path+"/web/growth/comment/delete",// �ȱ��ɳ� ɾ��ĳһ������
		growthMessageDelete:path+"/web/growth/message/delete",// �ȱ��ɳ� ɾ��һ������

		// �˵�����
		menuButtonAddOrUpdate:path+"/web/ops/menu/button/addOrUpdate",// ��������°�ť��Ϣ
		menuAddOrUpdate:path+"/web/ops/menu/addOrUpdate",// ��������²˵���Ϣ
		menuCompanyUpdate:path+"/web/ops/company/menu/update",// ����ѧУ�˵���Ϣ
		menuCompanyList:path+"/web/ops/company/menu/list",// ��ȡѧУ�˵��б�
		menuButtonList:path+"/web/ops/button/list",// ��ȡ�˵���ť�б�

		// 08����
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
                    alert("���ʵ�ַ�����ڻ�ӿڲ������� �������404");
                },
                500:function(){
                    console.log("��Ϊ�������������������������� �������500");
                    // window.location.href=httpUrl.loginHttp;
                },
                405:function(){
                    alert("��Դ����ֹ �������405");
                }
            },
            beforeSend:function () {
            	// loadingIn();// loading����
            },	
            success:function(result){
                callback(result,callback01,callback02);
                // loadingOut(); // loading�˳�
            },
            error:function(result){
                console.log("����ʧ�� error!");
                // window.location.href=httpUrl.loginHttp;
            }
        });	
};


// loading���뺯��
function loadingIn() {
	$("#page-loader").removeClass('hide');
	$("#page-loader").css("z-index","999999");
};
function loadingOut(argument) {
	$("#page-loader").addClass('hide');	
};

Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //�·� 
        "d+": this.getDate(), //�� 
        "h+": this.getHours(), //Сʱ 
        "m+": this.getMinutes(), //�� 
        "s+": this.getSeconds(), //�� 
        "q+": Math.floor((this.getMonth() + 3) / 3), //���� 
        "S": this.getMilliseconds() //���� 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// ��ַ��search����ɸѡ����
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var result = window.location.search.substr(1).match(reg);
     return result?decodeURIComponent(result[2]):null;
}


// ����cookie ����ʱ��s20����20�� h12����12Сʱ d30����30��
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
// ��ȡcookie
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return unescape(arr[2]);
	}
	else{
		return null;
	}
};
// ɾ��cookie
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null){
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	};
};


// niceScroll������
function chooseNiceScroll(AA,color) {
    $(AA).niceScroll({ 
        cursorcolor: color || "#ccc",//#CC0071 �����ɫ 
        cursoropacitymax: 1, //�ı䲻͸���ȷǳ���괦�ڻ״̬��scrollabar���ɼ���״̬������Χ��1��0 
        touchbehavior: true, //ʹ����϶���������̨ʽ���Դ����豸 
        cursorwidth: "5px", //���ع��Ŀ�� 
        cursorborder: "0", //     �α�߿�css���� 
        cursorborderradius: "5px",//������Ϊ���߽�뾶 
        autohidemode: true //�Ƿ����ع����� 
    });
};

// ��Ϣ��ʾ����
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
















// �˵�
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
// ��� �˵��ӿ�
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
    };
};


// ��õ�¼����Ϣ
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

// ��ȡ�˵����ܰ�ť�б�
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
        $("#editBtn,#deleteBtn").addClass("disable"); // ���Ʊ༭��ɾ����ť����ʾ����
    };
};






























