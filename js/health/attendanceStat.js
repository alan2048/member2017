var jsonAll01,jsonAll02,jsonAll03,jsonAll04;
$(function () {
    init();
});
function init() {
    menu();
    $("#year01,#month01,#day01").change(function () {
        changeDay($(this));
        echart_A01_port();
    });

    $("#searchBtn01").click(function () {
        echart_A01_port();
    });

    $("#year03,#month03,#teacherClass").change(function () {
        echart_A03_port();
    });
    $("#searchBtn03").click(function () {
        echart_A03_port();
    });

    $("#year04,#month04,#day04").change(function () {
        changeDay($(this));
        echart_A04_port();
    });
    $("#teacherClass04").change(function () {
        echart_A04_port();
    });
    $("#searchBtn04").click(function () {
        echart_A04_port();
    });

    $(window).resize(function () {
        echart_A01("searchBox01",jsonAll01);
        echart_A02("searchBox02",jsonAll01);
        echart_A03("searchBox03",jsonAll03);
        echart_A04("searchBox04",jsonAll04);
    });

    $("#buttonBox01").on("click",".export",function () {
        var data={
                year:$("#year01").val(),
                month:$("#month01").val()
        };
        window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url="+httpUrl.attendExportClassExcel+"&params="+JSON.stringify(data));
    });

    $("#buttonBox03").on("click",".export",function () {
        var data={
                year:$("#year03").val(),
                month:$("#month03").val(),
                classUUID:$("#teacherClass").val(),
                className:$("#teacherClass >option:selected").text()
        };
        window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url="+httpUrl.attendExportPersonalExcel+"&params="+JSON.stringify(data));
    });
};


// 日期随月份动态化
function changeDay(_self) {
    if(!$(_self).hasClass('day')){
        var maxDate=new Date($(_self).parents('.search').find('.year').val(),$(_self).parents('.search').find('.month').val(),0).getDate();
        var day={arr:[]};
        for(var i=0;i<maxDate;i++){
            var obj={
                name:function () {
                    if(i<9){
                        return "0"+(i+1).toString();
                    }else{
                        return (i+1).toString();
                    } 
                }(),
                val:i+1
            };
            day.arr.push(obj)
        };
        var htmlDay=template('day_script',day);
        var chooseDay=$(_self).parents('.search').find('.day').val()
        $(_self).parents('.search').find('.day').empty().append(htmlDay).find("option[value="+chooseDay+"]").prop("selected",true);
    }
};

// 获得当前用户所在班级列表
function myClassInfo_port() {
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

        // 日期初始化
        var maxDate=new Date(d.getFullYear(),(d.getMonth()+1),0).getDate();
        var day={arr:[]};
        for(var i=0;i<maxDate;i++){
            var obj={
                    name:function () {
                        if(i<9){
                            return "0"+(i+1).toString();
                        }else{
                            return (i+1).toString();
                        } 
                    }(),
                    val:i+1
            };
            day.arr.push(obj)
        };
        var htmlDay=template('day_script',day);
        $(".day").append(htmlDay).find("option[value="+d.getDate()+"]").prop("selected",true);

        echart_A01_port();

        basicMyClassInfo_port();// 班级select初始化
};


// echart_A01接口
function echart_A01_port() {
    var data={
            year:$("#year01").val(),
            month:$("#month01").val(),
            day:$("#day01").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendClassStat,param,echart_A01_callback);
};
function echart_A01_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var json={
                xAxis:[],
                series:[],
                allSeris:[],
                arr:data.classStatList,
                data:data
        };
        for(var i=0;i<data.classStatList.length;i++){
            json.xAxis.push(data.classStatList[i].className);
            json.series.push(data.classStatList[i].attendCount);
            json.allSeris.push(data.classStatList[i].childCount);
        };
        jsonAll01=json;
        echart_A01("searchBox01",json);
        echart_A02("searchBox02",json);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        console.log(data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A01(id,json){
    var myChart = echarts.init(document.getElementById(id));
    myChart.resize();
    var option = {
            title:{
                text:"班级出勤人数统计",
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            color: ['#c2eb69'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    shadowStyle:{
                        color:'rgba(180, 180, 180, 0.1)'
                    },
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var curName=params[0].name;
                    var cur={};
                    for(var i=0;i<json.arr.length;i++){
                        if(json.arr[i].className == curName){
                            cur=json.arr[i];
                        }
                    };
                    var html="<span class='hoverBtn'></span>总人数："+cur.childCount+"人 <br>"+
                            "<span class='hoverBtn'></span>请假人数："+cur.leaveCount+"人 <br>"+
                            "<span class='hoverBtn'></span>出勤率："+cur.attendRate
                    return html;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '5%',
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
                },{
                    type : 'category',
                    data : json.xAxis,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    splitLine: {
                        show: false
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
                    name: '总人数',
                    type: 'bar',
                    xAxisIndex: 1, 
                    itemStyle: {
                        normal: {
                            show: false,
                            color:'rgba(194, 235, 105, 0.5)',
                            barBorderRadius: 20,
                            borderWidth: 0,
                            borderColor: '#333',
                        }
                    },
                    barWidth: '60%',
                    data: json.allSeris
                }, {
                    name: '出勤人数',
                    type: 'bar',
                    barWidth: '60%',
                    itemStyle: {
                    normal: {
                        show: true,
                        color:'#c2eb69',
                        barBorderRadius: 20,
                        borderWidth: 0,
                        borderColor: '#333',
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            textStyle: {
                                color: '#656666',
                                fontSize: '16'
                            }
                        }
                    },
                    barGap: '100%',
                    data: json.series
                }
            ]
        };
    myChart.setOption(option); 
};
function echart_A02(id,data){
    var json=data.data;
    var myChart = echarts.init(document.getElementById(id));
    myChart.resize();
    var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                shadowBlur: 0,
                shadowColor: 'rgba(256, 256, 256, 0.5)',
            }
    };

    var placeHolderStyle = {
            normal: {
                color: '#e2e5e5', // 未完成的圆环的颜色
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            },
            emphasis: {
                color: '#e2e5e5' // 未完成的圆环的颜色
            }
        };

    var option = {
            title: {
                text:'全园出勤统计',
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            tooltip: {
                show: false,
            },
            toolbox: {
                show: false,
            },
            series: [{
                name: 'Pie1',
                type: 'pie',
                clockWise: false,
                radius: [120, 130],
                itemStyle: dataStyle,
                hoverAnimation: false,
                center: ['25%', '50%'],
                data: [{
                    value: json.totalAttendCount,
                    label: {
                        normal: {
                            formatter: json.totalAttendCount+"\n\n总人数："+json.totalChildCount,
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'normal',
                                color: '#c1ec69'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#c1ec69',
                            shadowColor: '#c1ec69',
                            shadowBlur: 10
                        }
                    }
                }, {
                    value: json.totalChildCount-json.totalAttendCount,
                    name: 'invisible',
                    itemStyle: placeHolderStyle,
                }]
            }, {
                name: 'Pie1',
                type: 'pie',
                clockWise: false,
                radius: [120, 130],
                itemStyle: dataStyle,
                hoverAnimation: false,
                center: ['75%', '50%'],
                data: [{
                    value: json.totalAttendCount,
                    label: {
                        normal: {
                            formatter: json.totalAttendRate,
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'normal',
                                color: '#5cdfe2'
                            }
                        }
                    },
                itemStyle: {
                    normal: {
                        color: '#5cdfe2',
                        shadowColor: '#5cdfe2',
                        shadowBlur: 10
                    }
                }
            }, {
                value: json.totalChildCount-json.totalAttendCount,
                name: 'invisible',
                itemStyle: placeHolderStyle,
            }]
        }]
    };

    myChart.setOption(option); 
};

// echart_A03接口
function echart_A03_port() {
    var data={
            year:$("#year03").val(),
            month:$("#month03").val(),
            classUUID:$("#teacherClass").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendPersonalStat,param,echart_A03_callback);
};
function echart_A03_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var json={
                xAxis:[],
                series:[],
                allSeris:[],
                arr:data
        };
        for(var i=0;i<data.length;i++){
            json.xAxis.push(data[i].childName);
            json.series.push(data[i].actualAttendDays);
            json.allSeris.push(data[i].attendDays);
        };

        jsonAll03=json;
        echart_A03("searchBox03",json);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        console.log(data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A03(id,json){
    var myChart = echarts.init(document.getElementById(id));
    myChart.resize();
    var option = {
            title:{
                text:"个人出勤统计",
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            color: ['#f7e463'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    shadowStyle:{
                        color:'rgba(180, 180, 180, 0.1)'
                    },
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var curName=params[0].name;
                    var cur={};
                    for(var i=0;i<json.arr.length;i++){
                        if(json.arr[i].childName == curName){
                            cur=json.arr[i];
                        }
                    };
                    var html=cur.childName+
                            "<br><span class='hoverBtn01'></span>应到天数："+cur.attendDays+"天 <br>"+
                            "<span class='hoverBtn01'></span>请假天数："+cur.leaveDays+"天 <br>"+
                            "<span class='hoverBtn01'></span>出勤率："+cur.attendRate
                    return html;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '5%',
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
                },{
                    type : 'category',
                    data : json.xAxis,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    splitLine: {
                        show: false
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
                    name: '总人数',
                    type: 'bar',
                    xAxisIndex: 1, 
                    itemStyle: {
                        normal: {
                            show: false,
                            color:'rgba(247,228,99,0.5)',
                            barBorderRadius: 20,
                            borderWidth: 0,
                            borderColor: '#333',
                        }
                    },
                    barWidth: '50%',
                    data: json.allSeris
                }, {
                    name: '出勤人数',
                    type: 'bar',
                    barWidth: '50%',
                    itemStyle: {
                    normal: {
                        show: true,
                        color:'#f7e463',
                        barBorderRadius: 20,
                        borderWidth: 0,
                        borderColor: '#333',
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            textStyle: {
                                color: '#656666',
                                fontSize: '16'
                            }
                        }
                    },
                    barGap: '100%',
                    data: json.series
                }
            ]
        };

    myChart.setOption(option); 
};


// echart_A04接口
function echart_A04_port() {
    var data={
            year:$("#year04").val(),
            month:$("#month04").val(),
            day:$("#day04").val(),
            classUUID:$("#teacherClass04").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendSickLeaveStat,param,echart_A04_callback);
};
function echart_A04_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        if(data.length ==0){
            data.push({num:"0",leaveType2:""})
        };
        var json={
                xAxis:[],
                series:[],
                allSeris:[],
                arr:data
        };
        for(var i=0;i<data.length;i++){
            json.xAxis.push(data[i].leaveType2);
            json.series.push(data[i].num);
        };

        jsonAll04=json;
        echart_A04("searchBox04",json);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        console.log(data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A04(id,json){
    var myChart = echarts.init(document.getElementById(id));
    myChart.resize();
    var option = {
            title:{
                text:"病假事由统计",
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            color: ['#f7e463'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    shadowStyle:{
                        color:'rgba(180, 180, 180, 0.1)'
                    },
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '5%',
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
                    name: '人数',
                    type: 'bar',
                    barWidth: '50%',
                    itemStyle: {
                    normal: {
                        show: true,
                        color:'#f8acaa',
                        barBorderRadius: 20,
                        borderWidth: 0,
                        borderColor: '#333',
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            textStyle: {
                                color: '#656666',
                                fontSize: '16'
                            }
                        }
                    },
                    barGap: '100%',
                    data: json.series
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
        myClassInfo_port();
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
        $("#teacherClass,#teacherClass04").append(html);

        echart_A03_port();        
        echart_A04_port();        
    };
};