httpUrl.addOrUpdateDailyObservation=path+"/app/heath/addOrUpdateDailyObservation";//新增 编辑 全日观察
httpUrl.deleteDailyObservation=path+"/app/heath/deleteDailyObservation";//删除全日观察
httpUrl.dailyObservationDetail=path+"/app/heath/dailyObservationDetail";//获取全日观察详情列表
httpUrl.dailyObservationList=path+"/app/heath/dailyObservationList";//获取全日观察记录列表
httpUrl.classList=path+"/app/basic/myClassInfo"; // 获取当前人所在班级
httpUrl.basicStudent=path+"/common/basic/class/student",// 获取当前班级学生列表
httpUrl.roleOfUser=path+"/app/heath/roleOfUser",// 获取当前用户角色
winResize();
$(function () {
	dailyObservationList_port();

    section01Fn();
}); 

// 查看
function section01Fn() {
    // 查看
    $("#section01").on("click",".caseBox",function () {
        dailyObservationDetail_port($(this).attr("data-uuid"),0);
        scroll2Top();
    });

    // 修改
    $("#section01").on("click",".editBtn",function (e) {
        e.stopPropagation();
        dailyObservationDetail_port($(this).attr("data-uuid"),1);
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
                deleteDailyObservation_port(uuid);
            }
        });
    });

    // 新增界面 后退一步
    $("#section02").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
    });

    // 跳转至新增
    $("#section02").on("click",".studentBtn",function () {
        var data={
                amAnomaly: "",
                amDispose: "",
                morningAnomaly: "",
                morningDispose: "",
                observationTime: "",
                parentTell: "",
                pmAnomaly: "",
                pmDispose: "",
                studentName: $(this).attr("data-name"),
                studentPhoto: $(this).attr("data-studentphoto"),
                studentUUID: $(this).attr("data-studentuuid"),
                uuid: "",
                editing: 1
        };
            
        data.observationDate="";
        data.photo=httpUrl.path_img+data.studentPhoto+"-scale400";

        var html=template("update_script",data);
        $("#updateBox").empty().append(html);

        $("section").removeClass("current");
        $("#section03").addClass("current");

        mobiscrollInit();
    });

    // 详情页面 后退一步
    $("#section03").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
    });

    // 新增 修改 接口
    $("#section03").on("click","#addIcon02",function () {
        if($("#mobiscrollBtn").val()){
            addOrUpdateDailyObservation_port();
        }else{
            $(document).dialog({
                type:"notice",
                infoText:"观察日期为必填项",
                autoClose: 2000,
                position:"bottom"
            });
        }
        
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
// 获取全日观察记录列表
function dailyObservationList_port() {
    var data={
            pageNumber:0,
    		userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.dailyObservationList,param,dailyObservationList_callback);
};
function dailyObservationList_callback(res) {
    if(res.code==200){	
        var data=JSON.parse(res.data);

        if(data.length >0){
            for(var i=0;i<data.length;i++){
                data[i].createDate=new Date(data[i].createTime*1000).Format("yyyy-MM-dd hh:mm");
                data[i].observationDate=new Date(data[i].observationTime*1000).Format("yyyy-MM-dd hh:mm");
                data[i].photo=httpUrl.path_img+data[i].studentPhoto+"-scale400";
            };
            var html=template("listBox_script",{arr:data});
            $(".listBox").empty().append(html);
            $("#section01").removeClass("empty");
        }else{
            $(".listBox").empty();
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

// 获取全日观察记录详情
function dailyObservationDetail_port(uuid,editing) {
    var data={
            uuid:uuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.dailyObservationDetail,param,dailyObservationDetail_callback,editing);
};
function dailyObservationDetail_callback(res,editing) {
    if(res.code==200){  
        var data=JSON.parse(res.data);
        console.log(data);
        data.observationDate=new Date(data.observationTime*1000).Format("yyyy-MM-dd hh:mm");
        data.photo=httpUrl.path_img+data.studentPhoto+"-scale400";
        data.editing=editing;

        var html=template("update_script",data);
        $("#updateBox").empty().append(html);

        $("section").removeClass("current");
        $("#section03").addClass("current");

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

// 新增全日观察
function addOrUpdateDailyObservation_port() {
    var data={
            amAnomaly:$("#amAnomaly").val(),
            amDispose:$("#amDispose").val(),
            pmAnomaly:$("#pmAnomaly").val(),
            pmDispose:$("#pmDispose").val(),
            studentUUID:$(".photoBox").attr("data-studentuuid"),
            userUUID: user.useruuid,
            uuid: $(".photoBox").attr("data-uuid"),
            morningAnomaly: $("#morningAnomaly").val(),
            morningDispose: $("#morningDispose").val(),
            observationTime: function () {
                    var time="";
                    if($("#mobiscrollBtn").val()){
                        time=new Date($("#mobiscrollBtn").val()).getTime()/1000
                    };
                    return time;
            }(),
            parentTell: $("#parentTell").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.addOrUpdateDailyObservation,param,addIndividualCase_callback);
};
function addIndividualCase_callback(res) {
    if(res.code==200){  
        dailyObservationList_port();
    }else{
        $(document).dialog({
            type:"notice",
            infoText:res.info,
            autoClose: 2500,
            position:"bottom"
        });
    }
};

// 删除全日观察
function deleteDailyObservation_port(uuid) {
    var data={
            uuid:uuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.deleteDailyObservation,param,deleteDailyObservation_callback);
};
function deleteDailyObservation_callback(res) {
    if(res.code==200){  
        $(document).dialog({
            type:"notice",
            infoText:"删除成功",
            autoClose: 1000,
            position:"bottom"
        });

        dailyObservationList_port();
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
        console.log(data);
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