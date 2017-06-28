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

    // 增加菜单项弹出框
    $("#main").on("click",".level01Add,.level02Add",function () {
        $("#modal-dialog-img .modalTitle").text("新增内容");
        $("#menuNew").attr("data-id","0");
        $("#modal-dialog-img input").val("");
        $("#modal-dialog-img .newPic").attr("data-md5","").attr("src","");
        $("#modal-dialog-img .newPic01").attr("data-md5","").attr("src","");
        $("#modal-dialog-img .newTopBtn").removeClass("active").find("span").text("关");

        if($(this).hasClass("level01Add")){
            $("#menuNew").attr("data-parentId","0");
            $(".newPic01,.newPicBtn01").addClass("hide");
        }else if($(this).hasClass("level02Add")){
            $(".newPic01,.newPicBtn01").removeClass("hide");
            $("#menuNew").attr("data-parentId",$(this).attr("data-parentid"));
        };

        $("#modal-dialog-img").modal("show"); 
    });

    // 编辑菜单项弹出框
    $("#main").on("dblclick",".level01,.level02",function () {
        menuDetail_port($(this).attr("data-id")); 
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

    // 添加编辑菜单项
    $("#menuNew").click(function () {
        if(!$("#menuName").val()){
            $("#menuName").addClass("empty");
        };
        if(!$("#url").val()){
            $("#url").addClass("empty");
        };
        if(!$(".newPic").attr("data-md5")){
            $(".newPic").addClass("empty");
        };
        
        if($("#modal-dialog-img input").hasClass("empty") || $("#modal-dialog-img .newPic").hasClass("empty")){
            toastTip("提示","请先将填写完整");
        }else{
            var type="0";
            if($(".newTopBtn").hasClass("active")){
                type="1";
            }else{
                type="0";
            };
            var iconArr=[];
            iconArr.push($(".newPic").attr("data-md5"));
            if($(".newPic01").attr("data-md5")){
                iconArr.push($(".newPic01").attr("data-md5"));
            };
            var data={
                    icon:iconArr.join(),
                    id:$(this).attr("data-id"),
                    parentId:$(this).attr("data-parentid"),
                    type:type,
                    name:$("#menuName").val(),
                    url:$("#url").val()
            };
            menuAddOrUpdate_port(data);
        };
    });

    // 弹出框菜单验证
    $("#modal-dialog-img input").keyup(function () {
       if($(this).val()){
            $(this).removeClass("empty");
       }else{
            $(this).addClass("empty");
       }; 
    });

    // 删除菜单
    $("#tableBox01").on("click",".deleteBtn",function (e) {
        e.stopPropagation();
        var id=$(this).attr("data-id");
        swal({
                title: "是否删除此信息？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e15d5d",
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        menuDelete_port(id);
                    };
            });
    });
    

    // 增加按钮弹出框
    $("#main").on("click",".level03Add",function () {
        $("#modal-button .modalTitle").text("新增按钮");
        $("#modal-button input").val("");
        $(".newPic02").attr("data-md5","").attr("src","");
        $("#buttonNew").attr("data-id","0").attr("data-menuid",$(this).attr("data-parentid"));
        
        $("#modal-button").modal("show"); 
    });

    // 编辑按钮弹出框
    $("#main").on("dblclick",".level03",function () {
        menuButtonDetail_port($(this).attr("data-id")); 
    });

    // 删除按钮
    $("#tableBox02").on("click",".deleteBtn",function (e) {
        e.stopPropagation();
        var id=$(this).attr("data-id");
        var menuId=$(this).attr("data-parentid");
        swal({
                title: "是否删除此信息？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e15d5d",
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        menuButtonDelete_port(id,menuId);
                    };
            });
    });

    // 添加编辑按钮
    $("#buttonNew").click(function () {
        if(!$("#buttonName").val()){
            $("#buttonName").addClass("empty");
        };
        if(!$("#code").val()){
            $("#code").addClass("empty");
        };
        if(!$(".newPic02").attr("data-md5")){
            $(".newPic02").addClass("empty");
        };
        
        if($("#modal-button input").hasClass("empty") || $("#modal-button .newPic").hasClass("empty")){
            toastTip("提示","请先将填写完整");
        }else{
            var data={
                    icon:$(".newPic02").attr("data-md5"),
                    id:$(this).attr("data-id"),
                    name:$("#buttonName").val(),
                    buttonCode:$("#code").val(),
                    menuId:$(this).attr("data-menuid")
            };
            menuButtonAddOrUpdate_port(data);
        };
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
    initAjax(httpUrl.menuButtonList,param,menuButtonList_callback,menuId);
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
        menuCompanyList_port($("#tableBox tbody tr.active").attr("data-companyuuid"));
        $("#modal-dialog-img").modal("hide");
        toastTip("提示",res.info);  
    }else{
        toastTip("提示",res.info);
    };
};

//  新增或更新菜单信息
function menuButtonAddOrUpdate_port(json) {
    var data={
            icon:json.icon,
            id:json.id,
            name:json.name,
            buttonCode:json.buttonCode,
            menuId:json.menuId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuButtonAddOrUpdate,param,menuButtonAddOrUpdate_callback);
};
function menuButtonAddOrUpdate_callback(res) {
    if(res.code==200){
        menuButtonList_port($(".level03Add").attr("data-parentid"));
        $("#modal-button").modal("hide");
        toastTip("提示",res.info);  
    }else{
        toastTip("提示",res.info);
    };
};

//  删除菜单
function menuDelete_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuDelete,param,menuDelete_callback);
};
function menuDelete_callback(res) {
    if(res.code==200){
        menuCompanyList_port($("#tableBox tbody tr.active").attr("data-companyuuid"));
        toastTip("提示",res.info);  
    };
};

//  删除按钮
function menuButtonDelete_port(id,menuId) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuButtonDelete,param,menuButtonDelete_callback,menuId);
};
function menuButtonDelete_callback(res,menuId) {
    if(res.code==200){
        menuButtonList_port(menuId);
        toastTip("提示",res.info);  
    };
};

//  菜单详情
function menuDetail_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuDetail,param,menuDetail_callback,id);
};
function menuDetail_callback(res,id) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.iconArr=data.icon.split(",");
        data.path_img=httpUrl.path_img;
        $(".modalTitle").text("编辑内容");
        $("#modal-dialog-img input#menuName").val(data.name);
        $("#modal-dialog-img input#url").val(data.url);

        $(".newPic").attr("data-md5",data.iconArr[0]).attr("src",data.path_img+data.iconArr[0]+"&minpic=1");
        $(".newPic01").attr("data-md5",data.iconArr[1]).attr("src",data.path_img+data.iconArr[1]+"&minpic=1");
        if(data.type==1){
            $("#modal-dialog-img .newTopBtn").addClass("active").find("span").text("开");
        }else{
            $("#modal-dialog-img .newTopBtn").removeClass("active").find("span").text("关");
        };

        $("#menuNew").attr("data-id",data.id);
        $("#menuNew").attr("data-parentId",data.parentId);
        if(data.parentId =="0"){
            $(".newPic01,.newPicBtn01").addClass("hide");
        }else{
            $(".newPic01,.newPicBtn01").removeClass("hide");
        };

        $("#modal-dialog-img").modal("show");
    };
};

//  按钮详情
function menuButtonDetail_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuButtonDetail,param,menuButtonDetail_callback,id);
};
function menuButtonDetail_callback(res,id) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;
        $("#modal-button .modalTitle").text("编辑按钮");
        $("#modal-button input#buttonName").val(data.name);
        $("#modal-button input#code").val(data.buttonCode);
        $(".newPic02").attr("data-md5",data.icon).attr("src",data.path_img+data.icon+"&minpic=1");
        $("#buttonNew").attr("data-id",data.id).attr("data-menuid",data.menuId);

        $("#modal-button").modal("show");
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
            $(".newPic").attr("src",url).attr("data-md5",data.md5).removeClass("empty");
        });
        myDropzone.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
        });

        var myDropzone01=new Dropzone('.newPic01',{
            url: httpUrl.picUrl,//84服务器图片
            paramName: "mbFile", // The name that will be used to transfer the file
            maxFilesize: 50, // MB
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        });
        myDropzone01.on('success',function(file,responseText){
            var data={
                    md5:JSON.parse(responseText).result,
                    path_img:httpUrl.path_img
            };
            var url=data.path_img+data.md5+"&minpic=1";
            $(".newPic01").attr("src",url).attr("data-md5",data.md5).removeClass("empty");
        });
        myDropzone01.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
        });

        var myDropzone02=new Dropzone('.newPic02',{
            url: httpUrl.picUrl,//84服务器图片
            paramName: "mbFile", // The name that will be used to transfer the file
            maxFilesize: 50, // MB
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        });
        myDropzone02.on('success',function(file,responseText){
            var data={
                    md5:JSON.parse(responseText).result,
                    path_img:httpUrl.path_img
            };
            var url=data.path_img+data.md5+"&minpic=1";
            $(".newPic02").attr("src",url).attr("data-md5",data.md5).removeClass("empty");
        });
        myDropzone02.on('error',function(file,errorMessage,httpRequest){
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
        loadingOut();//关闭loading
    };
};
