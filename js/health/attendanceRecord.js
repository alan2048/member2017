$(function () {
    menu();
    init();
});
function init() {
    // 月份选择初始化
    var month={month:[1,2,3,4,5,6,7,8,9,10,11,12]};
    var htmlMonth=template("month_script",month);
    var d=new Date();
    $("#month01").append(htmlMonth).find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);
    $("#year01").find("option[value="+d.getFullYear()+"]").prop("selected",true);

    watchClassList_port();// 获得教职工所在班级列表

    // 获得考勤记录
    $("#year01,#month01,#read").change(function () {
        attendGetAttendanceRecord_port();
    });
    $("#searchBtn").click(function () {
        attendGetAttendanceRecord_port();
    });

    // 教师端检查确认
    $("#tableBox01").on("click",".attendBox >div.active:last-of-type",function () {
        attendCheckConfirm_port($(this).attr("data-leaveuuid"));
    });
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

        attendGetChildOfClass_port();        
        $("#teacherClass").change(function () {
            attendGetChildOfClass_port(); 
        });
    };
};

//  获得班级所有幼儿信息
function attendGetChildOfClass_port() {
    var data={
            classUUID:$("#teacherClass").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendGetChildOfClass,param,attendGetChildOfClass_callback);
};
function attendGetChildOfClass_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        if(data.arr.length==0){
            toastTip("提示","此班级下暂无学生。。");
            $("#tableBox,#tableBox01").empty();
            $(".ui-dialog-arrow-a,.ui-dialog-arrow-b").css("top","25px");
        }else{
            var html=template("tableBox_script",data);
            $("#tableBox").empty().append(html);
            chooseNiceScroll(".panel:first");
            $("#tableBox >div").click(function (e) {
                $(this).addClass("active").siblings().removeClass("active");
                $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-220);
                attendGetAttendanceRecord_port();
            });
            $("#tableBox >div:first").click();
        };
    };
};

//  获得考勤记录
function attendGetAttendanceRecord_port() {
    var data={
            checkStatus:$("#read").val(),
            leaveUserUUID:$("#tableBox >div.active").attr("data-id"),
            year:$("#year01").val(),
            month:$("#month01").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendGetAttendanceRecord,param,attendGetAttendanceRecord_callback);
};
function attendGetAttendanceRecord_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        if(data.arr.length ==0){
            $("#tableBox01").empty().addClass("empty");
            // toastTip("提示","此学生无请假记录");
        }else{
            $("#tableBox01").removeClass("empty");
            for(var i=0;i<data.arr.length;i++){
                data.arr[i].applicantTime=new Date(data.arr[i].applicantTime*1000).Format("yyyy年MM月dd日");
                data.arr[i].leaveDate=data.arr[i].leaveDate.split(",");
            };
            var html=template("tableBox01_script",data);
            $("#tableBox01").empty().append(html);
            chooseNiceScroll("#tableBox01");
        }
    };
};

// 教师端检查确认
function attendCheckConfirm_port(leaveUUID) {
    var data={
            leaveUUID:leaveUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendCheckConfirm,param,attendCheckConfirm_callback);
};
function attendCheckConfirm_callback(res) {
    if(res.code==200){
        attendGetAttendanceRecord_port(); 
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
                data.arr[i].current=true;
            }else{
                data.arr[i].current=false;
            };
        };
        
        var html=template("menu_script",data);
        $("#subMenu").empty().append(html);
        chooseNiceScroll("#sidebarBox","transparent");

        loginUserInfo_port();
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
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
    };
};
