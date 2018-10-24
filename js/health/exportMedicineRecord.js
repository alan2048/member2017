$(function () {
    init();
});
function init() {
    menu();

    var curMonth=function () {
        if(new Date().getMonth() <9){
            return "-0"+(new Date().getMonth()+1);
        }else{
            return "-"+(new Date().getMonth()+1);
        }
    }();

    $("#beginTime01,#beginTime02,#endTime01,#endTime02").val(new Date().getFullYear()+curMonth+"-"+new Date().getDate());

    // 日历
    $('#beginTime01').datepicker({
            todayHighlight:true,
            language:'zh-CN'
        }).on("changeDate",function (ev) {
            if($("#beginTime01").val()){
                $("#beginTime01").removeClass("empty");
            }else{
                $("#beginTime01").addClass("empty");
            };
            $('#beginTime01').datepicker("hide");

            var beginTime=new Date($("#beginTime01").val()).getTime();
            var endTime=new Date($("#endTime01").val()).getTime();
            if(beginTime > endTime){
                toastTip("提示","开始时间 需小于等于 结束时间。",2000);
            };
        }).on('click',function () {
        if($(this).val()){
            $(this).datepicker("update",$(this).val());
        }else{
            $(this).datepicker("update",new Date()).datepicker('update',"");
        };
    });

    $('#endTime01').datepicker({
            todayHighlight:true,
            language:'zh-CN'
        }).on("changeDate",function (ev) {
            if($("#endTime01").val()){
                $("#endTime01").removeClass("empty");
            }else{
                $("#endTime01").addClass("empty");
            };
            $('#endTime01').datepicker("hide");

            var beginTime=new Date($("#beginTime01").val()).getTime();
            var endTime=new Date($("#endTime01").val()).getTime();
           if(beginTime > endTime){
                toastTip("提示","开始时间 需小于等于 结束时间。",2000);
            };
        }).on('click',function () {
        if($(this).val()){
            $(this).datepicker("update",$(this).val());
        }else{
            $(this).datepicker("update",new Date()).datepicker('update',"");
        };
    });

    $('#beginTime02').datepicker({
            todayHighlight:true,
            language:'zh-CN'
        }).on("changeDate",function (ev) {
            if($("#beginTime02").val()){
                $("#beginTime02").removeClass("empty");
            }else{
                $("#beginTime02").addClass("empty");
            };
            $('#beginTime02').datepicker("hide");

            var beginTime=new Date($("#beginTime02").val()).getTime();
            var endTime=new Date($("#endTime02").val()).getTime();
            if(beginTime > endTime){
                toastTip("提示","开始时间 需小于等于 结束时间。",2000);
            };
        }).on('click',function () {
        if($(this).val()){
            $(this).datepicker("update",$(this).val());
        }else{
            $(this).datepicker("update",new Date()).datepicker('update',"");
        };
    });

    $('#endTime02').datepicker({
            todayHighlight:true,
            language:'zh-CN'
        }).on("changeDate",function (ev) {
            if($("#endTime02").val()){
                $("#endTime02").removeClass("empty");
            }else{
                $("#endTime02").addClass("empty");
            };
            $('#endTime02').datepicker("hide");

            var beginTime=new Date($("#beginTime02").val()).getTime();
            var endTime=new Date($("#endTime02").val()).getTime();
           if(beginTime > endTime){
                toastTip("提示","开始时间 需小于等于 结束时间。",2000);
            };
        }).on('click',function () {
        if($(this).val()){
            $(this).datepicker("update",$(this).val());
        }else{
            $(this).datepicker("update",new Date()).datepicker('update',"");
        };
    });

    $("#content").on("click","#searchBtn",function () {
        var data={
                beginTime:new Date($("#beginTime01").val()).getTime()/1000,
                endTime:new Date($("#endTime01").val()).getTime()/1000
        };

        if(data.beginTime && data.endTime){
            if(data.beginTime > data.endTime){
                toastTip("提示","开始时间 需小于等于 结束时间。",2000);
            }else{
                window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url="+httpUrl.exportMedicineRecord+"&params="+JSON.stringify(data));
            };
        }else{
            toastTip("提示","请先选择开始时间和结束时间");
        };
    });

    $("#content").on("click","#searchBtn02",function () {
        var data={
                exportBeginTime:new Date($("#beginTime02").val()).getTime()/1000,
                exportEndTime:new Date($("#endTime02").val()).getTime()/1000,
                classId:$("#teacherClass").val()
        };

        if(data.exportBeginTime && data.exportEndTime){
            if(data.exportBeginTime > data.exportEndTime){
                toastTip("提示","开始时间 需小于等于 结束时间。",2000);
            }else{
                window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url="+httpUrl.exportDailyObservation+"&params="+JSON.stringify(data));
            };
        }else{
            toastTip("提示","请先选择开始时间和结束时间");
        };
    });

    $("#content").on("click","#searchBtn03",function () {
        var data={
                classId:$("#teacherClass02").val()
        };

        window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url="+httpUrl.exportIndividualCase+"&params="+JSON.stringify(data));
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
    }else if(res.code =404){
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
        $("#user >.userName").text(data.name);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
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
        $("#teacherClass,#teacherClass02").append(html01);
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