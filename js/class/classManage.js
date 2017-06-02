$(function () {
    menu();
    init();
});
function init() {
    classGradeList_port();
    classInfo_port();

    // 图层折叠
    $("#newBtn").click(function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-useruuid","");
        $("#content01").find("input[type=text]").val("");
    });

    $("#classUpBtn").click(function () {
        $(".content").addClass("hide");
        $("#content02").removeClass("hide");
        classBasicInfo_port();
    });

    $("#classExchangeBtn").click(function () {
        $(".content").addClass("hide");
        $("#content03").removeClass("hide");
    });

    // 新增图层返回主界面
    $(".closeBtn").click(function () {
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });

    // 编辑老师按钮
    $("#editBtn").click(function () {
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
    $("#deleteBtn").click(function () {
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


    $("#allClass01").on("dblclick",".flower",function () {
        $(this).addClass("active");
        $(this).find("textarea").focus();
    });

    $("#allClass01").on("focusout",".flower textarea",function () {
        $(this).parents(".flower").removeClass("active");
        if($(this).val()){
            $(this).prev("span").text($(this).val());
        }
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
        console.log(data);
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
                }]
        };
        var html01=template("allClass01_script",json01);
        $("#allClass01").empty().append(html01);
        console.log(html);
    }else{
        toastTip("提示",res.info);
    };
};



// Row行选择函数
function chooseRow() {
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
