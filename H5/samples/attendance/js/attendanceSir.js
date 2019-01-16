httpUrl.loginUserInfo=path+"/app/basic/loginUserInfo";// 获得登录人员信息
httpUrl.myAttendInfo=path+"/app/teacherAttendance/my/attendInfo";// 我的考勤记录
httpUrl.myAddTLeave=path+"/app/teacherAttendance/my/addTLeave";// 新增请假
httpUrl.myLeaveType=path+"/app/teacherAttendance/my/leaveType";// 请假类型

httpUrl.teacherAttendHomePage=path+"/app/teacherAttendance/teacher/attendHomePage";// 01首页
httpUrl.teacherLeaveRecord=path+"/app/teacherAttendance/teacher/leaveRecord";// 02请假列表
httpUrl.teacherLeaveRecordForApproval=path+"/app/teacherAttendance/teacher/leaveRecordForApproval";// 03请假审批列表（未审批/已审批）
httpUrl.teacherLeaveApproval=path+"/app/teacherAttendance/teacher/leaveApproval";// 04请假审批（同意，拒绝）
httpUrl.teacherDeleteTLeave=path+"/app/teacherAttendance/teacher/deleteTLeave";// 05请假删除
httpUrl.teacherCheckingRecord=path+"/app/teacherAttendance/teacher/checkingRecord";// 06打卡记录
httpUrl.teacherPastRecord=path+"/app/teacherAttendance/teacher/pastRecord";// 07历史记录
httpUrl.teacherSignInOut=path+"/app/teacherAttendance/teacher/signInOut";// 07补卡

var monthObj=[];
winResize();
$(function () {
    roleOfUser_port();

    $("body").on("focus","textarea",function () {
        $(".backBar").css("position","absolute"); 
    }).on("blur","textarea",function () {
        $(".backBar").css("position","fixed"); 
    });
}); 

// 查看
function section01Fn() {
    calendarInit();

    // tab切换
    $("#section01").on("click",".tabHeader >div",function (e) {
        $(this).addClass('active').siblings().removeClass('active');
        $(".tabBody >div").removeClass("active").eq($(this).index()).addClass("active");
    });

    // 日期切换
    $("#section01").on("click","#mobiscrollBtn01",function (e) {
        var nextYear=new Date().getFullYear()+1;
        var options={
                type:"date",
                beginDate:new Date(2015,12,01),
                endDate:new Date(nextYear,11,31)
        };
        var _self=$(this);
        var dtPicker = new mui.DtPicker(options); 
        dtPicker.setSelectedValue($(this).val());
        dtPicker.show(function (item) { 
            $(_self).val(item.value);
            teacherAttendHomePage_port();
            dtPicker.dispose();
        });
    });

    // 请假列表
    $("#section01").on("click",".leaveBtn",function (e) {
        teacherLeaveRecord_port();
    });

    // 新增界面 后退一步
    $("#leaveSection").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
        document.title="教师考勤";
    });

    // 请假审批
    $("#section01").on("click",".approveBtn",function (e) {
        $(".approveBody >div").empty();
        teacherLeaveRecordForApproval_port(0);// 未审批
        teacherLeaveRecordForApproval_port(1);// 已审批
    });

    // 请假审批 tab切换
    $("#approveSection").on("click",".approveTab >div",function (e) {
        $(this).addClass('active').siblings().removeClass('active');
        $(".approveBody >div").removeClass("active").eq($(this).index()).addClass("active");
    });

    // 请假审批 展开更多
    $("#approveSection").on("click",".approveMore",function (e) {
        $(this).addClass('hide').siblings().removeClass('hide');
    });

    // 请假审批 拒绝 同意
    $("#approveSection").on("click",".approveRefuse,.approveAgree",function (e) {
        var data={
                flag:$(this).attr("data-flag"),
                tleaveUUID:$(this).parent().attr("data-tleaveuuid")
        };
        teacherLeaveApproval_port(data);
    });

    // 请假审批 删除
    $("#approveSection").on("click",".approveDel",function (e) {
        e.stopPropagation();
        var uuid=$(this).parent().attr("data-tleaveuuid");
        $(document).dialog({
            type:"confirm",
            titleShow:false,
            content: '确认删除此记录吗？',
            buttonTextCancel:"取消",
            buttonTextConfirm:"删除",
            onClickConfirmBtn:function () {
                teacherDeleteTLeave_port(uuid);
            }
        });
    });

    // 请假审批 后退一步
    $("#approveSection").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
        document.title="教师考勤";
    });

    // 打卡记录
    $("#section01").on("click",".checkBtn",function (e) {
        teacherCheckingRecord_port();
    });

    // 打卡记录 后退一步
    $("#checkSection").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
        document.title="教师考勤";
    });

    // 历史记录
    $("#checkSection").on("click",".historyBtn",function (e) {
        var data={
                useruuid:$(this).attr("data-useruuid"),
                username:$(this).attr("data-name")
        };
        
        $("#historyList").empty();
        teacherPastRecord_port(0,data);
        scroll2Top(100);
    });

    // 补卡
    $("#checkSection").on("click",".signInOutBtn",function (e) {
        e.stopPropagation();

        var uuid=$(this).attr("data-useruuid");
        $(document).dialog({
            type:"confirm",
            titleShow:false,
            content: '确认手动补卡吗？',
            buttonTextCancel:"取消",
            buttonTextConfirm:"确定",
            onClickConfirmBtn:function () {
                teacherSignInOut_port(uuid);
            }
        });
    });

    // 滚动到底部继续加载数据
    window.onscroll=function () {
        if($("#historySection").hasClass("current")){
            if(getDocumentTop() == (getScrollHeight()-getWindowHeight())){
                if($(".historyItem").length !=0 && $(".historyItem").length%20 ==0){
                    var data={
                            useruuid:$(".historyHide").attr("data-uuid"),
                            username:$(".historyHide").attr("data-name")
                    };
                    teacherPastRecord_port(parseInt($(".historyItem").length/20),data);
                };
            };

            for(var i=0;i<$(".historyTitle").length;i++){
                var h=$(".historyTitle").eq(i).offset().top - $(window).scrollTop();
                $(".historyTitle").eq(i).attr("data-high",h);
                if(h <0){
                    $(".historyTitle").eq(i).addClass("cover");
                }else{
                    $(".historyTitle").eq(i).removeClass("cover");   
                };
            };

            var num=$(".historyTitle.cover").length;
            if(num !=0){
                $(".historyTop").text($(".historyTitle.cover").eq(num-1).text()).removeClass("hide");
            }else{
                $(".historyTop").addClass("hide");
            };
        };

        if($("#approveSection").hasClass("current")){
            if(getDocumentTop() == (getScrollHeight()-getWindowHeight())){
                if($(".approveBody >div.active >.approveLi").length !=0 && $(".approveBody >div.active >.approveLi").length%20 ==0){
                    teacherLeaveRecordForApproval_port($(".approveBody >div.active").index(),$(".approveBody >div.active >.approveLi").length/20);
                };
            };
        };
    };

    // 历史记录 后退一步
    $("#historySection").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#checkSection").addClass("current");
        document.title="打卡记录";
    });

    // 新增 btn
    $("#section01").on("click","#addIcon",function () {
        var year=new Date().getFullYear();
        var month=new Date().getMonth()+1;
        if(month < 10){
             month="0"+month
        };
        var day=new Date().getDate();
        if(day < 10){
            day="0"+day
        };

        var data={
                time:year+"-"+month+"-"+day,
                timeShow:year+"年"+month+"月"+day+"日"
        };
        var html=template("leaveTimeBox_script",data);
        $(".leaveTimeBox").empty().append(html);
        $(".addTotalIcon").text(9);
        $("#description").val("");

        if($("#leaveType").children().length ==0){
            myLeaveType_port();    
        }else{
            $("#leaveType >option:first").prop("selected",true);
            $(".descNum").text("0");
            $("#addPicBtn").parent("li").removeClass("hide");
            $(".picItem").remove();
        };

        scroll2Top();
        $("section").removeClass("current");
        $("#addSection").addClass("current");
        document.title="新增请假";
    });

    // 新增 后退一步
    $("#addSection").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
        document.title="教师考勤";
    });

    // 删除图片
    $("#addSection").on("click",".deleteIcon",function (e) {
        e.stopPropagation();
        $(this).parents(".picItem").remove();
        if($("#carousel .picItem").length <4){
            $(".addPicBox").removeClass("hide");
        };
    });

    // 删除时间段
    $("#addSection").on("click",".leaveDelBtn",function (e) {
        e.stopPropagation();
        var p=$(this).parent();
        $(document).dialog({
            type:"confirm",
            titleShow:false,
            content: '确认删除此条请假记录吗？',
            buttonTextCancel:"取消",
            buttonTextConfirm:"删除",
            onClickConfirmBtn:function () {
                $(p).remove();
                calculateTotalTime();
            }
        });
    });

    // 增加时间段
    $("#addSection").on("click",".addTool",function (e) {
        if($(".leavePart").length ==0){
            var year=new Date().getFullYear();
            var month=new Date().getMonth()+1;
            if(month < 10){
                month="0"+month
            };
            var day=new Date().getDate();
            if(day < 10){
                day="0"+day
            };

            var data={
                    time:year+"-"+month+"-"+day,
                    timeShow:year+"年"+month+"月"+day+"日"
            };
            var html=template("leaveTimeBox_script",data);
            $(".leaveTimeBox").empty().append(html);
        }else{
            var length=$(".leavePart").length-1;
            $(".leaveTimeBox").append($(".leavePart").eq(length).clone());

            var max=$(".leavePart").length;
            var time=$(".leavePart").eq(max-1).find(".dateBtn").attr("data-time");
            var iosTime=time.replace(/-/g,'/');
            var nextDate = new Date(new Date(iosTime).getTime() + 24*60*60*1000).Format("yyyy-MM-dd");
            var nextDateStr = new Date(new Date(iosTime).getTime() + 24*60*60*1000).Format("yyyy年MM月dd日");
            $(".leavePart").eq(max-1).find(".dateBtn").attr("data-time",nextDate).text(nextDateStr);
        };
        
        calculateTotalTime();
    });

    // 改变日期
    $("#addSection").on("click",".dateBtn",function (e) {
        var nextYear=new Date().getFullYear()+1;
        var options={
                type:"date",
                beginDate:new Date(2015,12,01),
                endDate:new Date(nextYear,11,31)
        };
        var _self=$(this);
        var dtPicker = new mui.DtPicker(options); 
        dtPicker.setSelectedValue($(this).attr("data-time"));
        dtPicker.show(function (item) { 
            var arr=item.value.split("-");
            var string=arr[0]+"年"+arr[1]+"月"+arr[2]+"日";
            $(_self).attr("data-time",item.value).text(string);
            dtPicker.dispose();
        });
    });

    // 改变时段
    $("#addSection").on("click",".timeBtn",function (e) {
        var options={
                "type":"time",
                "customData":{
                    "i":[
                        { value: "00", text: "00" },
                        { value: "30", text: "30" },
                    ]
                }
        };

        var _self=$(this);
        var dtPicker = new mui.DtPicker(options);

        var pDate=$(this).parents(".leavePart").find(".dateBtn").attr("data-time");
        dtPicker.setSelectedValue(pDate+" "+$(this).text());
        dtPicker.show(function (item) { 
            $(_self).text(item.value);
            calculateTotalTime();
            dtPicker.dispose();
        });
    });

    // 新增保存
    $("#addSection").on("click",".saveBtn",function (e) {
        if($(".leavePart").length ==0){
            toastTip("请先添加时间段","",1200);
        }else if(!$("#description").val()){
            toastTip("请先填写请假理由","",1200);
        }else{
            myAddTLeave_port();
        };
    });

    // 请假理由 最大字数
    $("#addSection").on("keyup","textarea",function (e) {
        $(".leaveDesc >.addTitle .fr i").text($(this).val().length);
    });

    $("#section01,#checkSection,#historySection,#approveSection,#addSection").on("click",".pic",function () {
        var data=[];
        for(var i=0;i<$(this).parent().find(".pic").length;i++){
            data.push($(this).parent().find(".pic").eq(i).attr("data-pic"))
        };

        var index=$(this).index();// 定位到当前图片
        var openPhotoSwipe = function() {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var items = [];
            for(var i=0;i<data.length;i++){
                var obj={
                        src:httpUrl.path_img+data[i]+"?imageMogr2/auto-orient/thumbnail/1000x1000/interlace/1/blur/1x0/quality/90",
                        w:1000,
                        h:750
                };
                items.push(obj);
            };
            var options = {    
                    history: false,
                    focus: false,
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0,
                    index:index
            };
            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        openPhotoSwipe();
    }); 
    
};

function calculateTotalTime() {
    var total=0;
    if($(".leavePart").length ==0){
        toastTip("请先添加时间段","",1200);
    }else{
        for(var i=0;i<$(".leavePart").length;i++){
            var arr01=$(".leavePart").eq(i).find(".timeBtn01").text().split(":");
            var time01=Number(arr01[0])*60+Number(arr01[1]);

            var arr02=$(".leavePart").eq(i).find(".timeBtn02").text().split(":");
            var time02=Number(arr02[0])*60+Number(arr02[1]);

            if(time02 < time01){
                toastTip("请假开始时间需大于结束时间");
                $(".leavePart").eq(i).find(".timeBtn").addClass("error");
            }else{
                total += time02- time01;
                $(".leavePart").eq(i).find(".timeBtn").removeClass("error");
            }
        };
    };

    $(".addTotalIcon").text(total/60);

    if($(".leavePart").length == 10){
        $(".addTool").addClass("hide");
    }else{
        $(".addTool").removeClass("hide");
    };
};

// 班级下学生列表 需改 过滤已生成学生
function roleOfUser_port() {
    var data={
            userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.loginUserInfo,param,roleOfUser_callback);
};
function roleOfUser_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#page-loader").removeClass("in");
        user.typeID=data.typeID;
        user.userUUID=data.userUUID;
        user.companyUUID=data.companyUUID;

        // 园长和普通教师权限
        if(user.typeID >=13){
            $(".tabHeader").addClass("hide");
        }else{
            mobiscrollInit();
        };

        section01Fn();
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 我的考勤记录
function myAttendInfo_port (today) {
    var curArr=$("#calendarTitleCenter").text().split(" ");

    var data={
            month:curArr[1].replace(/月/,""),
            year:curArr[0].replace(/年/,""),
            loginUserUUID:user.userUUID
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.myAttendInfo,param,myAttendInfo_callback,data,today);
};
function myAttendInfo_callback(res,time,today) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].stamp=new Date(new Date(time.year+"/"+time.month+"/"+data[i].day).toLocaleDateString()).getTime();
            data[i].path_img=httpUrl.path_img;
        };

        // 重置
        $(".calendar-item .calendar-item-body >li").removeClass("thing sick public adjust other refuse");
        $(".calendar-item .calendar-item-body >li >span").remove();

        var num=0;
        for(i in data){
            if(data[i].tleaveList.length !=0){
                num++;
                switch (data[i].tleaveList[0].leaveIcon){
                    case "事":
                        $(".calendar-item[data-year="+time.year+"][data-month="+time.month+"] .calendar-item-body >li:not(.calendar-disabled)[data-stamp="+data[i].stamp+"]").addClass("thing").append("<span>"+data[i].tleaveList[0].leaveIcon+"</span>");
                        break;
                    case "病":
                        $(".calendar-item[data-year="+time.year+"][data-month="+time.month+"] .calendar-item-body >li:not(.calendar-disabled)[data-stamp="+data[i].stamp+"]").addClass("sick").append("<span>"+data[i].tleaveList[0].leaveIcon+"</span>");
                        break;
                    case "公":
                        $(".calendar-item[data-year="+time.year+"][data-month="+time.month+"] .calendar-item-body >li:not(.calendar-disabled)[data-stamp="+data[i].stamp+"]").addClass("public").append("<span>"+data[i].tleaveList[0].leaveIcon+"</span>");
                        break;
                    case "调":
                        $(".calendar-item[data-year="+time.year+"][data-month="+time.month+"] .calendar-item-body >li:not(.calendar-disabled)[data-stamp="+data[i].stamp+"]").addClass("adjust").append("<span>"+data[i].tleaveList[0].leaveIcon+"</span>");
                        break;
                    case "其":
                        $(".calendar-item[data-year="+time.year+"][data-month="+time.month+"] .calendar-item-body >li:not(.calendar-disabled)[data-stamp="+data[i].stamp+"]").addClass("other").append("<span>"+data[i].tleaveList[0].leaveIcon+"</span>");
                        break;
                    case "拒":
                        $(".calendar-item[data-year="+time.year+"][data-month="+time.month+"] .calendar-item-body >li:not(.calendar-disabled)[data-stamp="+data[i].stamp+"]").addClass("refuse").append("<span>"+data[i].tleaveList[0].leaveIcon+"</span>");
                        break;
                    default:
                        $(".calendar-item[data-year="+time.year+"][data-month="+time.month+"] .calendar-item-body >li:not(.calendar-disabled)[data-stamp="+data[i].stamp+"] span").remove();
                };
            };
        };
        if(num ==0){
            toastTip("此月暂无请假记录。。","",500);
        };

        monthObj.length=0;
        monthObj=data;// 获得当前全月数据
        if(today ==1){
            $(".calendar-item-body >li").removeClass("selected");
            $('.today').addClass("selected");
            var stamp=new Date(new Date().toLocaleDateString()).getTime();// 获得当日0点时间戳
                
            var day=Number($('.calendar-item-' + stamp).attr("data-day"));
            monthObj[day-1].isToday=true;
            var html01=template("checkBox_script",monthObj[day-1]);
            var html02=template("leaveBox_script",monthObj[day-1]);
                
            $(".checkBox").empty().append(html01);
            $(".leaveBox").empty().append(html02);
            
        }else{
            $(".calendar-item-body >li").removeClass("selected");
            $(".calendar-item-body >li[data-day=1]").addClass("selected");
                
            if($(".calendar-item-body >li[data-day=1]").hasClass('today')){
                monthObj[0].isToday=true;
            }else{
                monthObj[0].isToday=false;
            };
            var html01=template("checkBox_script",monthObj[0]);
            var html02=template("leaveBox_script",monthObj[0]);
                
            $(".checkBox").empty().append(html01);
            $(".leaveBox").empty().append(html02);
        };
    }else{
        toastTip(res.info,"",2000);
    };
};

// 请假类型
function myLeaveType_port () {
    var data={};
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.myLeaveType,param,myLeaveType_callback);
};
function myLeaveType_callback(res,today) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("leaveType_script",data);
        $("#leaveType").append(html);

        loadFiles();
    };
};

// 新增考勤记录
function myAddTLeave_port () {
    var picList=[];
    for(var i=0;i<$(".picItem").length;i++){
        picList.push($(".picItem").eq(i).attr("data-pic"));
    };

    var leaveDateList=[];
    for(var i=0;i<$(".leavePart").length;i++){
        var string=$(".leavePart").eq(i).find(".dateBtn").text()+" "+$(".leavePart").eq(i).find(".timeBtn01").text()+","+$(".leavePart").eq(i).find(".timeBtn02").text();
        leaveDateList.push(string);
    };

    var data={
            description:$("#description").val(),
            duration:$(".addTotalIcon").text(),
            leaveDateList:leaveDateList,
            leaveType:$("#leaveType").val(),
            leaveUserUUID:user.userUUID,
            picList:picList,
            requestID:new Date().getTime()
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.myAddTLeave,param,myAddTLeave_callback);
};
function myAddTLeave_callback(res,today) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        myAttendInfo_port();

        if(!$(".tabHeader").hasClass("hide")){
            teacherAttendHomePage_port();
        };
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");

        toastTip("请假提交成功");
    }else{
        toastTip(res.info,"",1200);
    };
};

// 全园 首页
function teacherAttendHomePage_port () {
    var arr=$("#mobiscrollBtn01").val().split("-");
    var data={
            day:Number(arr[2]),
            month:Number(arr[1]),
            year:Number(arr[0]),
            loginUserUUID:user.userUUID
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.teacherAttendHomePage,param,teacherAttendHomePage_callback);
};
function teacherAttendHomePage_callback(res,today) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("schoolBox_script",data);
        $(".schoolBox").empty().append(html);
    };
};

// 请假列表
function teacherLeaveRecord_port () {
    var arr=$("#mobiscrollBtn01").val().split("-");
    var data={
            day:Number(arr[2]),
            month:Number(arr[1]),
            year:Number(arr[0]),
            loginUserUUID:user.userUUID
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.teacherLeaveRecord,param,teacherLeaveRecord_callback,data.day);
};
function teacherLeaveRecord_callback(res,day) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        if(data.length ==0){
            $("#leaveList").empty();
            $("#leaveSection").addClass("empty");
        }else{
            $("#leaveSection").removeClass("empty");

            for(var i=0;i<data.length;i++){
                data[i].day=day;
                switch (data[i].leaveType){
                    case "事假":
                        data[i].leaveClass="thing";
                        break;
                    case "病假":
                        data[i].leaveClass="sick";
                        break;
                    case "公假":
                        data[i].leaveClass="public";
                        break;
                    case "调休假":
                        data[i].leaveClass="adjust";
                        break;
                    case "调休":
                        data[i].leaveClass="adjust";
                        break;
                    case "其他":
                        data[i].leaveClass="other";
                        break;
                    case "其他假":
                        data[i].leaveClass="other";
                        break;
                    default:
                        data[i].leaveClass="";
                };
            };  

            var html=template("leaveList_script",{arr:data});
            $("#leaveList").empty().append(html);
        };
        
        $("section").removeClass("current");
        $("#leaveSection").addClass("current");
        document.title="请假列表";
    };
};

// 请假审批
function teacherLeaveRecordForApproval_port (flag,pageNum) {
    var data={
            flag:flag,
            pageNum:pageNum || 0,
            loginUserUUID:user.userUUID
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.teacherLeaveRecordForApproval,param,teacherLeaveRecordForApproval_callback,flag);
};
function teacherLeaveRecordForApproval_callback(res,flag) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        if(data.length !=0){
            $("#approveSection").removeClass("empty");

            for(var i=0;i<data.length;i++){
                data[i].leaveDateArr=data[i].leaveDateStr.split("|");
                
            };  

            var html=template("approveList_script",{arr:data,path_img:httpUrl.path_img});
            $(".approveBody >div").eq(flag).append(html);
        };

        for(var i=0;i<$(".approveBody >div").length;i++){
            if($(".approveBody >div").eq(i).children().length ==0){
                $(".approveBody >div").eq(i).addClass("empty");
            }else{
                $(".approveBody >div").eq(i).removeClass("empty");
            };
        };

        $(".upgrading").remove();
        
        $("section").removeClass("current");
        $("#approveSection").addClass("current");
        document.title="请假审批";
    };
};

// 请假审批（同意，拒绝）
function teacherLeaveApproval_port (json) {
    var data={
            flag:json.flag,
            tleaveUUID:json.tleaveUUID ,
            loginUserUUID:user.userUUID
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.teacherLeaveApproval,param,teacherLeaveApproval_callback,data.tleaveUUID);
};
function teacherLeaveApproval_callback(res,tleaveUUID) {
    if(res.code==200 || res.code == 2969){
        if(res.code == 200){
            toastTip("操作成功","",1000);
        }else{
            toastTip(res.info,"",2000);
        };
        
        
        $(".approveBody >div").eq(0).children().addClass("upgrading");// 解决数据刷新及自动定位问题
        teacherLeaveRecordForApproval_port(0);// 已审批

        $(".approveBody >div").eq(1).empty();
        teacherLeaveRecordForApproval_port(1);// 已审批

        myAttendInfo_port();
        teacherAttendHomePage_port();// 全园数据跟随刷新
    }else {
        toastTip(res.info,"",2000);
    };
};

// 请假审批 删除
function teacherDeleteTLeave_port (tleaveUUID) {
    var data={
            tleaveUUID:tleaveUUID ,
            loginUserUUID:user.userUUID
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.teacherDeleteTLeave,param,teacherDeleteTLeave_callback,data.tleaveUUID);
};
function teacherDeleteTLeave_callback(res,tleaveUUID) {
    if(res.code==200){
        toastTip("删除成功","",1000);
        
        $(".approveBody >div.active >div[data-tleaveuuid="+tleaveUUID+"]").remove();

        for(var i=0;i<$(".approveBody >div").length;i++){
            if($(".approveBody >div").eq(i).children().length ==0){
                $(".approveBody >div").eq(i).addClass("empty");
            }else{
                $(".approveBody >div").eq(i).removeClass("empty");
            };
        };

        myAttendInfo_port();
        teacherAttendHomePage_port();
    }else{
        toastTip(res.info,"",2000);
        if(res.info == "请求失败：请假信息不存在，或已被删除"){
            $(".approveBody >div.active >div[data-tleaveuuid="+tleaveUUID+"]").remove();

            for(var i=0;i<$(".approveBody >div").length;i++){
                if($(".approveBody >div").eq(i).children().length ==0){
                    $(".approveBody >div").eq(i).addClass("empty");
                }else{
                    $(".approveBody >div").eq(i).removeClass("empty");
                };
            };

            myAttendInfo_port();
            teacherAttendHomePage_port();
        }
    };
};

// 打卡记录
function teacherCheckingRecord_port () {
    var arr=$("#mobiscrollBtn01").val().split("-");
    var data={
            day:Number(arr[2]),
            month:Number(arr[1]),
            year:Number(arr[0]),
            loginUserUUID:user.userUUID
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.teacherCheckingRecord,param,teacherCheckingRecord_callback,data);
};
function teacherCheckingRecord_callback(res,time) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        var todayStr=new Date(new Date().getTime()).Format("yyyy-MM-dd");
        var curTime=new Date().getTime();
        var isToday=false;
        if(todayStr == $("#mobiscrollBtn01").val()){
            isToday=true;
        };

        if(data.length ==0){
            $("#checkSection").addClass("empty");
        }else{
            $("#checkSection").removeClass("empty");

            for(var i=0;i<data.length;i++){
                data[i].day=time.day;
                data[i].isToday=isToday;
                data[i].time=curTime;
            };  

            var html=template("checkList_script",{arr:data,path_img:httpUrl.path_img});
            $("#checkList").empty().append(html);
        };
        
        $("section").removeClass("current");
        $("#checkSection").addClass("current");
        document.title="打卡记录";
    };
};

// 补卡
function teacherSignInOut_port (userUUID) {
    var data={
            userUUID:userUUID,
            loginUserUUID:user.userUUID
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.teacherSignInOut,param,teacherSignInOut_callback);
};
function teacherSignInOut_callback(res) {
    if(res.code==200){
        toastTip("补卡成功","",1000);
        teacherCheckingRecord_port();

        myAttendInfo_port();
        teacherAttendHomePage_port();// 全园数据跟随刷新
    }else{
        toastTip(res.info,"",2000);
    };
};

// 历史记录
function teacherPastRecord_port (pageNum,user) {
    var data={
            pageNum:pageNum || 0,
            userUUID:user.useruuid
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.teacherPastRecord,param,teacherPastRecord_callback,user);
};
function teacherPastRecord_callback(res,user) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        if(data.length ==0){
            if($("#historyList").children().length ==0){
                $("#historySection").addClass("empty");
            };
        }else{
            $("#historySection").removeClass("empty");

            var html=template("historyList_script",{arr:data,path_img:httpUrl.path_img,curName:user.username,curUuid:user.useruuid});
            $("#historyList").append(html);
        };

        var arr=[];
        for(var i=0;i<$(".historyTitle").length;i++){
            arr.push($(".historyTitle").eq(i).attr("data-time"));
        };
        var newArr=indexOfUniq(arr);
        for(var i=0;i<newArr.length;i++){
            $(".historyTitle[data-time="+newArr[i]+"]").not($(".historyTitle[data-time="+newArr[i]+"]")[0]).remove();
        };

        $("section").removeClass("current");
        $("#historySection").addClass("current");
        document.title="历史记录";
    };
};

function calendarInit() {
    var t=new Date();
    var today=[t.getFullYear(),t.getMonth()+1,t.getDate()];
    var stamp=new Date(new Date().toLocaleDateString()).getTime();// 获得当日0点时间戳
    new Calendar({
            container: 'calendar',
            angle: 14,
            isMask: false, // 是否需要弹层
            beginTime: [2016, 1, 1],//如空数组默认设置成1970年1月1日开始,数组的每一位分别是年月日。
            endTime: [],//如空数组默认设置成次年12月31日,数组的每一位分别是年月日。
            recentTime: today,//如空数组默认设置成当月1日,数组的每一位分别是年月日。
            isSundayFirst: true, // 周日是否要放在第一列
            isShowNeighbor: true, // 是否展示相邻月份的月尾和月头
            isToggleBtn: true, // 是否展示左右切换按钮
            isChinese: true, // 是否是中文
            monthType: 0, // 0:1月, 1:一月, 2:Jan, 3: April
            canViewDisabled: false, // 是否可以阅读不在范围内的月份
            beforeRenderArr: [{
                    'stamp': stamp,
                    'className': 'today',
                }],
            success: function (item, arr) {
                $(".calendar-item-body >li").removeClass("selected");
                $('.calendar-item-' + item).addClass("selected");
                
                var day=Number($('.calendar-item-' + item).attr("data-day"));
                if($('.calendar-item-' + item).hasClass('today')){
                    monthObj[day-1].isToday=true;
                }else{
                    monthObj[day-1].isToday=false;
                };
                var html01=template("checkBox_script",monthObj[day-1]);
                var html02=template("leaveBox_script",monthObj[day-1]);
                
                $(".checkBox").empty().append(html01);
                $(".leaveBox").empty().append(html02);
            },
            switchRender: function (year, month, cal) {
                $(".calendar-item-body >li[data-stamp="+stamp+"] >i").text("今").parent("li").addClass('today');

                myAttendInfo_port();
            }
    });

    $(".calendar-item-body >li[data-stamp="+stamp+"] >i").text("今");// 初始化今天

    myAttendInfo_port(1);
};

function mobiscrollInit() {
    var month = new Date().getMonth()+1;
    if(month <10){
        month = "0"+month;
    };
    var day= new Date().getDate();
    if(day < 10){
        day = "0"+day;
    };

    var curTime=new Date().getFullYear()+"-"+month+"-"+ day;
    $("#mobiscrollBtn01").val(curTime);

    teacherAttendHomePage_port();
};

// 数组去重
function indexOfUniq(arr) {
  let result = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    // 用indexOf 简化了二层循环的流程
    if (result.indexOf(arr[i]) === -1) result.push(arr[i]);
  }
  return result;
}

//文档高度
function getDocumentTop() {
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if (document.body) {
        bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

//可视窗口高度
function getWindowHeight() {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

//滚动条滚动高度
function getScrollHeight() {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
};

function scroll2Top(time) {
    $("html, body").animate({scrollTop:$("body").offset().top},time ||400);
}

function winResize() {
    var fs=$(window).width()/750*100;
    $("html").css("font-size",fs);
    $(window).resize(function () {
        var fs01=$(window).width()/750*100;
        $("html").css("font-size",fs01);

        // calendarInit();
    });
}; 

// 上传图片
function loadFiles() {
    if(!user.upToken1){
        upToken1_port();
    }else{
        loadFiles01();// 七牛公有文件上传
    };
    // 获取公有文件上传token
    function upToken1_port() {
        var data={
                comUUID:user.companyUUID
        };
        var param={
                params:JSON.stringify(data)
        };
        initAjax(httpUrl.upToken1,param,upToken1_callback);
    };
    function upToken1_callback(res) {
        if(res.code==200){
            user.upToken1=res.data;
            loadFiles01();// 七牛公有文件上传
        };
    };
    function loadFiles01() {
        var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'addPicBtn',         // 上传选择的点选按钮，必需
                uptoken: user.upToken1, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: httpUrl.path_img,     // bucket域名，下载资源时用到，必需
                max_file_size: '1024mb',             // 最大文件体积限制
                multi_selection: true,              // 多选上传
                max_retries: 3,                     // 上传失败最大重试次数
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                filters : {
                    max_file_size : '1024mb',
                    prevent_duplicates: false,
                    mime_types: [
                        {title : "Image files", extensions : "jpg,jpeg,bmp,gif,png"} // 限定jpg,gif,png后缀上传
                    ]
                },
                init: {
                    'FileUploaded': function(up, file, info) {
                        if($("#carousel >.picItem").length < 4){
                            
                            if($("#carousel >.picItem").length ==3){
                                $("#addPicBtn").parent("li").addClass("hide");
                            };

                            var data={
                                    md5:JSON.parse(info.response).key,
                                    path_img:httpUrl.path_img
                            };
                            var url=data.path_img+data.md5;
                            var html="<li data-pic="+data.md5+" class='picItem'>"+
                                    "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" data-src="+url+" class=\"pic\" data-pic="+data.md5+">"+
                                        "<img src="+url+"-scale400>"+
                                        "<span class=\"deleteIcon\"></span>"+
                                    "</a>"+
                                "</li>";
                            $("#addPicBtn").parent("li").before(html);
                            $('.qiniuBar').remove();
                        }else{
                            toastTip("图片数量上限为4张","",1000);
                            
                            $('.qiniuBar').remove();
                        }
                    },
                    'BeforeUpload': function(up, file) {// 每个文件上传前，处理相关的事情
                        $("body").append("<span class='qiniuBar'></span>");
                    },
                    'UploadProgress': function(up, file) {// 进度条
                        $(".qiniuBar").width(file.percent + "%");
                    },
                    'Error': function(up, err, errTip) {
                        if(err.code == -601){
                            if(err.file.type=="video/mp4"){
                                toastTip("暂不支持视频，请添加图片","",2500);
                            }else{
                                toastTip("暂只支持添加图片","",2500);
                            };
                        }else{
                            toastTip(errTip);
                        }
                    }
                }
            });
    };
};

function toastTip(infoText,text,minite) {
    $(document).dialog({
        type:"notice",
        text:text || "",
        infoText:infoText,
        autoClose: minite || 1000,
        overlayShow:true,
        overlayClose:true,
        position:"bottom"
    });
};