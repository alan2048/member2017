$(function () {
    menu();
    init();
});
function init() {
    basicCompanyList_port();
    loadFiles();// 上传图片

    // 选中菜单
    $("#tableBox01").on("click",".level01,.level02",function () {
        $(this).toggleClass("active");
        if($(this).hasClass("active")){
            menuButtonList_port($(this).attr("data-id"));
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
        menuCompanyUpdate_port(arr.join());
    });

    // 增加菜单项
    $("#main").on("click",".level01Add,.level02Add",function () {
        $(".modalTitle").text("新增内容");
        $("#menuNew").attr("data-id","0");
        if($(this).hasClass("level01Add")){
            $("#menuNew").attr("data-parentId","0");
        }else if($(this).hasClass("level02Add")){
            $("#menuNew").attr("data-parentId",$(this).attr("data-parentid"));
        };
        $("#modal-dialog-img").modal("show"); 
    });

    // 编辑菜单项
    $("#main").on("dblclick",".level",function () {
        $(".modalTitle").text("编辑内容");
        $("#modal-dialog-img").modal("show"); 
    });

    // 是否置顶
    $(".newTopBtn").click(function () {
        $(this).toggleClass("active"); 
        if($(this).hasClass("active")){
            $(this).find("span").text("开");
        }else{
            $(this).find("span").text("关");
        };
    });

    $("#menuNew").click(function () {
        var data={};
        menuAddOrUpdate_port(data);
    });
};

//  获取所有的学校
function basicCompanyList_port(pageNum) {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicCompanyList,param,basicCompanyList_callback);
};
function basicCompanyList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);

        chooseNiceScroll(".panel:first");
        $(".table.table-email tbody tr").click(function (e) {
            $(this).siblings().removeClass("active").find("i").removeClass('fa-check-square-o').addClass('fa-square-o');
            $(this).addClass("active").find("i").removeClass('fa-square-o').addClass('fa-check-square-o');
            menuCompanyList_port($(this).attr("data-companyuuid"));
            var num=$(this).index()*52+70;
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-140);
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
        console.log(data);
    };
};

//  获取菜单按钮列表
function menuButtonList_port(menuId) {
    var data={
            menuId:menuId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuButtonList,param,menuButtonList_callback);
};
function menuButtonList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox02_script",data);
        $("#tableBox02").empty().append(html);
    };
};

//  更新学校菜单信息
function menuCompanyUpdate_port(menuIdList) {
    var data={
            companyId:$("#tableBox tbody >tr.active").attr("data-companyuuid"),
            menuIdList:menuIdList
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuCompanyUpdate,param,menuCompanyUpdate_callback);
};
function menuCompanyUpdate_callback(res) {
    if(res.code==200){
        toastTip("提示","保存成功");  
    }else{
        toastTip("提示",res.info);
    };
};

//  新增或更新菜单信息
function menuAddOrUpdate_port(json) {
    var data={
            icon:json.icon,
            id:json.id,
            name:json.name,
            parentId:json.parentId,
            type:json.type,
            url:json.url
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuAddOrUpdate,param,menuAddOrUpdate_callback);
};
function menuAddOrUpdate_callback(res) {
    if(res.code==200){
        toastTip("提示","保存成功");  
    }else{
        toastTip("提示",res.info);
    };
};

// 上传图片
function loadFiles() {
        Dropzone.options.myAwesomeDropzone=false;
        Dropzone.autoDiscover=false;
        var myDropzone=new Dropzone('.newPic',{
            url: httpUrl.picUrl,//84服务器图片
            paramName: "mbFile", // The name that will be used to transfer the file
            maxFilesize: 50, // MB
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        });
        myDropzone.on('success',function(file,responseText){
            var data={
                    md5:JSON.parse(responseText).result,
                    path_img:httpUrl.path_img
            };
            var url=data.path_img+data.md5+"&minpic=1";
            $(".newPicBtn").next("img").attr("src",url);
            console.log(data);
            
        });
        myDropzone.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
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
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / contain"
        });
    };
};
