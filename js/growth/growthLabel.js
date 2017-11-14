$(function () {
    init();
});
function init() {
    menu();
    chooseRow();

    // 新增
    $("#buttonBox").on("click","#newBtn",function () {
        $(".modalTitle").text("新增");
        $("#modal-dialog-img").modal("show").find("input").val("");
        $("#new").attr("data-id","");
    });
    
    // 编辑
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            var num=$("#tableBox .fa.fa-check-square-o").length;
            if(num ==0){
                toastTip("提示","请先选择编辑项。。"); 
            }else{
                toastTip("提示","编辑时为单选。。"); 
            };
        }else{
            $(".modalTitle").text("编辑");
            $("#modal-dialog-img").modal("show").find("input").val($(".table i.fa-check-square-o").attr("data-name"));
            $("#new").attr("data-id",$(".table i.fa-check-square-o").attr("data-id"));
        };
    });

    // 删除
    $("#buttonBox").on("click","#deleteBtn",function () {
        if($(this).hasClass("disable")){
            var num=$("#tableBox .fa.fa-check-square-o").length;
            if(num ==0){
                toastTip("提示","请先选择删除项"); 
            };
        }else{
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
                        growthLabelDelete_port($(".table i.fa-check-square-o").attr("data-id"));
                    };
            });
            
        };
    });

    // 新增
    $("#new").on("click",function () {
        if($(".labelBox input").val()){
            growthLabelAddOrUpdate_port();
        }else{
            $(".labelBox input").addClass("empty");
            toastTip("提示","请先填写完整。。"); 
        };
    });



};

// 获取学校所有的标签
function growthLabel_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthLabel,param,growthLabel_callback);
};
function growthLabel_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        $("#editBtn,#deleteBtn").addClass("disable");
    };
};

// 新增或者编辑标签
function growthLabelAddOrUpdate_port() {
    var data={
            id:$("#new").attr("data-id") || "0",
            name:$(".labelBox input").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthLabelAddOrUpdate,param,growthLabelAddOrUpdate_callback);
};
function growthLabelAddOrUpdate_callback(res) {
    if(res.code==200){
        $("#modal-dialog-img").modal("hide");
        growthLabel_port();
    };
};

// 删除学校标签
function growthLabelDelete_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthLabelDelete,param,growthLabelDelete_callback);
};
function growthLabelDelete_callback(res) {
    if(res.code==200){
        growthLabel_port();
    };
};

// Row行选择函数
function chooseRow() {
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏

    $("#tableBox").on("click",".table tbody tr",function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(".table i").removeClass("fa-check-square-o").addClass('fa-square-o');
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(".table i").removeClass("fa-check-square-o").addClass('fa-square-o');
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
        };
        ValidateBtn();
    });
};

// 验证编辑删除按钮
function ValidateBtn() {
    var num=$("#tableBox .table tbody tr i.fa-check-square-o").length;
    if(num ==0){
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    }else if( num ==1){
        $("#editBtn,#deleteBtn").removeClass("disable");
    }else{
        $("#editBtn").addClass("disable");
        $("#deleteBtn").removeClass("disable");
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
    }else if(res.code =404){
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

        growthLabel_port();
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
    };
};