var jsonAll01,jsonAll02,jsonAll03,jsonAll04;
$(function () {
    init();
});
function init() {
    menu();
    $("#classMember").change(function () {
        echart_A01_port(); 
    });

    $("#searchBtn01").click(function () {
        echart_A01_port(); 
    });

    $(window).resize(function () {
        echart_A01("searchBox01",jsonAll01);
        echart_A02("searchBox02",jsonAll02);
        echart_A03("searchBox03",jsonAll03);
    });
};

// echart_A01接口
function echart_A01_port() {
    var data={
            childUUID:$("#classMember").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthGraph,param,echart_A01_callback);
};
function echart_A01_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        var data01=data.w2h;
        var json01={
                series:{
                    p3:data01.p3,
                    p10:data01.p10,
                    p50:data01.p50,
                    p80:data01.p80,
                    p97:data01.p97,
                    graphWH:[]
                },
                graphWH:data01.graphWH,
                sex:data01.sex[0],
                curName:$("#classMember >option:checked").text()
        };
        if(data01.graphWH){
            for(var i=0;i<data01.graphWH.length;i++){
                var arr=[];
                arr[0]=data01.graphWH[i].height;
                arr[1]=data01.graphWH[i].weight;
                json01.series.graphWH.push(arr);
            };
        };

        jsonAll01=json01;
        echart_A01("searchBox01",json01);


        var data02=data.h2y;
        var json02={
                series:{
                    p3:data02.p3,
                    p10:data02.p10,
                    p50:data02.p50,
                    p80:data02.p80,
                    p97:data02.p97,
                    graphHY:[]
                },
                graphHY:data02.graphHY,
                sex:data02.sex[0],
                curName:$("#classMember >option:checked").text()
        };
        if(data02.graphHY){
            for(var i=0;i<data02.graphHY.length;i++){
                var arr=[];
                arr[0]=data02.graphHY[i].computeAge;
                arr[1]=data02.graphHY[i].height;
                json02.series.graphHY.push(arr);
            };
        };

        jsonAll02=json02;
        echart_A02("searchBox02",json02);


        var data03=data.w2y;
        var json03={
                series:{
                    p3:data03.p3,
                    p10:data03.p10,
                    p50:data03.p50,
                    p80:data03.p80,
                    p97:data03.p97,
                    graphWY:[]
                },
                graphWY:data03.graphWY,
                sex:data03.sex[0],
                curName:$("#classMember >option:checked").text()
        };
        if(data03.graphWY){
            for(var i=0;i<data03.graphWY.length;i++){
                var arr=[];
                arr[0]=data03.graphWY[i].computeAge;
                arr[1]=data03.graphWY[i].weight;
                json03.series.graphWY.push(arr);
            };
        };

        jsonAll03=json03;
        echart_A03("searchBox03",json03);

    }else if(res.code==500){
        var data=JSON.parse(res.data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A01(id,json){
    var myChart = echarts.init(document.getElementById(id));
    myChart.resize();

    var symbolSize = 0;
    var option = {
            title:{
                text:"按身高测体重（W/H）"+json.sex+"童",
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            color: ['#e3e5e6','rgba(224,92,92,0.4)','#e3e5e6','rgba(224,92,92,0.4)','#e3e5e6','#9cd815'],
            legend: {
                bottom: '0',
                data: ['P3', 'P10','P50','P80','P97',json.curName]
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    shadowStyle:{
                        color:'rgba(180, 180, 180, 0.1)'
                    },
                    type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var curObj;
                    for(var i=0;i<params.length;i++){
                        if(params[i].color=="#9cd815"){
                            curObj=params[i];
                        };
                    };
                    if(curObj){
                        var cur={};
                        for(var i=0;i<json.graphWH.length;i++){
                            if(json.graphWH[i].height == curObj.axisValue){
                                cur=json.graphWH[i];
                            }
                        };
                        var html="<span class='hoverBtn'></span>日期："+cur.examDate+" <br>"+
                            "<span class='hoverBtn'></span>年龄："+cur.userAge+" <br>"+
                            "<span class='hoverBtn'></span>身高："+cur.height+"cm <br>"+
                            "<span class='hoverBtn'></span>体重："+cur.weight+"KG <br>"+
                            "<span class='hoverBtn'></span>W/H："+cur.h2wPvalue+" <br>"+
                            "<span class='hoverBtn "+cur.color+"'></span>"+"<i class='hoverItext "+cur.color+"'>评价："+cur.evaluate+"</i>"
                        return html;
                    };
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '8%',
                containLabel: true
            },
            xAxis : [
                {   
                    min: 70,
                    max: 125,
                    type: 'value',
                    axisLine: {onZero: false},
                    name:'身高（厘米）',
                    axisTick: {
                        alignWithLabel: true
                    },
                    interval:2
                }
            ],
            yAxis : [
                {   
                    min: 8,
                    max: 35,
                    type: 'value',
                    axisLine: {onZero: false},
                    name:'体重（公斤）',
                    interval:2
                }
            ],
            series : [
                {
                    name: 'P3',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p3
                },
                {
                    name: 'P10',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p10
                },
                {
                    name: 'P50',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p50
                },
                {
                    name: 'P80',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p80
                },
                {
                    name: 'P97',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p97
                },
                {
                    name: json.curName,
                    type: 'line',
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                width:3,
                                type:'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    symbol: 'circle',
                    smooth: true,
                    symbolSize: 12,
                    data: json.series.graphWH
                }
            ]
        };
    myChart.setOption(option); 
};
function echart_A02(id,json){
    var myChart = echarts.init(document.getElementById(id));
    myChart.resize();

    var symbolSize = 0;
    var option = {
            title:{
                text:"按年龄测身高(H/Y)"+json.sex+"童",
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            color: ['#e3e5e6','rgba(224,92,92,0.4)','#e3e5e6','rgba(224,92,92,0.4)','#e3e5e6','#9cd815'],
            legend: {
                bottom: '0',
                data: ['P3', 'P10','P50','P80','P97',json.curName]
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    shadowStyle:{
                        color:'rgba(180, 180, 180, 0.1)'
                    },
                    type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var curObj;
                    for(var i=0;i<params.length;i++){
                        if(params[i].color=="#9cd815"){
                            curObj=params[i];
                        };
                    };
                    if(curObj){
                        var cur={};
                        for(var i=0;i<json.graphHY.length;i++){
                            if(json.graphHY[i].computeAge == curObj.axisValue){
                                cur=json.graphHY[i];
                            }
                        };
                        var html="<span class='hoverBtn'></span>日期："+cur.examDate+" <br>"+
                            "<span class='hoverBtn'></span>年龄："+cur.viewAge+" <br>"+
                            "<span class='hoverBtn'></span>身高："+cur.height+"cm <br>"+
                            "<span class='hoverBtn'></span>体重："+cur.weight+"KG <br>"+
                            "<span class='hoverBtn'></span>H/Y："+cur.h2yPvalue+" <br>"+
                            "<span class='hoverBtn "+cur.color+"'></span>"+"<i class='hoverItext "+cur.color+"'>评价："+cur.evaluate+"</i>"
                        return html;
                    };
                }
            },
            grid: {
                left: '5%',
                right: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis : [
                {   
                    min: 3,
                    max: 7,
                    type: 'value',
                    axisLine: {onZero: false},
                    name:'年龄（岁）',
                    axisTick: {
                        alignWithLabel: true
                    },
                    interval:0.5,
                    axisLabel:{
                        interval:"auto"
                    }
                }
            ],
            yAxis : [
                {   
                    min: 90,
                    max: 140,
                    type: 'value',
                    axisLine: {onZero: false},
                    name:'身高（厘米）',
                    interval:2,
                    axisLabel:{
                        interval:"auto"
                    }
                }
            ],
            series : [
                {
                    name: 'P3',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p3
                },
                {
                    name: 'P10',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p10
                },
                {
                    name: 'P50',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p50
                },
                {
                    name: 'P80',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p80
                },
                {
                    name: 'P97',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p97
                },
                {
                    name: json.curName,
                    type: 'line',
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                width:3,
                                type:'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    symbol: 'circle',
                    smooth: true,
                    symbolSize: 12,
                    data: json.series.graphHY
                }
            ]
        };
    myChart.setOption(option); 
};
function echart_A03(id,json){
    var myChart = echarts.init(document.getElementById(id));
    myChart.resize();

    var symbolSize = 0;
    var option = {
            title:{
                text:"按年龄测体重(W/Y)"+json.sex+"童",
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            color: ['#e3e5e6','rgba(224,92,92,0.4)','#e3e5e6','rgba(224,92,92,0.4)','#e3e5e6','#9cd815'],
            legend: {
                bottom: '0',
                data: ['P3', 'P10','P50','P80','P97',json.curName]
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    shadowStyle:{
                        color:'rgba(180, 180, 180, 0.1)'
                    },
                    type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var curObj;
                    for(var i=0;i<params.length;i++){
                        if(params[i].color=="#9cd815"){
                            curObj=params[i];
                        };
                    };
                    if(curObj){
                        var cur={};
                        for(var i=0;i<json.graphWY.length;i++){
                            if(json.graphWY[i].computeAge == curObj.axisValue){
                                cur=json.graphWY[i];
                            }
                        };
                        var html="<span class='hoverBtn'></span>日期："+cur.examDate+" <br>"+
                            "<span class='hoverBtn'></span>年龄："+cur.viewAge+" <br>"+
                            "<span class='hoverBtn'></span>身高："+cur.height+"cm <br>"+
                            "<span class='hoverBtn'></span>体重："+cur.weight+"KG <br>"+
                            "<span class='hoverBtn'></span>W/Y："+cur.W2yPvalue+" <br>"+
                            "<span class='hoverBtn "+cur.color+"'></span>"+"<i class='hoverItext "+cur.color+"'>评价："+cur.evaluate+"</i>"
                        return html;
                    };
                }
            },
            grid: {
                left: '5%',
                right: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis : [
                {   
                    min: 3,
                    max: 7,
                    type: 'value',
                    axisLine: {onZero: false},
                    name:'年龄（岁）',
                    axisTick: {
                        alignWithLabel: true
                    },
                    interval:0.5
                }
            ],
            yAxis : [
                {   
                    min: 12,
                    max: 35,
                    type: 'value',
                    axisLine: {onZero: false},
                    name:'体重（公斤）',
                    interval:2
                }
            ],
            series : [
                {
                    name: 'P3',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p3
                },
                {
                    name: 'P10',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p10
                },
                {
                    name: 'P50',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p50
                },
                {
                    name: 'P80',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p80
                },
                {
                    name: 'P97',
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: json.series.p97
                },
                {
                    name: json.curName,
                    type: 'line',
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                width:3,
                                type:'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    symbol: 'circle',
                    smooth: true,
                    symbolSize: 12,
                    data: json.series.graphWY
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
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
        basicMyClassInfo_port();// 班级select初始化
        // basicButton_port();
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
        $("#buttonBox01,#buttonBox03").append(html);
    };
};

// 获得教职工所在班级列表
function basicMyClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicMyClassInfo,param,basicMyClassInfo_callback);
};
function basicMyClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").append(html);

        // 默认第一班级的所有成员
        if(data.arr.length>0){
            getClassStudentInfo_port(data.arr[0].classUUID);
        };

        // 切换班级时成员接口切换
        $("#teacherClass").change(function () {
            var classId=$(this).val();
            getClassStudentInfo_port(classId);
        });
    };
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
        var html=template("classMember_script",{arr:data});
        $("#classMember").empty().append(html);

        echart_A01_port();        
    }else{
        // console.log('请求错误，返回code非200');
    }
};