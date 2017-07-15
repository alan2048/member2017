$(function () {
    menu();
    init();
});
function init() {
    var myCalendar = new SimpleCalendar('#container');
    watchClassList_port();

    // 获得考勤记录
    $("#teacherClass,.sc-select-month,.sc-select-year").change(function () {
        attendGetClassAttendanceInfo_port();
    });

    $("#searchBtn").click(function () {
        attendGetClassAttendanceInfo_port();
    });

    
};
function clalendarClick() {
    attendGetClassAttendanceInfo_port();
};

// 获得班级考勤
function attendGetClassAttendanceInfo_port() {
    var data={
            classUUID:$("#teacherClass").val(),
            month:$(".sc-select-month").val(),
            year:$(".sc-select-year").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendGetClassAttendanceInfo,param,attendGetClassAttendanceInfo_callback);
};
function attendGetClassAttendanceInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        console.log(data);
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

        attendGetClassAttendanceInfo_port();// 获得班级考勤        
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
        console.log(data);
        data.path_img=httpUrl.path_img;
        $("#user >.userName").text(data.name);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / contain"
        });
        loadingOut();//关闭loading
    };
};
