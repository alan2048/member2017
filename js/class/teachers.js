$(function () {
    init();
});
function init() {
    menu();
   
    teacherAllType_port();// 获得所有教职工类型
    // 查询条件改变执行函数
    $("#teacherType,#teacherClass").change(function () {
        teacherStaffInfo_port();
    });

    // 点击查询按钮
    $("#searchBtn").click(function () {
        teacherStaffInfo_port();
    });

    // 搜索教师事件
    $("#teacherName").keyup(function (e) {
        if(e.which ==13){
            teacherStaffInfo_port();
        };
    });

    $('#birthday').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        if($("#birthday").val()){
            $("#birthday").removeClass("empty");
        }else{
            $("#birthday").addClass("empty");
        };
        $('#birthday').datepicker("hide");
    });

    // 图层折叠
    $("#buttonBox").on("click","#newBtn",function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-useruuid","");
        $("#content01").find("input[type=text]").val("");
        $("#content01").find("input[type=checkbox]:checked").prop("checked",false);
    });

    // 新增图层返回主界面
    $(".closeBtn").click(function () {
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });

    // 删除老师按钮
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
                        teacherDelete_port();
                    };
            });
        };
    });

    // 编辑老师按钮
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");
        }else{
            teacherSingleStaffInfo_port();
        };
    });

    // 验证keyup去除必填项
    $("#userName,#birthday").keyup(function () {
        if(!$(this).val()){
            $(this).addClass("empty");
        }else{
            if($(this).val().length >20){
                $(this).addClass("empty");
                toastTip("提示","姓名最长为20字。。");
            }else{
                $(this).removeClass("empty");
            };
        };
    });
    
    $("#phoneNum").keyup(function () {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        var phone=$("#phoneNum").val();
        if(!reg.test(phone) && phone.length >=11){
            $("#phoneNum").addClass("empty").next("span").removeClass("hide");
        }else{
            $("#phoneNum").removeClass("empty").next("span").addClass("hide");
        };
    });

    // 新增老师按钮
    $("#new").click(function () {
        ValidateInput();
        if($(".newBox .empty").length ==0){
            var text=$("#content01 >.pageTitle >small").text();
            if(text =="新增"){
                teacherAdd_port();
            }else{
                teacherUpdate_port($("#content01 >.pageTitle >small").attr("data-useruuid"));
            };
        }else{
            toastTip("提示","请先填写完整。。");   
        };
    });
};



// 新建教职工
function teacherAdd_port() {
    var classList=[];
    var AA=$("#content01").find("input[type=checkbox]:checked");
    for(var i=0;i<AA.length;i++){
        classList.push(AA.eq(i).val())
    };
    var data={
            birthday:$("#birthday").val(),
            classList:classList,
            typeID:$("#teacherType01").val(),
            phoneNum:$("#phoneNum").val(),
            sex:$("#sex").val(),
            userName:$("#userName").val()      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherAdd,param,teacherAdd_callback);
};
function teacherAdd_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        teacherStaffInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 验证input输入
function ValidateInput() {
    if(!$("#userName").val()){
        $("#userName").addClass("empty");
    }else{
        if($("#userName").val().length >20){
            $("#userName").addClass("empty");
            toastTip("提示","姓名最长为20字。。");
        }else{
            $("#userName").removeClass("empty");
        };
    };

    if(!$("#birthday").val()){
        $("#birthday").addClass("empty");
    }else{
        $("#birthday").removeClass("empty");
    };

    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    var phone=$("#phoneNum").val();
    if(!reg.test(phone)){
        $("#phoneNum").addClass("empty").next("span").removeClass("hide");
    }else{
        $("#phoneNum").removeClass("empty").next("span").addClass("hide");
    };
};

// 获得单项教职工条目
function teacherSingleStaffInfo_port() {
    var data={
            userUUID: $(".table tbody tr i.fa-check-square-o").attr("data-id")  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherSingleStaffInfo,param,teacherSingleStaffInfo_callback,data.userUUID);
};
function teacherSingleStaffInfo_callback(res,userUUID) {
    if(res.code==200){
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("编辑").attr("data-useruuid",userUUID);
        $("#content01").find("input[type=text]").val("");
        $("#content01").find("input[type=checkbox]:checked").prop("checked",false);

        var data=JSON.parse(res.data);
        console.log(data);
        $("#birthday").val(data.birthday);
        $("#phoneNum").val(data.phoneNum);
        $("#userName").val(data.name);
        $("#teacherType01 >option[value="+data.typeID+"]").prop("selected",true);
        $("#sex >option[value="+data.sex+"]").prop("selected",true);
        for(var i=0;i<data.classInfo.length;i++){
            $("#teacherClass01 input[value="+data.classInfo[i].classUUID+"]").prop("checked",true);
        };
    }else{
        toastTip("提示",res.info);
    };
};

// 修改教职工
function teacherUpdate_port(userUUID) {
    var classList=[];
    var AA=$("#content01").find("input[type=checkbox]:checked");
    for(var i=0;i<AA.length;i++){
        classList.push(AA.eq(i).val())
    };
    var data={
            birthday:$("#birthday").val(),
            classList:classList,
            typeID:$("#teacherType01").val(),
            phoneNum:$("#phoneNum").val(),
            sex:$("#sex").val(),
            userName:$("#userName").val(),
            userUUID:userUUID      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherUpdate,param,teacherUpdate_callback);
};
function teacherUpdate_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        teacherStaffInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 删除教职工
function teacherDelete_port() {
    var userUUID=[];
    var AA=$(".table tbody tr i.fa-check-square-o");
    for(var i=0;i<AA.length;i++){
        userUUID.push(AA.eq(i).attr("data-id"))
    };
    var param={
            params:JSON.stringify(userUUID),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherDelete,param,teacherDelete_callback);
};
function teacherDelete_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        teacherStaffInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 获得所有教职工类型
function teacherAllType_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherAllType,param,teacherAllType_callback);
};
function teacherAllType_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherType_script",data);
        $("#teacherType,#teacherType01").append(html);
        teacherMyClassInfo_port();// 获得教职工所在班级列表
    };
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
        basicAllClassInfo_port();
        teacherStaffInfo_port();
    };
};

// 获得登录人所在学校所有班级列表
function basicAllClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicAllClassInfo,param,basicAllClassInfo_callback);
};
function basicAllClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html01=template("teacherClass01_script",data);
        $("#teacherClass01").empty().append(html01);
    };
};

// 获得教职工列表
function teacherStaffInfo_port(pageNum) {
    var data={
            classUUID:$("#teacherClass").val(),
            typeID:$("#teacherType").val(),
            pageNum:pageNum || 1,
            pageSize:12,
            searchName:$("#teacherName").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherStaffInfo,param,teacherStaffInfo_callback);
};
function teacherStaffInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        chooseRow();
        console.log(data);

        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRecord,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNum,
            cssStyle: '',
            onPageClick: function (pageNumber, event) {
                teacherStaffInfo_port(pageNumber);
            }
        });
    };
};


// Row行选择函数
function chooseRow() {
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    $(".table thead tr i").click(function () {
        var aa=$(".table thead tr i").hasClass('fa-check-square-o');
        if(aa){
            $(".table tbody tr i").removeClass('fa-check-square-o').addClass('fa-square-o');
            $(this).removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(".table tbody tr i").removeClass('fa-square-o').addClass('fa-check-square-o');
            $(this).removeClass('fa-square-o').addClass('fa-check-square-o');
        };
        ValidateBtn();
    });
    $(".table tbody tr").click(function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
        };
        ValidateBtn();
    });

}

// 验证编辑删除按钮
function ValidateBtn() {
    var num=$(".table tbody tr i.fa-check-square-o").length;
    if(num ==0){
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    }else if( num ==1){
        $("#editBtn,#deleteBtn").removeClass("disable");
    }else{
        $("#editBtn").addClass("disable");
        $("#deleteBtn").removeClass("disable");
    }
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
