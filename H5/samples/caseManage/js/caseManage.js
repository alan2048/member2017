httpUrl.addIndividualCase=path+"/app/heath/addIndividualCase";//新增个案
httpUrl.updateIndividualCase=path+"/app/heath/updateIndividualCase";//编辑个案
httpUrl.deleteIndividualCase=path+"/app/heath/deleteIndividualCase";//删除个案
httpUrl.individualCaseDetail=path+"/app/heath/individualCaseDetail";//获取个案详情列表
httpUrl.individualCaseList=path+"/app/heath/individualCaseList";//获取个案记录列表
httpUrl.heathExamList=path+"/app/heath/student/heathExamList";//获取某个学生的体检列表
httpUrl.classList=path+"/app/basic/myClassInfo"; // 获取当前人所在班级
httpUrl.basicStudent=path+"/app/heath/caseStudentList",// 获取当前班级学生列表

winResize();
$(function () {
	IndividualCaseList_port();

    section01Fn();
    sectionNewFn();
    sectionUpdateFn();
}); 

// 查看
function section01Fn() {
    // 查看
    $("#section01").on("click",".caseBox",function () {
        individualCaseDetail_port($(this).attr("data-uuid"),0);
        scroll2Top();
    });

    // 新增
    $("#section01").on("click","#addIcon",function () {
        if($("#class >option").length ==0){
            classList_port();
        }else{
            getClassStudentInfo_port($("#class").val());
        };
        
        scroll2Top();
        $("section").removeClass("current");
        $("#section02").addClass("current");
    });

    // 删除
    $("#section01").on("click",".deleteBtn",function (e) {
        e.stopPropagation();
        var uuid=$(this).attr("data-uuid");
        $(document).dialog({
            type:"confirm",
            titleShow:false,
            content: '确认删除此记录吗？',
            buttonTextCancel:"取消",
            buttonTextConfirm:"删除",
            onClickConfirmBtn:function () {
                deleteIndividualCase_port(uuid);
            }
        });
    });
};

// 新增
function sectionNewFn() {
    // 后退一步
    $("#section02").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
    });

    // 获取当前学生下的体检日期
    $("#section02").on("click",".studentBtn",function () {
        heathExamList_port($(this).attr("data-studentuuid"));
    });

    // 体检日期 后退一步
    $("#section03").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section02").addClass("current");
    });

    // 选定具体日期体检详情
    $("#section03").on("click",".heathExamBox",function () {
        var data=JSON.parse($(this).attr("data-content"));
        data.json=JSON.stringify(data);
        var html=template("currentExam_script",data);
        $("#currentExamBox").empty().append(html);

        scroll2Top();
        $("section").removeClass("current");
        $("#section04").addClass("current");
    });
    
    // 选定具体日期体检详情 后退一步
    $("#section04").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section03").addClass("current");
    });

    // 新增
    $("#section04").on("click","#addIcon01",function () {
        addIndividualCase_port();
    });
};

// 编辑
function sectionUpdateFn() {
    // 修改
    $("#section01").on("click",".editBtn",function (e) {
        e.stopPropagation();
        individualCaseDetail_port($(this).attr("data-uuid"),1);
    });

    // 后退一步
    $("#section05").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
    });

    // tab
    $("#section05").on("click",".updateDate >div >span",function () {
        $(this).addClass("current").siblings().removeClass("current");
        $(".updateDateBox >div").removeClass("current").eq($(this).index()).addClass("current");
    });

    // 编辑
    $("#section05").on("click","#addIcon02",function () {
        updateIndividualCase_port();
    });

    // 是否结案
    $("#section05").on("click",".switch",function () {
        $(this).toggleClass("on");
    });
};

function mobiscrollInit() {
    var currYear = (new Date()).getFullYear();  
    var opt={};
    opt.datetime = {preset : 'datetime'};
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'bottom', //显示方式 
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        startYear: currYear - 20, //开始年份
        endYear: currYear + 5 //结束年份
    };

    var optDateTime = $.extend(opt['datetime'], opt['default']);
    $("#mobiscrollBtn").mobiscroll(optDateTime).datetime(optDateTime);//年月日时分型
};

function scroll2Top() {
    $("html, body").animate({scrollTop:$("body").offset().top},400);
}
// 获取个案记录列表
function IndividualCaseList_port() {
    var data={
            pageNumber:0,
    		userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.individualCaseList,param,IndividualCaseList_callback);
};
function IndividualCaseList_callback(res) {
    if(res.code==200){	
        var data=JSON.parse(res.data);

        if(data.length >0){
            for(var i=0;i<data.length;i++){
                data[i].createDate=new Date(data[i].createTime*1000).Format("yyyy-MM-dd hh:mm");
                data[i].photo=httpUrl.path_img+data[i].studentPhoto+"-scale400";
            };
            var html=template("listBox_script",{arr:data});
            $(".listBox").empty().append(html);
        }else{
            $("#section01").addClass("empty");
        };

        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
    }else{
    	// alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 获取个案记录详情
function individualCaseDetail_port(uuid,editing) {
    var data={
            uuid:uuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.individualCaseDetail,param,individualCaseDetail_callback,editing);
};
function individualCaseDetail_callback(res,editing) {
    if(res.code==200){  
        var data=JSON.parse(res.data);
        console.log(data);
        data.createDate=new Date(data.createTime*1000).Format("yyyy-MM-dd hh:mm");
        if(data.endTime){
            data.endDate=new Date(data.endTime*1000).Format("yyyy-MM-dd hh:mm");
        }else{
            data.endDate="";
        };
        
        data.editing=editing;

        var html=template("updateExam_script",data);
        $("#updateExamBox").empty().append(html);

        $(".updateDate >div").width(2.7*(data.caseStageVOList.length+1)+"rem");
        $("section").removeClass("current");
        $("#section05").addClass("current");

        mobiscrollInit();
    }else{
        $(document).dialog({
            type:"notice",
            infoText:res.info,
            autoClose: 2500,
            position:"bottom"
        });
    }
};

// 新增个案
function addIndividualCase_port() {
    var curJson=JSON.parse($(".currentInfo").attr("data-json"));
    var data={
            analysis:$("#analysisInput").val(),
            examDate:curJson.examTime,
            examResult:curJson.fatnessResult,
            solution:$("#solutionInput").val(),
            studentUUID:curJson.studentUUID,
            userUUID: user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.addIndividualCase,param,addIndividualCase_callback);
};
function addIndividualCase_callback(res) {
    if(res.code==200){  
        IndividualCaseList_port();
    }else{
        $(document).dialog({
            type:"notice",
            infoText:res.info,
            autoClose: 2500,
            position:"bottom"
        });
    }
};

// 删除个案
function deleteIndividualCase_port(uuid) {
    var data={
            uuid:uuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.deleteIndividualCase,param,deleteIndividualCase_callback);
};
function deleteIndividualCase_callback(res) {
    if(res.code==200){  
        $(document).dialog({
            type:"notice",
            infoText:"删除成功",
            autoClose: 1000,
            position:"bottom"
        });

        IndividualCaseList_port();
    }else{
        $(document).dialog({
            type:"notice",
            infoText:res.info,
            autoClose: 1000,
            overlayShow:false,
            position:"bottom"
        });
    }
};

// 编辑个案
function updateIndividualCase_port() {
    var arr=[];
    for(var i=0;i<$(".updateDateBox >div:not(.summary)").length;i++){
        var obj={
                caseUUID:$(".summary").attr("data-uuid"),
                examDate:$(".updateDateBox >div:not(.summary)").eq(i).attr("data-examdate"),
                stageUUID:$(".updateDateBox >div:not(.summary)").eq(i).attr("data-stageuuid"),
                content:[]
        };
        for(var j=0;j<$(".updateDateBox >div:not(.summary)").eq(i).find("textarea").length;j++){
            obj.content.push($(".updateDateBox >div:not(.summary)").eq(i).find("textarea").eq(j).val())
        }
        arr.push(obj);
    };

    var data={
            caseUpdateDTOStr:{
                caseStageList:arr,
                createReason:$("#createReason").val(),
                endReason:$("#endReason").val(),
                endTime:function () {
                    var time="";
                    if($("#mobiscrollBtn").val()){
                        time=new Date($("#mobiscrollBtn").val()).getTime()/1000
                    };
                    return time;
                }(),
                status:function () {
                    var status=0;
                    if($(".switch").hasClass("on")){
                        status=1;
                    };
                    return status; 
                }(),
                summary:$("#summary").val(),
                uuid:$(".summary").attr("data-uuid")
            }
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.updateIndividualCase,param,updateIndividualCase_callback);
};
function updateIndividualCase_callback(res) {
    if(res.code==200){  
        IndividualCaseList_port();
    }else{
        $(document).dialog({
            type:"notice",
            infoText:res.info,
            autoClose: 2500,
            position:"bottom"
        });
    }
};

// 获取某个学生的体检列表
function heathExamList_port(studentUUID) {
    var data={
            studentUUID:studentUUID
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.heathExamList,param,heathExamList_callback,studentUUID);
};
function heathExamList_callback(res,studentUUID) {
    if(res.code==200){  
        var data=JSON.parse(res.data);
        if(data.length !=0){
            for(var i=0;i<data.length;i++){
                data[i].examTime=new Date(data[i].examDate).getTime()/1000;
                data[i].studentUUID=studentUUID;
                data[i].json=JSON.stringify(data[i]);
            };
            console.log(data);
            var html=template("heathExam_script",{arr:data});
            $("#heathExam").empty().append(html);

            $("section").removeClass("current");
            $("#section03").addClass("current");
        }else{
            $(document).dialog({
                type:"notice",
                infoText:"此学生暂无体检日期，请先在电脑端萌宝家园新建",
                autoClose: 4000,
                position:"bottom"
            });
        };
    }else{
        $(document).dialog({
            type:"notice",
            infoText:res.info,
            autoClose: 2500,
            position:"bottom"
        });
    }
};

// 获取当前人所在班级
function classList_port() {
    var data={
            userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.classList,param,classList_callback);
};
function classList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("class_script",data);
        $("#class").empty().append(html);
        
        // 默认第一班级的所有成员
        if(data.arr.length>0){
            getClassStudentInfo_port(data.arr[0].classUUID);
        };

        // 切换班级时成员接口切换
        $("#class").change(function () {
            var classId=$(this).val();
            getClassStudentInfo_port(classId);
        });
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 班级下学生列表 需改 过滤已生成学生
function getClassStudentInfo_port(classId) {
    var data={
            classId:classId,
            userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicStudent,param,getClassStudentInfo_callback);
};
function getClassStudentInfo_callback(res,tabIndex) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].photo=httpUrl.path_img+data[i].studentPhoto+"-scale400"
        };
        var html=template("students_script",{arr:data});
        $("#students").empty().append(html);
    }else{
        // console.log('请求错误，返回code非200');
    }
};

function winResize() {
    var fs=$(window).width()/750*100;
    $("html").css("font-size",fs);
    $(window).resize(function () {
        var fs01=$(window).width()/750*100;
        $("html").css("font-size",fs01);
    });
}; 