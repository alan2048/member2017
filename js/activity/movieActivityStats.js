$(function () {
    init();
});
function init() {
    menu();

    // 分页切换
    $("#tabs >ul >li").click(function () {
        $(this).addClass("current").siblings().removeClass("current"); 
        $("#tabsBox >ul >li").eq($(this).index()).addClass("current").siblings().removeClass("current");

        switch($(this).index()){
            case 0:
                if($("#email-content").children().length ==0){
                    getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#time01").val()))/1000);
                };
                break;
            case 1:
                if($("#email-content01").children().length ==0){
                    getCourseClassTJ_port($("#userClass").val(),Date.parse(new Date($("#time02").val()))/1000);
                };
                break;
            case 2:
                if($("#email-content02").children().length ==0){
                    getCourseStudentTJ_port($("#userClass01").val(),$("#student").val());
                };
                break;
            default:
                if($("#email-content").children().length ==0){
                    getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#time01").val()))/1000);
                };
        };
    });

    // 选项卡01
    $('#time01').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        $('#time01').datepicker("hide");
        if($("#time01").val()){
            getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#time01").val()))/1000);
        }else{
            $("#email-content tbody").empty();
        }
    });

    $("#school").change(function () {
        getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#time01").val()))/1000);
    });
    $("#searchBtn01").click(function () {
        getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#time01").val()))/1000);
    });

    // 活动统计详情
    $("#email-content").on("click",".detailBtn",function () {
        // console.log($(this).attr("data-id"));
        getCourseStudentDetailTJ_port($(this).attr("data-id"),Date.parse(new Date($("#time01").val()))/1000);
    });

    // 选项卡02
    $('#time02').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        $('#time02').datepicker("hide");
        if($("#time02").val()){
            getCourseClassTJ_port($("#userClass").val(),Date.parse(new Date($("#time02").val()))/1000);
        }else{
            $("#email-content01 tbody").empty();
        }
    });

    $("#userClass").change(function () {
        getCourseClassTJ_port($("#userClass").val(),Date.parse(new Date($("#time02").val()))/1000);
    });
    $("#searchBtn02").click(function () {
        getCourseClassTJ_port($("#userClass").val(),Date.parse(new Date($("#time02").val()))/1000);
    });

    // 选项卡03
    $("#student").change(function () {
        getCourseStudentTJ_port($("#userClass01").val(),$("#student").val());
    });
    $("#searchBtn03").click(function () {
        getCourseStudentTJ_port($("#userClass01").val(),$("#student").val());
    });

    // 滚动到顶
    $("[data-click=scroll-top]").click(function(e){
        e.preventDefault();
        $("html, body").animate({scrollTop:$("body").offset().top},500)
    });
    // 滚动 显示隐藏
    $(document).scroll(function(){
        var e=$(document).scrollTop();
        if(e>=800){
            $("[data-click=scroll-top]").addClass("in");
        }else{
            $("[data-click=scroll-top]").removeClass("in");
        };
        if(e>=200){
            $("#changeClass").addClass("active");
        }else{
            $("#changeClass").removeClass("active");
        };
    });
};

// 获取园区ID
function GetSchoolIds_port() {
    var data={
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.GetSchoolJYIds,param,GetSchoolIds_callback);
};
function GetSchoolIds_callback(res) {
    if(res.code==200){
        if(res.data =="[]"){
            $("#modal03").modal("show");
        }else{
            var data=JSON.parse(res.data);
            var data01={data:data};
            var html=template("school_script",data01);
            $("#school").empty().append(html);
            $("#time01").val(new Date().Format("yyyy-MM-dd"));
            getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#time01").val()))/1000);
        }
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 01 自选活动 活动统计
function getCourseSimpleTJ_port(schoolId,time) {
    var data={
            schoolId:schoolId,
            useruuid:user.userUuid,
            time:(time-28800).toString()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getCourseSimpleTJ,param,getCourseSimpleTJ_callback);
};
function getCourseSimpleTJ_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].image=httpUrl.path_img+data[i].pic+"&minpic=1";
        };
        var data01={data:data};
        var html=template("table-email_script",data01);
        $("#email-content").empty().append(html);
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 自选活动 活动统计详情
function getCourseStudentDetailTJ_port(courseId,time) {
    var data={
            courseId:courseId,
            useruuid:user.userUuid,
            time:(time-28800).toString()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getCourseStudentDetailTJ,param,getCourseStudentDetailTJ_callback);
};
function getCourseStudentDetailTJ_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={data:data};
        var html=template("table-email03_script",data01);
        $("#email-content03").empty().append(html);
        chooseNiceScroll("#email-content03");
        $("#myModal").modal("show")
    }else{
        // console.log('请求错误，返回code非200');
    }
};




// 获取用户班级信息接口
function getUserClassInfo_port() {
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicMyClassInfo,param,getUserClassInfo_callback);
};
function getUserClassInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("userClass_script",{data:data});
        $("#userClass,#userClass01").empty().append(html);
        $("#time02").val(new Date().Format("yyyy-MM-dd"));
        if($("#student").children().length ==0){
            getClassStudentInfo_port($("#userClass01").val())
        };
        // 切换班级时成员接口切换
        $("#userClass01").change(function () {
            getClassStudentInfo_port($(this).val());
        });
    }else{
        // console.log('请求错误，返回code非200');
    }
};

function getClassStudentInfo_port(classId) {
    var data={
            classId:classId
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicStudent,param,getClassStudentInfo_callback);
};
function getClassStudentInfo_callback(res,tabIndex) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("student_script",{data:data});
        $("#student").empty().append(html);

        getCourseStudentTJ_port($("#userClass01").val(),$("#student").val());
    }else{
        // console.log('请求错误，返回code非200');
    }
};



// 02 自选活动 班级统计
function getCourseClassTJ_port(classId,time) {
    var data={
            classId:classId,
            useruuid:user.userUuid,
            time:(time-28800).toString(),
            type:"1"
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getCourseClassTJ,param,getCourseClassTJ_callback);
};
function getCourseClassTJ_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={data:data};
        var html=template("table-email01_script",data01);
        $("#email-content01").empty().append(html);
        
    }else{
        // console.log('请求错误，返回code非200');
    }
};


// 03 自选活动 学生统计
function getCourseStudentTJ_port(classId,userUuid) {
    var data={
            classId:classId,
            useruuid:userUuid,
            type:"1"
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getCourseStudentTJ,param,getCourseStudentTJ_callback);
};
function getCourseStudentTJ_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={data:data};
        var html=template("table-email02_script",data01);
        $("#email-content02").empty().append(html);
    }else{
        $("#email-content02 tbody").empty();
        // console.log('请求错误，返回code非200');
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
    }else if(res.coed =404){
        window.location.href="../../index.html";
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
        $("#user >.userName").text(data.name).attr("data-useruuid",data.userUUID);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });
        user.userUuid=data.userUUID;
        user.typeID=data.typeID;
        GetSchoolIds_port();
        getUserClassInfo_port();
        loadingOut();//关闭loading
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