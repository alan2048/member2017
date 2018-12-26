var jsonAll01,jsonAll02;
$(function () {
    init();
});
function init() {
    menu();

    // 月份选择初始化
    var d=new Date();
    var month={arr:[1,2,3,4,5,6,7,8,9,10,11,12]};
    var htmlMonth=template("month_script",month);
    $(".month").append(htmlMonth).find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);

    // 年份选择初始化
    var year={arr:[d.getFullYear()+1]};
    for(var i=d.getFullYear();i>2015;i--){
        year.arr.push(i)
    };
    year.arr.reverse();
    var yearMonth=template("year_script",year);
    $(".year").append(yearMonth).find("option[value="+d.getFullYear()+"]").prop("selected",true);

    echart_A01_port();
    $("#year01,#month01").change(function () {
        echart_A01_port();
    });
    echart_A02_port();
    $("#year02,#month02").change(function () {
        echart_A02_port();
    });

    $("#buttonBox01").on("click",".export",function () {
        var data={
                year:$("#year01").val(),
                month:$("#month01").val()
        };
        window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url="+httpUrl.attendExportLeaveStat+"&params="+JSON.stringify(data));
    });

    $("#buttonBox02").on("click",".export",function () {
        var data={
                year:$("#year02").val(),
                month:$("#month02").val()
        };
        window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url="+httpUrl.attendExportCheckingStat+"&params="+JSON.stringify(data));
    });

    $(window).resize(function () {
        echart_A01("searchBox01",jsonAll01);
        echart_A02("searchBox02",jsonAll02);
    });
};


// echart_A01接口
function echart_A01_port() {
    var data={
            year:$("#year01").val(),
            month:$("#month01").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendLeaveStat,param,echart_A01_callback);
};
function echart_A01_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].durationBJ=Number(data[i].durationBJ.replace(/小时/, ""));
            data[i].durationGJ=Number(data[i].durationGJ.replace(/小时/, ""));
            data[i].durationQT=Number(data[i].durationQT.replace(/小时/, ""));
            data[i].durationSHJ=Number(data[i].durationSHJ.replace(/小时/, ""));
            data[i].durationTXJ=Number(data[i].durationTXJ.replace(/小时/, ""));
            data[i].total=Number(data[i].total.replace(/小时/, ""));
        };
        var json={
                xAxis:[],
                series:[],
                legend:["事假","病假","公假","调休","其他"]
        };
        for(var i=0;i<data.length;i++){
            json.xAxis.push(data[i].userName);
        };

        for(var i=0;i<json.legend.length;i++){
            var obj={
                name:json.legend[i],
                type:'bar',
                stack: "class",
                data:[]
            };

            switch (json.legend[i]){
                case "事假":
                    for(var j=0;j<data.length;j++){
                        obj.data.push(data[j].durationSHJ)
                    };
                    break;
                case "病假":
                    for(var j=0;j<data.length;j++){
                        obj.data.push(data[j].durationBJ)
                    };
                    break;
                case "公假":
                    for(var j=0;j<data.length;j++){
                        obj.data.push(data[j].durationGJ)
                    };
                    break;
                case "调休":
                    for(var j=0;j<data.length;j++){
                        obj.data.push(data[j].durationTXJ)
                    };
                    break;
                case "其他":
                    for(var j=0;j<data.length;j++){
                        obj.data.push(data[j].durationQT)
                    };
                    break;
            };
            json.series.push(obj);
        };
        jsonAll01=json;
        echart_A01("searchBox01",json);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A01(id,json){
    var myChart = echarts.init(document.getElementById(id));

    var option = {
            title:{
                text:"教师请假统计",
                left:"center",
                textStyle: {
                    color: '#656666'  
                }
            },
            color: ['#c2eb69','#f8e264','#efb161','#5cdee1','#e8c6fc'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var curName=params[0].name;

                    var total=0;
                    var html01="";
                    for(var i=0;i<params.length;i++){
                        total +=params[i].data;
                        html01 +="<span class='hoverBtn' style='background-color:"+params[i].color+"'></span>"+params[i].seriesName+":"+params[i].data+"小时<br>";
                    }

                    var html=curName+"<br>"+html01+"请假总时长:"+total+"小时<br>"
                    return html;
                }
            },
            legend: {
                data:json.legend,
                bottom:"bottom"
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : json.xAxis,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        interval:0,
                        rotate: -60
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : json.series
        };

    myChart.setOption(option); 
};



// echart_A01接口
function echart_A02_port() {
    var data={
            year:$("#year02").val(),
            month:$("#month02").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendCheckingStat,param,echart_A02_callback);
};
function echart_A02_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var json={
                xAxis:[],
                series:[]
        };
        for(var i=0;i<data.length;i++){
            data[i].count=Number(data[i].dayCount.replace(/天/, ""));
            json.xAxis.push(data[i].userName);
            json.series.push(data[i].count);
        };
        jsonAll02=json;
        echart_A02("searchBox02",json);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        console.log(data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A02(id,json){
    var myChart = echarts.init(document.getElementById(id));

    var option = {
            title:{
                text:"个人打卡统计",
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            color: ['#c2eb69'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: "{b}<br/><span class='hoverBtn'></span>{a}: {c}天"
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : json.xAxis,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        interval:0,
                        rotate: -60
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'打卡天数',
                    type:'bar',
                    barWidth: '60%',
                    data:json.series,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    }
                }
            ]
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
        if($(this).attr("target")=="_blank"){
            $(this).removeClass("active");
        };
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
        basicButton_port();
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
        $("#buttonBox01,#buttonBox02").append(html);
    };
};