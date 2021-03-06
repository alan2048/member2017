$(function () {
    menu();
    init();
});
function init() {
    schoolTypeList_port();

    // 选中菜单
    $("#tableBox01").on("click",".level01,.level02",function () {
        $(this).toggleClass("active");
        if($(this).hasClass("active")){
            // menuButtonList_port($(this).attr("data-id"));
            // 选中菜单子项时 选中父项
            if($(this).hasClass("level02") && !$(this).parent(".menuList").prev().find(".level01").hasClass("active")){
                $(this).parent(".menuList").prev().find(".level01").addClass("active");
            };
        }else{
            $("#tableBox02").empty();
            // 取消选中父项时取消子项
            if($(this).hasClass("level01")){
                $(this).parent().next().find(".level02").removeClass("active");
            }
        };
    });

    $("#tableBox01").on("click","#save",function () {
        var arr=[];
        for(var i=0;i<$(".level.active").length;i++){
            arr.push($(".level.active").eq(i).attr("data-id"))
        };
        schoolMenuUpdate_port(arr.join());
    });

};

//  获取所有的学校
function schoolTypeList_port(pageNum) {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.schoolTypeList,param,schoolTypeList_callback);
};
function schoolTypeList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);

        chooseNiceScroll(".panel:first");
        $(".table.table-email tbody tr").click(function (e) {
            $(this).siblings().removeClass("active").find("i").removeClass('fa-check-square-o').addClass('fa-square-o');
            $(this).addClass("active").find("i").removeClass('fa-square-o').addClass('fa-check-square-o');
            schoolMenuList_port($(this).attr("data-typecode"));
            var num=$(this).index()*52+70;
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-140);
        });

        $(".table.table-email tbody tr:first").click();
    };
};

//  获取学校菜单列表
function schoolMenuList_port(typecode) {
    var data={
            roleCode:typecode
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.schoolMenuList,param,schoolMenuList_callback);
};
function schoolMenuList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox01_script",data);
        $("#tableBox01").empty().append(html);
        chooseNiceScroll("#tableBox01");
    };
};

//  更新学校菜单信息
function schoolMenuUpdate_port(menuIdList) {
    var data={
            roleCode:$("#tableBox tbody >tr.active").attr("data-typecode"),
            menuIdList:menuIdList
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.schoolMenuUpdate,param,schoolMenuUpdate_callback);
};
function schoolMenuUpdate_callback(res) {
    if(res.code==200){
        toastTip("提示","保存成功");  
    }else{
        toastTip("提示",res.info);
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
