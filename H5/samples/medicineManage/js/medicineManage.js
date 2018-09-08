httpUrl.addOrUpdateMedicineRecord=path+"/app/heath/addOrUpdateMedicineRecord";//新增 编辑 全日观察
httpUrl.deleteMedicineRecord=path+"/app/heath/deleteMedicineRecord";//删除全日观察
httpUrl.medicineRecordDetail=path+"/app/heath/medicineRecordDetail";//获取全日观察详情列表
httpUrl.medicineRecordList=path+"/app/heath/medicineRecordList";//获取全日观察记录列表
httpUrl.classList=path+"/app/basic/myClassInfo"; // 获取当前人所在班级
httpUrl.basicStudent=path+"/app/heath/caseStudentList",// 获取当前班级学生列表
httpUrl.roleOfUser=path+"/app/heath/roleOfUser",// 获取当前用户角色
winResize();
$(function () {
	medicineRecordList_port();

    section01Fn();
}); 

// 查看
function section01Fn() {
    // 查看
    $("#section01").on("click",".caseBox",function () {
        medicineRecordDetail_port($(this).attr("data-uuid"),0);
        scroll2Top();
    });

    // 修改
    $("#section01").on("click",".editBtn",function (e) {
        e.stopPropagation();
        medicineRecordDetail_port($(this).attr("data-uuid"),1);
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
                deleteMedicineRecord_port(uuid);
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
                attention:"",
                disease:"",
                dosage:"",
                hospital:"",
                instruction:"",
                medicalRecordPicture:"",
                medicineName:"",
                medicinePicture:"",
                parentRemind:"",
                remark:"",
                studentName: $(this).attr("data-name"),
                studentPhoto: $(this).attr("data-studentphoto"),
                studentUUID: $(this).attr("data-studentuuid"),
                userUUID: user.useruuid,
                uuid: "",
                takeMedicineTime: "",
                editing: 1
        };
            
        data.takeMedicineDate="";
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
        addOrUpdateMedicineRecord_port();
    });

    // 时间新增按钮
    $("#section03").on("click","#addTimeBtn",function () {
        console.log(111);
        $("#mobiscrollBtn").click();
        console.log(111);
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
function medicineRecordList_port() {
    var data={
            pageNumber:0,
    		userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.medicineRecordList,param,medicineRecordList_callback);
};
function medicineRecordList_callback(res) {
    if(res.code==200){	
        var data=JSON.parse(res.data);

        console.log(data);
        if(data.length >0){
            for(var i=0;i<data.length;i++){
                data[i].createDate=new Date(data[i].createTime*1000).Format("yyyy-MM-dd hh:mm");
                data[i].takeMedicineDate=new Date(data[i].takeMedicineTime*1000).Format("yyyy-MM-dd hh:mm");
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

// 获取全日观察记录详情
function medicineRecordDetail_port(uuid,editing) {
    var data={
            uuid:uuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.medicineRecordDetail,param,medicineRecordDetail_callback,editing);
};
function medicineRecordDetail_callback(res,editing) {
    if(res.code==200){  
        var data=JSON.parse(res.data);
        console.log(data);
        data.takeMedicineDate=new Date(data.takeMedicineTime*1000).Format("yyyy-MM-dd hh:mm");
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
function addOrUpdateMedicineRecord_port() {
    var data={
            attention:$("#attention").val(),
            disease:$("#disease").val(),
            dosage:$("#dosage").val(),
            hospital:$("#hospital").val(),
            instruction:$("#instruction").val(),
            medicalRecordPicture:$("#medicalRecordPicture").val(),
            medicineName:$("#medicineName").val(),
            medicinePicture:$("#medicinePicture").val(),
            parentRemind:$("#parentRemind").val(),
            remark:$("#remark").val(),
            studentUUID:$(".photoBox").attr("data-studentuuid"),
            userUUID: user.useruuid,
            uuid: $(".photoBox").attr("data-uuid"),
            takeMedicineTime: function () {
                    var time="";
                    if($("#mobiscrollBtn").val()){
                        time=new Date($("#mobiscrollBtn").val()).getTime()/1000
                    };
                    return time;
            }()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.addOrUpdateMedicineRecord,param,addIndividualCase_callback);
};
function addIndividualCase_callback(res) {
    if(res.code==200){  
        medicineRecordList_port();
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
function deleteMedicineRecord_port(uuid) {
    var data={
            uuid:uuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.deleteMedicineRecord,param,deleteMedicineRecord_callback);
};
function deleteMedicineRecord_callback(res) {
    if(res.code==200){  
        $(document).dialog({
            type:"notice",
            infoText:"删除成功",
            autoClose: 1000,
            position:"bottom"
        });

        medicineRecordList_port();
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