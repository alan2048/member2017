var jsonAll01,jsonAll02,jsonAll03;
$(function () {
    init();
});
function init() {
    menu();

    // 选项卡01
    $('#time01').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        $('#time01').datepicker("hide");
        if($("#time01").val()){
            echart_A02_port(Date.parse(new Date($("#time01").val()))/1000);//echart02初始化
        }else{
            $("#searchBox01").empty();
        }
    });

    $("#school").change(function () {
        echart_A02_port(Date.parse(new Date($("#time01").val()))/1000);//echart02初始化
    });

    // 选项卡02
    $('#time02').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        $('#time02').datepicker("hide");
        if($("#time02").val()){
            echart_A03_port(Date.parse(new Date($("#time02").val()))/1000);
        }else{
            $("#searchBox03").empty();
        }
    });

    $("#school01").change(function () {
        echart_A03_port(Date.parse(new Date($("#time02").val()))/1000);
    });

    $(window).resize(function () {
        echart_A02("searchBox01",jsonAll01);
        echart_A03("searchBox03",jsonAll03);
    });
};

// 获取园区ID
function GetSchoolIds_port() {
    var data={
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.GetSchoolIds,param,GetSchoolIds_callback);
    initAjax(httpUrl.GetSchoolJYIds,param,GetSchoolJYIds_callback);
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
            echart_A02_port(Date.parse(new Date($("#time01").val()))/1000);//echart02初始化
        }
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// echart_A02接口
function echart_A02_port(time) {
    var data={
            schoolId:$("#school").val(),
            useruuid:user.userUuid,
            time:(time-28800).toString()
        };
    var param={
            params:JSON.stringify(data)
    };

    initAjax(httpUrl.getCourseAllTJ,param,echart_A02_callback);
};
function echart_A02_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        jsonAll01=data;
        echart_A02("searchBox01",data);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        echart_A02("searchBox01",data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A02(id,json){
    var myChart = echarts.init(document.getElementById(id));
    var res={
            legend:[],
            series:[]
    };
    for(var i=0;i<json.datas.length;i++){
        res.legend.push(json.datas[i].name);
    };
    
    var color=colorfn(1);
    for(var i=0;i<json.datas.length;i++){
        var per01={
                name:json.datas[i].name,
                type:'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {normal: {color:color[i], label:{show:false}}},
                data:json.datas[i].data
        };
        res.series.push(per01);
    };

    var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:res.legend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: json.time
            },
            yAxis: {
                type: 'value'
            },
            series: res.series
        };

    myChart.setOption(option);
      
};


function GetSchoolJYIds_callback(res) {
    if(res.code==200){
        if(res.data =="[]"){
            $("#modal03").modal("show");
        }else{
            var data=JSON.parse(res.data);
            var data01={data:data};
            var html=template("school_script",data01);
            $("#school01").empty().append(html);
            $("#time02").val(new Date().Format("yyyy-MM-dd"));
            echart_A03_port(Date.parse(new Date($("#time02").val()))/1000);//echart02初始化
        }
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// echart_A02接口
function echart_A03_port(time) {
    var data={
            schoolId:$("#school01").val(),
            useruuid:user.userUuid,
            time:(time-28800).toString()
        };
    var param={
            params:JSON.stringify(data)
    };

    initAjax(httpUrl.getCourseAllTJ,param,echart_A03_callback);
};
function echart_A03_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        jsonAll03=data;
        echart_A03("searchBox03",data);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        echart_A03("searchBox03",data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function colorfn(trans) {
    var color=['rgba(42,159,194,'+trans+')','rgba(39,107,182,'+trans+')','rgba(104,73,203,'+trans+')','rgba(198,91,207,'+trans+')','rgba(199,83,96,'+trans+')','rgba(203,140,89,'+trans+')'];
    return color;
}
function echart_A03(id,json){
    var myChart = echarts.init(document.getElementById(id));
    var res={
            legend:[],
            series:[]
    };
    for(var i=0;i<json.datas.length;i++){
        res.legend.push(json.datas[i].name);
    };
    
    var color=colorfn(1);
    for(var i=0;i<json.datas.length;i++){
        var per01={
                name:json.datas[i].name,
                type:'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {normal: {color:color[i], label:{show:false}}},
                data:json.datas[i].data
        };
        res.series.push(per01);
    };

    var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:res.legend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: json.time
            },
            yAxis: {
                type: 'value'
            },
            series: res.series
        };

    myChart.setOption(option);
      
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
        $("#user >.userName").text(data.name);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading

        user.userUuid=data.userUUID;
        user.typeID=data.typeID;
        GetSchoolIds_port();
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

