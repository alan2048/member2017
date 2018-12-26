var monthObj;
$(function () {
    menu();
    init();
});
function init() {
    var myCalendar = new SimpleCalendar('#container');

    // 获得考勤记录
    $("#teacherClass").change(function () {
        attendGetClassAttendanceInfo_port();
    });

    $("#searchBtn").click(function () {
        attendGetClassAttendanceInfo_port();
    });

    $("#main").on("click",".exportBtn",function () {
        var data={
                day:$(".sc-selected").attr("data-day"),
                year:$(".sc-select-year").val(),
                month:$(".sc-select-month").val(),
                classUUID:$("#teacherClass").val()
        };
        window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url=/web/attendance/exportDailyRecordExcel&params="+JSON.stringify(data));
    });

    $("#curBox").on("click",".tabNav >i",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".curBody >div").eq($(this).index()).addClass("active").siblings().removeClass("active");
    });

    $("#curBox").on("click",".enterPic,.exitPic",function () {
        if($(this).attr("data-pic")){
            var src=httpUrl.path_img+$(this).attr("data-pic")+"";
            $("#carousel_img").empty().append("<img src="+src+" />");
            $(".prevBtn,.nextBtn").addClass("hide");
            $("#modal-dialog-img").modal("show");
        }else{
            toastTip("提示","无图片数据");
        };
    });

    carousel();
};

// 点击具体天的请假详情
function clalendarClick() {
    var Arr=monthObj[$(".sc-selected").attr("data-day")]
    var data={
            curDay:$(".sc-selected").attr("data-day"),
            arr:Arr,
            path_img:httpUrl.path_img,
            curIndex:$(".tabNav >i.active").index()
    };

    if(user.typeID =="20"){
        var html=template("curDay_script",data);
        $("#curDay").empty().append(html).removeClass("hide");
        chooseNiceScroll("#curDay");
        if(data.arr.length ==0){
            $("#curDay").addClass("emptyBox");
        }else{
            $("#curDay").removeClass("emptyBox");
        };
    }else{
        attendanceList_port(data);
    };
};

//  打卡记录列表
function attendanceList_port(json) {
    var data={
            classUUID:$("#teacherClass").val(),
            month:$(".sc-select-month").val(),
            year:$(".sc-select-year").val(),
            day:$(".sc-selected").attr("data-day")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendCheckingRecord,param,attendanceList_callback,json);
};
function attendanceList_callback(res,json) {
    if(res.code==200){
        var curObj={
                tab01Arr:json,
                tab02Arr:JSON.parse(res.data)
        };

        var html=template("curBox_script",curObj);
        $("#curBox").empty().append(html).removeClass("hide");
        chooseNiceScroll("#curBox");

        if(json.arr.length ==0){
            $(".curBody >div:first-of-type").addClass("emptyBox");
        }else{
            $(".curBody >div:first-of-type").removeClass("emptyBox");
        };
    };
};

// 获得班级考勤
function attendGetClassAttendanceInfo_port(today) {
    var data={
            classUUID:$("#teacherClass").val(),
            month:$(".sc-select-month").val(),
            year:$(".sc-select-year").val(),
            leaveUserUUID:$(".userName").attr("data-childuuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    if($(".userRole").attr("data-typeid") ==20){
        var curUrl=httpUrl.attendGetPersonalAttendance;
    }else{
        var curUrl=httpUrl.attendGetClassAttendanceInfo
    };
    initAjax(curUrl,param,attendGetClassAttendanceInfo_callback,today);
};
function attendGetClassAttendanceInfo_callback(res,today) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $(".sc-item .lunar-day").removeClass("active").text("");

        var num=0;
        for(i in data){
            if(data[i].length !=0){
                num++;
                if($(".userRole").attr("data-typeid") ==20){
                    if(data[i][0].leaveType =="病假"){
                        $(".sc-item:not(.sc-othermenth)[data-day="+i+"]").children(".lunar-day").text("病").addClass("active sick");// 个人考勤时显示病假还是事假
                    }else{
                        $(".sc-item:not(.sc-othermenth)[data-day="+i+"]").children(".lunar-day").text("事").addClass("active thing");// 个人考勤时显示病假还是事假
                    }
                    
                }else{
                    $(".sc-item:not(.sc-othermenth)[data-day="+i+"]").children(".lunar-day").text(data[i].length).addClass("active");// 班级考勤时显示具体天数tip
                };
                
            };
        };
        if(num ==0){
            if($(".userRole").attr("data-typeid") ==20){
                toastTip("提示","该学生此月暂无请假记录。。");
                $("#curDay").empty();
            }else{
                toastTip("提示","此班级此月暂无请假记录。。");
                $("#curBox").empty();
            };
        };
        $("#curDay").empty().removeClass("emptyBox");
        monthObj=data;// 获得当前全月数据
        if(today ==1){
            $(".sc-today").click();
        }else if($(".sc-selected").length !=0){
            $(".sc-selected").click();
        }else if(num !=0){
            $("#curDay,#curBox").empty();
            toastTip("提示","选择具体天 来查看数据",3000);
        }
    };
};

// 获得个人考勤
function attendGetPersonalAttendance_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendGetPersonalAttendance,param,attendGetPersonalAttendance_callback);
};
function attendGetPersonalAttendance_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        console.log(data);
    };
};

// 获得教职工所在班级列表
function watchClassList_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchClassList,param,watchClassList_callback);
};
function watchClassList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").empty().append(html);

        attendGetClassAttendanceInfo_port(1);// 获得班级考勤        
    };
};

function carousel() {
    // 帖子列表图片 查看
    $("#main").on("click","a.pic",function () {
        var arr=[];
        var curPic=$(this).attr("data-pic");
        for(var i=0;i<$(this).parents('#picBox').find('.pic').length;i++){
            arr.push($(this).parents('#picBox').find('.pic').eq(i).attr("data-pic"));
        };

        var src=httpUrl.path_img+$(this).attr("data-pic")+"";
        $("#carousel_img").empty().append("<img src="+src+" data-curpic="+curPic+" />");
        $("#carousel_img").prev(".prevBtn").attr("data-arr",JSON.stringify(arr)).removeClass("hide");
        $("#carousel_img").next(".nextBtn").attr("data-arr",JSON.stringify(arr)).removeClass("hide");
        if(arr.indexOf(curPic) ==0){
            $("#carousel_img").prev(".prevBtn").addClass("hide")
        }; 
        if(arr.indexOf(curPic)+1 ==arr.length){
            $("#carousel_img").next(".nextBtn").addClass("hide")
        }; 
    });

    // 删除 新增图片按钮
    $("#modal-dialog-img .deleteBtn01").click(function () {
        var cur=$("#carousel_img").find("img").attr("data-curpic");
        var arr=JSON.parse($("#modal-dialog-img .prevBtn").attr("data-arr"));
        if(arr.length==1){
            $(this).prev(".closeBtn01").click();
        }else{
            if(arr.indexOf(cur)+1 !=arr.length ){
                $("#carousel_img").empty().append("<img src="+httpUrl.path_img+arr[arr.indexOf(cur)+1]+" data-curpic="+arr[arr.indexOf(cur)+1]+" />");
            }else{
                $("#carousel_img").empty().append("<img src="+httpUrl.path_img+arr[arr.indexOf(cur)-1]+" data-curpic="+arr[arr.indexOf(cur)-1]+" />");
            };
        };
        arr.splice(arr.indexOf(cur),1);
        $("#modal-dialog-img .nextBtn,#modal-dialog-img .prevBtn").attr("data-arr",JSON.stringify(arr));
        
        // 检查前后一步图标是否隐藏
        var cur01=$("#carousel_img").find("img").attr("data-curpic");
        if(arr.indexOf(cur01)== 0){
            $("#carousel_img").prev(".prevBtn").addClass("hide");
        };
        if(arr.indexOf(cur01)+1 == arr.length){
            $("#carousel_img").next(".nextBtn").addClass("hide");
        }

        // 删除
        $("#carousel li.picItem[data-pic="+cur+"]").remove();
    });

    
    // 前一张
    $("#modal-dialog-img .prevBtn").click(function () {
        var cur=$(this).next("#carousel_img").find("img").attr("data-curpic");
        var arr=JSON.parse($(this).attr("data-arr"));
        if(arr.indexOf(cur) >0){
            var newCur=arr[arr.indexOf(cur)-1];
            if(arr.indexOf(cur)-1 == 0){
                $("#carousel_img").prev(".prevBtn").addClass("hide");
                $("#carousel_img").empty().append("<img alt='正在加载,请稍后...'/>");
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            }else{
                $("#carousel_img").empty().append("<img alt='正在加载,请稍后...'/>");
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            };

            if(arr.indexOf(cur)+1 == arr.length){
                $("#carousel_img").next(".nextBtn").removeClass("hide");
            }
        };
    });

    // 键盘左右键控制
    $(window).keyup(function (e) {
        if($("#modal-dialog-img").hasClass("in")){
            if(e.which ==37 && !$("#modal-dialog-img .prevBtn").hasClass("hide")){
                $("#modal-dialog-img .prevBtn").click()
            };
            if(e.which ==39 && !$("#modal-dialog-img .nextBtn").hasClass("hide")){
                $("#modal-dialog-img .nextBtn").click()
            };
        };
    });

    // 后一张
    $("#modal-dialog-img .nextBtn").click(function () {
        var cur=$(this).prev("#carousel_img").find("img").attr("data-curpic");
        var arr=JSON.parse($(this).attr("data-arr"));
        if(arr.indexOf(cur)+1 <arr.length){
            var newCur=arr[arr.indexOf(cur)+1];
            if(arr.indexOf(cur)+2 == arr.length){
                $("#carousel_img").next(".nextBtn").addClass("hide");
                $("#carousel_img").empty().append("<img alt='正在加载,请稍后...'/>");
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            }else{
                $("#carousel_img").empty().append("<img alt='正在加载,请稍后...'/>");
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            };
        };

        if(arr.indexOf(cur)== 0){
            $("#carousel_img").prev(".prevBtn").removeClass("hide");
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
                data.arr[i].newId=function () {return data.arr[i].id+"&t="+(new Date().getTime())}();
                data.arr[i].current=true;
            }else{
                data.arr[i].newId=function () {return data.arr[i].id+"&t="+(new Date().getTime())}();
                data.arr[i].current=false;
            };
        };
        
        var html=template("menu_script",data);
        $("#subMenu").empty().append(html);
        chooseNiceScroll("#sidebarBox","transparent");

        loginUserInfo_port();
        // basicButton_port();
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
        user.typeID=data.typeID;
        data.path_img=httpUrl.path_img;
        $("#user >.userName").text(data.name).attr("data-uuid",data.userUUID).attr("data-childuuid",data.childUUID);
        $("#user >.userRole").text(data.jobTitle).attr("data-typeid",data.typeID);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading

        // 判断是否为家长还是教师
        if(data.typeID ==20){
            $("#search").hide();
            attendGetClassAttendanceInfo_port(1);// 获得班级考勤  
        }else{
            watchClassList_port();
        };
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
    };
};