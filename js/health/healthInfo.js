$(function () {
    init();
});
function init() {
    menu();
    chooseRow();

    teacherMyClassInfo_port();

    // 导入
    $("#buttonBox").on("click","#importBtn",function () {
        $("#filesUpload >input[name=file]").click();
    });

    // xlsx上传
    $("#filesUpload input[type=file]").change(function () {
        $("#filesUpload >input[name=loginId]").val(httpUrl.loginId);
        var data={
                extName:$(this).val().substring($(this).val().lastIndexOf(".")+1)
        };
        $("#filesUpload >input[name=params]").val(JSON.stringify(data));
        $(".importFile >input").val($(this).val().substring($(this).val().lastIndexOf("\\")+1));
        ajaxSubmitForm();
    });

    // 删除
    $("#buttonBox").on("click","#deleteBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择删除项。。");
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
                        healthDeleteHealthInfo_port();
                    };
            });
        };
    });

    loginSuccess();    
};

function ajaxSubmitForm() {
    var option = {
            url : httpUrl.basicFileUpload,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                teacherGetImportUserInfo_port();
                toastTip("提示",data.data,3000);
            },
            error: function(data) {
                console.log(data);   
            }
    };
    $("#filesUpload").ajaxSubmit(option);
    return false; //最好返回false，因为如果按钮类型是submit,则表单自己又会提交一次;返回false阻止表单再次提交
};


// 获得教职工所在班级列表
function teacherMyClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherMyClassInfo,param,teacherMyClassInfo_callback);
};
function teacherMyClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").empty().append(html);
        healthGetExamDateList_port();
        $("#teacherClass").change(function () {
            healthGetExamDateList_port();
        });
    };
};

// 根据班级获得检查日期列表
function healthGetExamDateList_port() {
    var data={
            classUUID:$("#teacherClass").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthGetExamDateList,param,healthGetExamDateList_callback);
};
function healthGetExamDateList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("examDate_script",data);
        $("#examDate").empty().append(html);

        
        $("#examDate").change(function () {
            healthGetClassHealthInfo_port();
        });
        if(data.arr.length !=0){
            healthGetClassHealthInfo_port();
        }else{
            $("#tableBox").empty();
            $("#editBtn,#deleteBtn").addClass("disable");
        }
    };
};

// 获得班级健康信息
function healthGetClassHealthInfo_port() {
    var data={
            classUUID:$("#teacherClass").val(),
            examDate:$("#examDate").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthGetClassHealthInfo,param,healthGetClassHealthInfo_callback);
};
function healthGetClassHealthInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);

        $("#editBtn,#deleteBtn").addClass("disable");
    };
};

// 删除健康信息
function healthDeleteHealthInfo_port() {
    var data={
            hiUUID:$(".table >tbody >tr.active").attr("data-id")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthDeleteHealthInfo,param,healthDeleteHealthInfo_callback);
};
function healthDeleteHealthInfo_callback(res) {
    if(res.code==200){
        healthGetExamDateList_port();
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
                data.arr[i].current=true;
            }else{
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
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
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
        $("#template").attr("href","healthInfo_template.xls");
    };
};