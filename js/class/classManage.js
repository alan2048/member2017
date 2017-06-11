$(function () {
    menu();
    init();
});
function init() {

    classGradeList_port();
    classInfo_port();

    // 图层折叠
    $("#buttonBox").on("click","#newBtn",function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-useruuid","");
        $("#content01").find("input[type=text]").val("");
    });

    // 升班按钮
    $("#buttonBox").on("click","#classUpBtn",function () {
        $(".content").addClass("hide");
        $("#content02").removeClass("hide");
        $(".classNow,#classUpBtn01,#allClass01 .flower").removeClass("hover");
        classBasicInfo_port();
    });

    // 调班进入按钮
    $("#buttonBox").on("click","#classExchangeBtn",function () {
        $(".content").addClass("hide");
        $("#content03").removeClass("hide");
        classMemberBasic_port($("#teacherClass").val(),$("#teacherClass"));
        classMemberBasic_port($("#teacherClass01").val(),$("#teacherClass01"));
    });

    // 切换学生列表
    $("#teacherClass,#teacherClass01").change(function () {
         classMemberBasic_port($(this).val(),$(this));
    });

    // 调班选择学生
    $(".exchangeNowBox").on("click",".exchangeIcon",function () {
        $(this).toggleClass("active"); 
    });

    // 调班
    $("#exchangeBtn").click(function () {
        if($(".exchangeNowBox .exchangeIcon.active").length ==0){
            toastTip("提示","请先选择人");
        }else if($("#teacherClass").val() == $("#teacherClass01").val()){
            toastTip("提示","调入的班级需与原班级不同");
        }else{
            classChange_port();
        };
    });

    // 返回主界面
    $(".closeBtn").click(function () {
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });

    $(".backBtn").click(function () {
        if($(this).hasClass("tip")){
            if($("#classUpBtn01").hasClass("hover")){
                $(".content").addClass("hide");
                $("#content").removeClass("hide");
            }else{
                swal({
                    title: "是否退出此次编辑",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e15d5d",
                    confirmButtonText: "退出",
                    cancelButtonText: "考虑一下",
                    closeOnConfirm: true,
                    closeOnCancel: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            $(".content").addClass("hide");
                            $("#content").removeClass("hide");
                        };
                });
            };
        }else{
            $(".content").addClass("hide");
            $("#content").removeClass("hide");
        }
        
    });

    // 编辑老师按钮
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");
        }else{
            classSingleClassInfo_port();
        };
    });

    // 新增老师按钮
    $("#new").click(function () {
        ValidateInput();
        if($(".newBox .empty").length ==0){
            var text=$("#content01 >.pageTitle >small").text();
            if(text =="新增"){
                classAdd_port();
            }else{
                classUpdate_port($("#content01 >.pageTitle >small").attr("data-useruuid"));
            };
        }else{
            toastTip("提示","请先填写完整。。");   
        };
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
                        classDelete_port();
                    };
            });
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


    // 升班
    $("#allClass01").on("dblclick",".flower",function () {
        $(this).addClass("active");
        $(this).find("textarea").focus();
    });

    $("#allClass01").on("focusout",".flower textarea",function () {
        $(this).parents(".flower").removeClass("active");
        if($(this).val()){
            $(this).prev("span").text($(this).val());
            $(this).parents(".flower").removeClass("empty");
        }
    });

    $("#classUpBtn01").click(function () {
        if($(this).hasClass("hover")){
            toastTip("提示","已升班成功",2500);
        }else{
            for(var i=0;i<$("#allClass01 .flower >span").length;i++){
                if($("#allClass01 .flower >span").eq(i).text()=="编辑" || !$("#allClass01 .flower >span").eq(i).text()){
                    $("#allClass01 .flower >span").eq(i).parent().addClass("empty");
                }else{
                    $("#allClass01 .flower >span").eq(i).parent().removeClass("empty");
                };
            };

            if($("#allClass01 .flower").hasClass("empty")){
                toastTip("提示","升班后的班级名字不可为空或编辑，请先编辑红色花瓣的班级名称",2500);
            }else{
                classUpgrade_port();
            };
        };
    });


};


//  获得年级列表
function classGradeList_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classGradeList,param,classGradeList_callback);
};
function classGradeList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("grade_script",data);
        $("#grade").append(html);
        basicAllClassInfo_port();
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
        var html01=template("teacherClass_script",data);
        $("#teacherClass,#teacherClass01").empty().append(html01);
    };
};

// 获取班级幼儿及教职工名单
function classMemberBasic_port(classUUID,AA,json) {
    var aa=$(AA).parent().next();
    var data={
            classUUID:classUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classMemberBasic,param,classMemberBasic_callback,aa,json);
};
function classMemberBasic_callback(res,aa,json) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("exchangeBox_script",data);
        $(aa).empty().append(html);

        chooseNiceScroll(".exchangeBg")
        // 绑定调班后结果
        if(json){
            for(var i=0;i<json.personList.length;i++){
                $(".exchangeAfterBox .exchangeIcon[data-uuid="+json.personList[i].personUUID+"]").addClass("active");
            };
        }
    };
};

// 调班
function classChange_port() {
    var personList=[];
    for(var i=0;i<$(".exchangeNowBox .exchangeIcon.active").length;i++){
        var json={
               personName: $(".exchangeNowBox .exchangeIcon.active").eq(i).text(),
               personUUID: $(".exchangeNowBox .exchangeIcon.active").eq(i).attr("data-uuid"),
               type: $(".exchangeNowBox .exchangeIcon.active").eq(i).attr("data-typeid")
        };
        personList.push(json);
    }
    var data={
            lastClassUUID:$("#teacherClass").val(),
            newClassUUID:$("#teacherClass01").val(),
            personList:personList
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classChange,param,classChange_callback,data);
};
function classChange_callback(res,data) {
    if(res.code==200){
        classMemberBasic_port($("#teacherClass").val(),$("#teacherClass"));
        classMemberBasic_port($("#teacherClass01").val(),$("#teacherClass01"),data);
        toastTip("提示","调班成功");
    }else{
        toastTip("提示",res.info);
    };
};

//  获得班级列表及人员数量
function classInfo_port(pageNum) {
    var data={
            pageNum:pageNum || 1,
            pageSize:12,
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classInfo,param,classInfo_callback);
};
function classInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        chooseRow();

        // 空信息时清空家长信息
        if($(".table.table-email tbody tr").length ==0){
            $(".table:not(.table-email) tbody").empty();
        }else{
            $(".table.table-email tbody tr:first >td.email-sender:first").click();
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",70);
        };
        
        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRecord,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNum,
            cssStyle: '',
            onPageClick: function (pageNumber, event) {
                classInfo_port(pageNumber);
            }
        });
    };
};


//   获得班级教职工列表
function classOfStaff_port(classUUID) {
    var data={
            classUUID: classUUID  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classOfStaff,param,classOfStaff_callback,data.userUUID);
};
function classOfStaff_callback(res,userUUID) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox01_script",data);
        $("#tableBox01").empty().append(html);
    }else{
        toastTip("提示",res.info);
    };
};


//  新增班级
function classAdd_port() {
    var data={
            className:$("#className").val(),
            gradeUUID:$("#grade").val()      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classAdd,param,classAdd_callback);
};
function classAdd_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        classInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};


// 获得单项班级条目
function classSingleClassInfo_port() {
    var data={
            classUUID: $(".table tbody tr i.fa-check-square-o").attr("data-classuuid")  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classSingleClassInfo,param,classSingleClassInfo_callback,data.classUUID);
};
function classSingleClassInfo_callback(res,classUUID) {
    if(res.code==200){
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("编辑").attr("data-useruuid",classUUID);
        $("#content01").find("input[type=text]").val("");

        var data=JSON.parse(res.data);
        $("#className").val(data.className);
        $("#grade >option[value="+data.gradeUUID+"]").prop("selected",true);
    }else{
        toastTip("提示",res.info);
    };
};

// 修改班级
function classUpdate_port(classUUID) {
    var data={
            className:$("#className").val(),
            gradeUUID:$("#grade").val(),
            classUUID:classUUID    
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classUpdate,param,classUpdate_callback);
};
function classUpdate_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        classInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 删除班级
function classDelete_port() {
    var classUUID=[];
    var AA=$(".table tbody tr i.fa-check-square-o");
    for(var i=0;i<AA.length;i++){
        classUUID.push(AA.eq(i).attr("data-classuuid"))
    };
    var param={
            params:JSON.stringify(classUUID),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classDelete,param,classDelete_callback);
};
function classDelete_callback(res) {
    if(res.code==200){
        classInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};


//  获得所有班级基础信息
function classBasicInfo_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classBasicInfo,param,classBasicInfo_callback);
};
function classBasicInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var json={
                arr:[{
                        name:"托班",
                        list:data.one
                    },{
                        name:"小班",
                        list:data.two
                    },{
                        name:"中班",
                        list:data.three
                    },{
                        name:"大班",
                        list:data.four
                }]
        };
        console.log(json);
        var html=template("allClass_script",json);
        $("#allClass").empty().append(html);

        var date=new Date();
        var json01={
                arr:[{
                        name:"小班",
                        list:data.one
                    },{
                        name:"中班",
                        list:data.two
                    },{
                        name:"大班",
                        list:data.three
                    },{
                        name:"毕业班",
                        list:data.four
                }],
                year: date.getFullYear()
        };
        console.log(json01);
        var html01=template("allClass01_script",json01);
        $("#allClass01").empty().append(html01);
        console.log(html);
    }else{
        toastTip("提示",res.info);
    };
};


//  获得所有班级基础信息
function classUpgrade_port() {
    var one=[];
    for(var i=0;i<$("#allClass01 li:nth-of-type(1) .flower span").length;i++){
        var obj={
                classUUID:$("#allClass01 li:nth-of-type(1) .flower span").eq(i).attr("data-classuuid"),
                className:$("#allClass01 li:nth-of-type(1) .flower span").eq(i).text()
        }
        one.push(obj);
    };
    var two=[];
    for(var i=0;i<$("#allClass01 li:nth-of-type(2) .flower span").length;i++){
        var obj={
                classUUID:$("#allClass01 li:nth-of-type(2) .flower span").eq(i).attr("data-classuuid"),
                className:$("#allClass01 li:nth-of-type(2) .flower span").eq(i).text()
        }
        two.push(obj);
    };
    var three=[];
    for(var i=0;i<$("#allClass01 li:nth-of-type(3) .flower span").length;i++){
        var obj={
                classUUID:$("#allClass01 li:nth-of-type(3) .flower span").eq(i).attr("data-classuuid"),
                className:$("#allClass01 li:nth-of-type(3) .flower span").eq(i).text()
        }
        three.push(obj);
    };
    var four=[];
    for(var i=0;i<$("#allClass01 li:nth-of-type(4) .flower span").length;i++){
        var obj={
                classUUID:$("#allClass01 li:nth-of-type(4) .flower span").eq(i).attr("data-classuuid"),
                className:$("#allClass01 li:nth-of-type(4) .flower span").eq(i).text()
        }
        four.push(obj);
    };
    var data={
            one:one,
            two:two,
            three:three,
            four:four
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classUpgrade,param,classUpgrade_callback);
};
function classUpgrade_callback(res) {
    if(res.code==200){
        toastTip("提示","升班成功");
        $(".classNow,#classUpBtn01,#allClass01 .flower").addClass("hover");
        classInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};


// Row行选择函数
function chooseRow() {
    chooseNiceScroll("#tableBox");
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    $(".table.table-email thead tr i").click(function () {
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
    $(".table.table-email tbody tr >td.email-select").click(function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
        };
        ValidateBtn();
    });

    $(".table.table-email tbody tr >td.email-sender").on({
        mouseover:function () {
            $(this).addClass("active").siblings().addClass("active");
        },
        mouseout:function () {
            $(this).removeClass("active").siblings().removeClass("active");
        },
        click:function (e) {
            $(this).parent().siblings().find("td").removeClass("current");
            $(this).addClass("current").siblings().addClass("current");
            var num=$(this).parent().index()*52+70;
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-230);
            classOfStaff_port($(this).prevAll("td.email-select").find("i").attr("data-classuuid"));   
        }
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
};

(function($){
    $.fn.datepicker.dates['zh-CN'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            suffix: [],
            meridiem: ["上午", "下午"]
    };
}(jQuery));







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
