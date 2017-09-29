$(function () {
    menu();
    init();
});
function init() {
    // 选中菜单
    $("#tableBox01").on("click",".level",function () {
        $(".level").removeClass("active");
        $(this).addClass("active");
        menuButtonList_port($(this).attr("data-id"));
    });

    $("#tableBox02").on("click",".level",function () {
        $(this).toggleClass("active"); 
    });
    $("#tableBox02").on("click","#save",function () {
        var arr=[];
        for(var i=0;i<$(".level03.active").length;i++){
            arr.push($(".level03.active").eq(i).attr("data-id"))
        };
        menuRoleButtonUpdate_port(arr.join());
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
        menuCompanyList_port($("#user >.userRole").attr("data-companyuuid"));

        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);

        chooseNiceScroll(".panel:first");
        $(".table.table-email tbody tr").click(function (e) {
            $(this).siblings().removeClass("active").find("i").removeClass('fa-check-square-o').addClass('fa-square-o');
            $(this).addClass("active").find("i").removeClass('fa-square-o').addClass('fa-check-square-o');
            var num=$(this).index()*52+70;
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-140);

            menuButtonList_port($(".level.active").attr("data-id"));
        });

        $(".table.table-email tbody tr:first").click();
    };
};

//  获取学校菜单列表
function menuCompanyList_port(companyId) {
    var data={
            companyId:companyId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuCompanyList,param,menuCompanyList_callback);
};
function menuCompanyList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox01_script",data);
        $("#tableBox01").empty().append(html);
        chooseNiceScroll("#tableBox01");
    };
};

//  获取菜单按钮列表
function menuButtonList_port(menuId) {
    var data={
            menuId:menuId,
            roleCode:$(".table.table-email tbody tr.active").attr("data-typecode")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    if(menuId){
        initAjax(httpUrl.menuRoleButtonList,param,menuButtonList_callback,menuId);
    };
};
function menuButtonList_callback(res,menuId) {
    if(res.code==200){
        var data={
                arr:JSON.parse(res.data),
                menuId:menuId
        };
        var html=template("tableBox02_script",data);
        $("#tableBox02").empty().append(html);
        console.log(data);
    };
};

//  更新学校菜单信息
function menuRoleButtonUpdate_port(menuButtonIds) {
    var data={
            roleCode:$("#tableBox tbody >tr.active").attr("data-typecode"),
            menuButtonIds:menuButtonIds,
            menuId:$("#tableBox01 .level.active").attr("data-id")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuRoleButtonUpdate,param,menuRoleButtonUpdate_callback);
};
function menuRoleButtonUpdate_callback(res) {
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
        $("#user >.userRole").text(data.jobTitle).attr("data-companyuuid",data.companyUUID);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading

        schoolTypeList_port();
    };
};
