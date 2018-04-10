$(function () {
    menu();
    init();
});
function init() {
    orangeEquipmentList_port();// 获得所有教职工类型

    $('#beginTime03').datepicker({
            todayHighlight:true,
            language:'zh-CN'
        }).on("changeDate",function (ev) {
            if($("#beginTime03").val()){
                $("#beginTime03").removeClass("empty");
            }else{
                $("#beginTime03").addClass("empty");
            };
            $('#beginTime03').datepicker("hide");

            var beginTime=new Date($("#beginTime03").val()).getTime();
            var endTime=new Date($("#endTime03").val()).getTime();

            if(beginTime && endTime){
                if(beginTime <= endTime){
                    orangeCardList_port();
                }else{
                    orangeCardList_port();
                    toastTip("提示","开始时间 需小于 结束时间。",2000);
                };
            };
    });

    $('#endTime03').datepicker({
            todayHighlight:true,
            language:'zh-CN'
        }).on("changeDate",function (ev) {
            if($("#endTime03").val()){
                $("#endTime03").removeClass("empty");
            }else{
                $("#endTime03").addClass("empty");
            };
            $('#endTime03').datepicker("hide");

            var beginTime=new Date($("#beginTime03").val()).getTime();
            var endTime=new Date($("#endTime03").val()).getTime();

            if(beginTime && endTime){
                if(beginTime <= endTime){
                    orangeCardList_port();
                }else{
                    orangeCardList_port();
                    toastTip("提示","开始时间 需小于 结束时间。",2000);
                };
            };
    });

    $("#device,#studentName").change(function () {
        orangeCardList_port();
    });

    // 姓名
    $("#studentName").keyup(function (e) {
        if(e.which ==13){
            orangeCardList_port();
        };
    });

    // 点击查询按钮
    $("#searchBtn").click(function () {
        orangeCardList_port('',1);
    });
    $("#refreshBtn").click(function () {
        orangeCardList_port('',2);
    });

    // 路线为空的预览图
    $('#prevBg >span').on('click',function () {
        orangeCardList_port();
    });

    // 卡号复制剪切板成功
    new Clipboard('.copyBtn', {
        text: function(trigger) {
            toastTip('提示','卡号复制剪切板成功');
            return trigger.getAttribute('data-id');
        }
    });
};

// 获取设备列表
function orangeEquipmentList_port(pageNum) {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeEquipmentList,param,orangeEquipmentList_callback);
};
function orangeEquipmentList_callback(res) {
    if(res.code==200){
        loadingOut();//关闭loading

        var data=JSON.parse(res.data);
        var html=template("device_script",{arr:data});
        $("#device").append(html);
        orangeCardList_port();
    };
};

// 获取所有的刷卡记录
function orangeCardList_port(pageNum,type) {
    if($("#beginTime03").val()){
        var beginTime=new Date($("#beginTime03").val()+" 00:00:00").getTime()/1000;
    }else{
        var beginTime="";
    };
    if($("#endTime03").val()){
        var endTime=new Date($("#endTime03").val()+" 23:59:59").getTime()/1000;
    }else{
        var endTime="";
    };

    var data={
            beginTime:beginTime || "",
            endTime:endTime || "",
            equipmentId:$("#device").val(),
            studentName:$("#studentName").val(),
            pageNumber:pageNum || 1,
            pageSize:20
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeCardList,param,orangeCardList_callback,type);
};
function orangeCardList_callback(res,type) {
    if(res.code==200){
        
        var data=JSON.parse(res.data);

        $('.content').addClass('hide');
        // if(data.list.length ==0){
        //     $('#contentPrev').removeClass('hide');
        // }else{
        //     $('#content').removeClass('hide');
        // };
        $('#content').removeClass('hide');
        
        for(var i=0;i<data.list.length;i++){
            data.list[i].createTime01=new Date(data.list[i].createTime*1000).Format("yyyy-MM-dd hh:mm");
        };
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

        if(type ==1){
            toastTip('提示','查询成功');
        }else if(type ==2){
            toastTip('提示','刷新成功');
        };
        
        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRow,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNumber,
            cssStyle: '',
            onPageClick: function (pageNumber, event) {
                orangeCardList_port(pageNumber);
            }
        });
    };
};

// Row行选择函数
function chooseRow() {
    chooseNiceScroll("#tableBox");
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏

    $("#tableBox .table.table-email tbody tr >td.email-sender").on({
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
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-210);

            var aa=$(this).find('i').hasClass('fa-check-square-o');
            if(aa){
                $(this).parent().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
                $(this).parent().siblings().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            }else{
                $(this).parent().find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
                $(this).parent().siblings().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            };  
        }
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