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

    // 图层折叠
    $("#newBtn").click(function () {
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

    // 新增老师按钮
    $("#new").click(function () {
        var text=$("#content01 >.pageTitle >small").text();
        if(text =="新增"){
            teacherAdd_port();
        }else{
            teacherUpdate_port($("#content01 >.pageTitle >small").attr("data-useruuid"));
        };
    });

    // 删除老师按钮
    $("#deleteBtn").click(function () {
        teacherDelete_port();
    });

    // 编辑老师按钮
    $("#editBtn").click(function () {
        teacherSingleStaffInfo_port();
    });
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
        $("#birthday").val(data.birthday);
        $("#phoneNum").val(data.phoneNum);
        $("#userName").val(data.name);
        $("#teacherType01 >option[value="+data.jobTitle+"]").prop("selected",true);
        $("#sex >option[value="+data.sex+"]").prop("selected",true);
        for(var i=0;i<data.className.length;i++){
            $("#teacherClass01 input[value="+data.className[i]+"]").prop("checked",true);
        };
    }else{
        toastTip("提示",res.info);
    };
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
            jobTitle:$("#teacherType01").val(),
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

// 新建教职工
function teacherUpdate_port(userUUID) {
    var classList=[];
    var AA=$("#content01").find("input[type=checkbox]:checked");
    for(var i=0;i<AA.length;i++){
        classList.push(AA.eq(i).val())
    };
    var data={
            birthday:$("#birthday").val(),
            classList:classList,
            jobTitle:$("#teacherType01").val(),
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

// 移除教职工
function teacherDelete_port() {
    var userUUID=[];
    var AA=$(".table tbody tr i.fa-check-square-o");
    for(var i=0;i<AA.length;i++){
        userUUID.push(AA.eq(i).attr("data-id"))
    };
    
    var data={
            userUUID: userUUID  
    };
    console.log(data);
    var param={
            params:JSON.stringify(data),
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

        var html01=template("teacherClass01_script",data);
        $("#teacherClass01").empty().append(html01);
        teacherStaffInfo_port();
    };
};

// 获得教职工列表
function teacherStaffInfo_port(pageNum) {
    var data={
            classUUID:$("#teacherClass").val(),
            jobTitle:$("#teacherType").val(),
            pageNum:pageNum || 1,
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

// 菜单
function menu() {
    menuChildList_port("309657696842416129");

    $("#switch").click(function () {
        var aa=$(this);
        $(this).prev("#sidebarBox").fadeToggle(function () {
            aa.toggleClass("active");
            $("#content").toggleClass("active");
        });
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
    initAjax(httpUrl.menuChildList,param,menuChildList_callback);
};
function menuChildList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={
                arr:[{
                    name:"教师信息",
                    id:"1",
                    url:"teachers.html",
                    icon:"1eff1a1fd5d0f2587e2d54aa66ded19a"
                },{
                    name:"幼儿信息",
                    id:"2",
                    url:"children.html",
                    icon:"ed8b3dcebd44ebfc41ac697f09346fb1"
                },{
                    name:"班级管理",
                    id:"3",
                    url:"classManage.html",
                    icon:"1337c7d316df12cbaa67f2bed9803066"
                }],
                path_img:httpUrl.path_img
        };
        var html=template("menu_script",data01);
        $("#subMenu").empty().append(html);
        chooseNiceScroll("#sidebarBox","transparent");
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

// 编辑行
function editRow() {
    //  编辑接口函数
    $("#courseEdit").click(function () {
        var num=$(".table tbody tr i.fa-check-square-o").length;
        if(num>1){
            alert("编辑时为单选，请重新选择。。");
            $(".table tbody tr i.fa-check-square-o").removeClass('fa-check-square-o').addClass('fa-square-o');
        }else if(num==0){
            alert("请先选择。。");
        }else{
            var courseId=$(".table tbody tr i.fa-check-square-o").attr('data-id');  
            window.location.href="coursePlanning_edit.html"+"?userUuid="+user.userUuid+"&classId="+user.classId+"&perssionNames=教学管理预设计划课程计划编辑"+"&courseId="+courseId;
        }
    });   
}

// niceScroll滚动条
function chooseNiceScroll(AA,color) {
    $(AA).niceScroll({ 
        cursorcolor: color || "#ccc",//#CC0071 光标颜色 
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
        touchbehavior: true, //使光标拖动滚动像在台式电脑触摸设备 
        cursorwidth: "5px", //像素光标的宽度 
        cursorborder: "0", //     游标边框css定义 
        cursorborderradius: "5px",//以像素为光标边界半径 
        autohidemode: true //是否隐藏滚动条 
    });
};

// 消息提示函数
function toastTip(heading,text,hideAfter) {
    $.toast({
            heading: heading,
            text: text,
            showHideTransition: 'slide',
            icon: 'success',
            hideAfter: hideAfter || 1500,
            loaderBg: '#13b5dd',
            position: 'bottom-right',
            afterHidden: function () {
                // window.location.href=httpUrl.loginHttp;
            }
    });
};