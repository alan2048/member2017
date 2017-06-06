$(function () {
    menu();
    init();
});
function init() {
    basicAllClassInfo_port();// 获得幼儿所在班级列表

    // 查询条件改变执行函数
    $("#teacherType,#teacherClass").change(function () {
        childrenInfo_port();
    });

    // 点击查询按钮
    $("#searchBtn").click(function () {
        childrenInfo_port();
    });

    // 搜索教师事件
    $("#teacherName").keyup(function (e) {
        if(e.which ==13){
            childrenInfo_port();
        };
    });

    // 图层折叠
    $("#newBtn").click(function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-useruuid","");
        $("#content01").find("input[type=text]").val("");
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
            childrenSingleChildInfo_port();
        };
    });

    // 新增老师按钮
    $("#new").click(function () {
        ValidateInput();
        if($(".newBox .empty").length ==0){
            var text=$("#content01 >.pageTitle >small").text();
            if(text =="新增"){
                childrenAdd_port();
            }else{
                childrenUpdate_port($("#content01 >.pageTitle >small").attr("data-useruuid"));
            };
        }else{
            toastTip("提示","请先填写完整。。");   
        };
    });

    // 日历
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
                        childrenDelete_port();
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
};


// 获得幼儿所在班级列表
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
        var html=template("teacherClass_script",data);
        $("#teacherClass").append(html);
        $("#teacherClass01").empty().append(html);
        childrenInfo_port();
    };
};

// 获得幼儿列表
function childrenInfo_port(pageNum) {
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
    initAjax(httpUrl.childrenInfo,param,childrenInfo_callback);
};
function childrenInfo_callback(res) {
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
                childrenInfo_port(pageNumber);
            }
        });
    };
};


//  获得幼儿家长列表
function childrenParentInfo_port(userUUID) {
    var data={
            userUUID: userUUID  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenParentInfo,param,childrenParentInfo_callback,data.userUUID);
};
function childrenParentInfo_callback(res,userUUID) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox01_script",data);
        $("#tableBox01").empty().append(html);
    }else{
        toastTip("提示",res.info);
    };
};


// 新建幼儿
function childrenAdd_port() {
    var data={
            birthday:$("#birthday").val(),
            classUUID:$("#teacherClass01").val(),
            sex:$("#sex").val(),
            userName:$("#userName").val()      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenAdd,param,childrenAdd_callback);
};
function childrenAdd_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        childrenInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};


// 获得单项幼儿条目
function childrenSingleChildInfo_port() {
    var data={
            userUUID: $(".table tbody tr i.fa-check-square-o").attr("data-id")  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenSingleChildInfo,param,childrenSingleChildInfo_callback,data.userUUID);
};
function childrenSingleChildInfo_callback(res,userUUID) {
    if(res.code==200){
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("编辑").attr("data-useruuid",userUUID);
        $("#content01").find("input[type=text]").val("");

        var data=JSON.parse(res.data);
        $("#birthday").val(data.birthday);
        $("#userName").val(data.name);
        $("#teacherClass01 >option[value="+data.classUUID+"]").prop("selected",true);
        $("#sex >option[value="+data.sex+"]").prop("selected",true);
    }else{
        toastTip("提示",res.info);
    };
};

// 修改幼儿
function childrenUpdate_port(userUUID) {
    var data={
            birthday:$("#birthday").val(),
            classUUID:$("#teacherClass01").val(),
            sex:$("#sex").val(),
            userName:$("#userName").val(),
            userUUID:userUUID      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenUpdate,param,childrenUpdate_callback);
};
function childrenUpdate_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        childrenInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 删除幼儿
function childrenDelete_port() {
    var userUUID=[];
    var AA=$(".table tbody tr i.fa-check-square-o");
    for(var i=0;i<AA.length;i++){
        userUUID.push(AA.eq(i).attr("data-id"))
    };
    var param={
            params:JSON.stringify(userUUID),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenDelete,param,childrenDelete_callback);
};
function childrenDelete_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        childrenInfo_port();
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
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-290);
            childrenParentInfo_port($(this).prevAll("td.email-select").find("i").attr("data-id"));   
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
