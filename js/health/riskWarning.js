$(function () {
    init();
});
function init() {
    menu();
    chooseRow();

    riskGetCompanyHealthAlert_port();// 获取登录人所在学校的所有预警
    riskGetAlertType_port();// 获取预警类型列表

    // 新增
    $("#buttonBox").on("click","#newBtn",function () {
        $("#alertType").attr("disabled",false);
        $("#alertAge").attr("disabled",false);
        riskGetAlertAge_port();
        $("#save").attr("data-id","");
        $("#alertValue,#remark").val("");
        riskGetAlertType_port();
        $("#modal-edit").modal("show");
    });

    // 编辑
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择删除项。。");   
        }else{
            riskGetHealthAlert_port($("table tbody tr.active").attr("data-id"));
        };
    });

    // 新增Btn
    $("#save").on("click",function () {
        if($("#alertValue").val()){
            riskNewHealthAlert_port();
        }else{
            $("#alertValue").addClass("empty");
            toastTip("提示","请先填写完整。。");
        };
    });

    $("#alertValue").keyup(function () {
        if($(this).val()){
            $(this).removeClass("empty");
        }else{
            $(this).addClass("empty");
        }; 
    });

    // 删除
    $("#buttonBox").on("click","#deleteBtn",function () {
        var num=$(".table tbody tr.active").length;
        if(num ==0){
            toastTip("提示","请先选择删除项。。");
        }else{
            swal({
                title: "是否确认删除？",
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
                        riskDeleteHealthAlert_port($(".table tbody tr.active").attr("data-id"));
                    };
            });
        };
    });
};



// 获取登录人所在学校的所有预警
function riskGetCompanyHealthAlert_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.riskGetCompanyHealthAlert,param,riskGetCompanyHealthAlert_callback);
};
function riskGetCompanyHealthAlert_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        console.log(data.arr);
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        $("#editBtn,#deleteBtn").addClass("disable");
    }else{
        toastTip("提示",res.info);
    };
};

// 新增风险预警
function riskNewHealthAlert_port() {
    var data={
            alertAge:$("#alertAge").val(),
            alertType:$("#alertType").val(),
            alertUUID:$("#save").attr("data-id"),
            alertValue:$("#alertValue").val(),
            remark:$("#remark").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    if($("#save").attr("data-id")){
        initAjax(httpUrl.riskUpdateHealthAlert,param,riskNewHealthAlert_callback);
    }else{
        initAjax(httpUrl.riskNewHealthAlert,param,riskNewHealthAlert_callback);
    };
};
function riskNewHealthAlert_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        riskGetCompanyHealthAlert_port();
        $("#modal-edit").modal("hide");
    }else{
        toastTip("提示",res.info);
    };
};

// 获取单条健康预警
function riskGetHealthAlert_port(alertUUID) {
    var data={
            alertUUID:alertUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.riskGetHealthAlert,param,riskGetHealthAlert_callback,alertUUID);
};
function riskGetHealthAlert_callback(res,alertUUID) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#alertType").empty().append("<option value="+data.alertType+">"+data.alertTypeName+"</option>").attr("disabled",true);
        $("#alertAge").empty().append("<option value="+data.alertAge+">"+data.alertAge+"</option>").attr("disabled",true);
        
        $("#save").attr("data-id",alertUUID);
        $("#alertValue").val(data.alertValue);
        $("#remark").val(data.remark);
        $("#modal-edit").modal("show");
    }else{
        toastTip("提示",res.info);
    };
};

// 获取预警类型列表
function riskGetAlertType_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.riskGetAlertType,param,riskGetAlertType_callback);
};
function riskGetAlertType_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("alertType_script",data);
        $("#alertType").empty().append(html);
        riskGetAlertAge_port();
        $("#alertType").change(function () {
            riskGetAlertAge_port();
        });
    }else{
        toastTip("提示",res.info);
    };
};

// 获得预警年龄列表
function riskGetAlertAge_port(id) {
    var data={
            alertType:$("#alertType").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.riskGetAlertAge,param,riskGetAlertAge_callback,id);
};
function riskGetAlertAge_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("alertAge_script",data);
        $("#alertAge").empty().append(html);
    }else{
        toastTip("提示",res.info);
    };
};

// 删除健康信息
function riskDeleteHealthAlert_port(alertUUID) {
    var data={
            alertUUID:alertUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.riskDeleteHealthAlert,param,riskDeleteHealthAlert_callback);
};
function riskDeleteHealthAlert_callback(res) {
    if(res.code==200){
        riskGetCompanyHealthAlert_port();
    }else{
        toastTip("提示",res.info);
    };
};





// Row行选择函数
function chooseRow() {
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏

    $("#tableBox").on("click",".table tbody tr",function () {
        $(this).toggleClass("active").siblings().removeClass("active");
        if($(this).hasClass("active")){
            $("#editBtn,#deleteBtn").removeClass("disable");
        }else{
            $("#editBtn,#deleteBtn").addClass("disable");
        };
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
        basicButton_port();
    }else if(res.code ==404){
        toastTip("提示",res.info,1500,function () {
            window.location.href="../../index.html";
        });
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
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
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