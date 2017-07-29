$(function () {
    menu();
    init();
});
function init() {
    attendDisPlayAttendDays_port();

    // 重置
    $("#tableBox").on("click",".reset",function () {
        attendResetAttendDays_port($(this).attr("data-setuuid"));
    });

    // 打开编辑框
    $("#tableBox").on("click",".edit",function () {
        $("#editor").fadeIn();
        $("#year").val($(this).attr("data-year"));
        $("#month").val($(this).attr("data-month"));
        $("#day").val("").removeClass("empty");
        $(".tip").text("");
        $(".editorBtn").attr("data-setuuid",$(this).attr("data-setuuid"));
    });

    // 关闭编辑框
    $(".close >span").click(function () {
        $("#editor").fadeOut();
    });

    $("#day").keyup(function (e) {
        var num=$("#day").val();
        var reg=/^\+?[1-9][0-9]*$/g;
        if(reg.test(num)){
            if(num>31){
                $("#day").addClass("empty");
                $(".tip").text("每月天数小于32天");
            }else{
                $(".tip").text("");
                $("#day").removeClass("empty");
                if(e.which==13){
                    $(".editorBtn").click();
                };
            };
        }else{
            $("#day").addClass("empty");
            $(".tip").text("天数为正整数");
        };
    });

    // 编辑
    $(".editorBtn").click(function () {
        if($("#day").val() && !$("#day").hasClass("empty")){
            attendUpdateAttendDays_port($(this).attr("data-setuuid"));
        }else{
            $("#day").addClass("empty");
            $(".tip").text("不可为空，请输入");
        };
    });
};

//  查看已设置的考勤天数
function attendDisPlayAttendDays_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendDisPlayAttendDays,param,attendDisPlayAttendDays_callback);
};
function attendDisPlayAttendDays_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        for(var i=0;i<data.arr.length;i++){
            data.arr[i].attendDays=data.arr[i].attendDays.toString().split("");
        };
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        chooseNiceScroll(".panel:first");
    };
};

//  复位考勤天数设置
function attendResetAttendDays_port(setUUID) {
    var data={
            setUUID:setUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendResetAttendDays,param,attendResetAttendDays_callback);
};
function attendResetAttendDays_callback(res) {
    if(res.code==200){
        attendDisPlayAttendDays_port();
        toastTip("提示","重置成功。。");
    };
};

//  修改考勤天数设置
function attendUpdateAttendDays_port(setUUID) {
    var data={
            attendDays:$("#day").val(),
            setUUID:setUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendUpdateAttendDays,param,attendUpdateAttendDays_callback);
};
function attendUpdateAttendDays_callback(res) {
    if(res.code==200){
        $("#editor").fadeOut();
        attendDisPlayAttendDays_port();
        toastTip("提示","编辑成功。。");
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
