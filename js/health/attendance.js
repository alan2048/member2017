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

    $("#buttonBox").on("click","#export",function () {
        var data={
                year:$(".sc-select-year").val(),
                month:$(".sc-select-month").val(),
                classUUID:$("#teacherClass").val(),
                className:$("#teacherClass >option:selected").text()
        };
        window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url=/web/attendance/exportExcel&params="+JSON.stringify(data));
    });
};

// 点击具体天的请假详情
function clalendarClick() {
    var Arr=monthObj[$(".sc-selected").attr("data-day")]
    var data={
            curDay:$(".sc-selected").attr("data-day"),
            arr:Arr
    };
    var html=template("curDay_script",data);
    $("#curDay").empty().append(html);
    chooseNiceScroll("#curDay");
    if(data.arr.length ==0){
        $("#curDay").addClass("emptyBox");
    }else{
        $("#curDay").removeClass("emptyBox");
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
            }else{
                toastTip("提示","此班级此月暂无请假记录。。");
            };
            $("#curDay").empty().removeClass("emptyBox");
        };
        monthObj=data;// 获得当前全月数据
        if(today ==1){
            $(".sc-today").click();
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
        console.log(data);
        data.path_img=httpUrl.path_img;
        $("#user >.userName").text(data.name).attr("data-uuid",data.userUUID).attr("data-childuuid",data.childUUID);
        $("#user >.userRole").text(data.jobTitle).attr("data-typeid",data.typeID);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
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
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
        $("#template").attr("href","healthInfo_template.xls");
    };
};