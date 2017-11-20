var jsonAll01,jsonAll02,jsonAll03;
$(function () {
    init();
});
function init() {
    menu();
    $(window).resize(function () {
        echart_A01("searchBox01",jsonAll01);
        echart_A02("searchBox02",jsonAll02);
    });

    // echart_A01接口函数
    $("#userClass01,#month01,#year01").change(function () {
        echart_A01_port();
    });

    $("#userClass02,#month02,#year02,#course").change(function () {
        echart_A02_port();
    });

    $("#userClass03,#year03,#month03").change(function () {
        echart_A03_port();
    });

    $("#userClass04,#course04,#year04,#month04").change(function () {
        echart_A04_port();
    });
};

// 获得当前用户所在班级列表
function yearMonthInit() {
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
        getUserClassInfo_port();
};

// echart_A01接口
function echart_A01_port() {
    var data={
            gradeId:$("#userClass01").val(),
            useruuid:user.useruuid,
            time: $("#year01").val() +"-"+$("#month01").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getClassesAbilibySimple,param,echart_A01_callback);
};
function echart_A01_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        jsonAll01=data;
        echart_A01("searchBox01",data);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        jsonAll01=data;
        echart_A01("searchBox01",data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A01(id,json,curName){
    var myChart = echarts.init(document.getElementById(id));

    var data={
            name:curName,
            indicator:[],
            legend:json.ExtraInfo,
            value:json.Val
    };

    for(var i=0;i<json.Name.length;i++){
        var aa={};
        aa.name=json.Name[i];
        aa.max=json.ValMax[i];
        data.indicator.push(aa);
    };

    var option={
            backgroundColor: '#fff',
            title: {
                text: '领域发展水平—'+data.name,
                left: 'center',
                textStyle: {
                    color: '#525252',
                    fontSize: 20
                },
                subtextStyle: {
                    color: '#525252',
                    fontSize: 16
                }
            },
            legend: {
                bottom: 5,
                icon:"roundRect",
                data: data.legend,
                itemGap: 20,
                textStyle: {
                    color: '#525252',
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor : 'rgba(94,94,94,0.6)'
            },
            radar: {
                indicator: data.indicator,
                shape: 'circle',
                splitNumber: 5,
                name: {
                    textStyle: {
                        color: '#525252',
                        fontSize:16
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: [
                            'rgba(52, 52, 52, 0.1)', 'rgba(52, 52, 52, 0.2)',
                            'rgba(52, 52, 52, 0.4)', 'rgba(52, 52, 52, 0.6)',
                            'rgba(52, 52, 52, 0.8)', 'rgba(52, 52, 52, 1)'
                        ].reverse()
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(52, 52, 52, 0.5)'
                    }
                }
            },
            series: [
                {
                    name: data.legend[0],
                    type: 'radar',
                    data: [
                        {
                            value: data.value[0],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }

                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#beec60'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.3
                        }
                    }
                },
                {
                    name: data.legend[1],
                    type: 'radar',
                    data: [
                        {
                            value: data.value[1],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#fedf68'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.3
                        }
                    }
                },
                {
                    name: data.legend[2],
                    type: 'radar',
                    data: [
                        {
                            value: data.value[2],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#f8a7a6'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.3
                        }
                    }
                }
            ]
        };

    myChart.setOption(option);
};
function colorfn(trans) {
    var color=['rgba(42,159,194,'+trans+')','rgba(39,107,182,'+trans+')','rgba(104,73,203,'+trans+')','rgba(198,91,207,'+trans+')','rgba(199,83,96,'+trans+')','rgba(203,140,89,'+trans+')','rgba(42,159,194,'+trans+')','rgba(39,107,182,'+trans+')','rgba(104,73,203,'+trans+')','rgba(198,91,207,'+trans+')','rgba(199,83,96,'+trans+')','rgba(203,140,89,'+trans+')'];
    return color;
}
function echart_A01(id,json){
    var myChart = echarts.init(document.getElementById(id));
    var res={
            legend:[],
            series:[]
    };
    for(var i=0;i<json.length;i++){
        res.legend.push(json[i].name);
    };
    res.xAxis=json[0].detail.BJNames;
    
    var color=colorfn(1);
    for(var i=0;i<json.length;i++){
        var per01={
                name:json[i].name,
                type:'bar',
                // barWidth: 0.0001,
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {normal: {color:color[i], label:{show:false}}},
                data:json[i].detail.BJVals
        };
        res.series.push(per01);
    };

    var option={
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'4%',
                left: '5%',
                right: '5%',
                bottom: '8%',
                containLabel: true
            },
            legend: {
                x:'center',
                y:'bottom',
                selectedMode:'single',
                // selected:res.selected,// 子项初始化series
                data:res.legend
            },
            xAxis : [
                {
                    type : 'category',
                    data : res.xAxis,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        interval:0
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : res.series
    };

    myChart.setOption(option);
      
};

















// echart_A03接口  儿童课程能力统计
function echart_A02_port() {
    var data={
            courseId:$("#course").val(),
            gradeId:$("#userClass02").val(),
            useruuid:user.useruuid,
            time: $("#year02").val() +"-"+$("#month02").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getCourseAbilibySimple,param,echart_A02_callback);
};
function echart_A02_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        jsonAll02=data;
        echart_A02("searchBox02",data);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        jsonAll02=data;
        echart_A02("searchBox02",data);
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
    for(var i=0;i<json.length;i++){
        res.legend.push(json[i].name);
    };
    res.xAxis=json[0].detail.BJNames;
    
    var color=colorfn(1);
    for(var i=0;i<json.length;i++){
        var per01={
                name:json[i].name,
                type:'bar',
                // barWidth: 0.0001,
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {normal: {color:color[i], label:{show:false}}},
                data:json[i].detail.BJVals
        };
        res.series.push(per01);
    };

    var option={
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'4%',
                left: '5%',
                right: '5%',
                bottom: '8%',
                containLabel: true
            },
            legend: {
                x:'center',
                y:'bottom',
                selectedMode:'single',
                // selected:res.selected,// 子项初始化series
                data:res.legend
            },
            xAxis : [
                {
                    type : 'category',
                    data : res.xAxis,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        interval:0
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : res.series
    };

    myChart.setOption(option);
      
};



// 获取用户班级信息接口
function getUserClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data)
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenMyClassInfo,param,getUserClassInfo_callback);
};
function getUserClassInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("userClass_script",{data:data});
        $("#userClass03,#userClass04").append(html);

        echart_A03_port();
        getPersonCourse_port(); // 获取课程列表
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 获取个人关联课程接口
function getPersonCourse_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchCourseList,param,getPersonCourse_callback);
};
function getPersonCourse_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("course_script",{data:data});
        $("#course,#course04").empty().append(html);

        echart_A02_port();
        echart_A04_port();
    }else{
        // console.log('请求错误，返回code非200');
    }
};

function echart_A03_port() {
    var data={
            classId:$("#userClass03").val(),
            useruuid:user.useruuid,
            time: $("#year03").val() +"-"+$("#month03").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getClassAbilibySimple,param,echart_A03_callback);
};
function echart_A03_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("searchBox03_script",{data:data});
        $("#searchBox03").empty().append(html);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
    }else{
        $("#searchBox03").empty();
        toastTip("提示",res.info);
        // console.log('请求错误，返回code非200');
    }
};

function echart_A04_port() {
    var data={
            classId:$("#userClass04").val(),
            courseId:$("#course04").val(),
            useruuid:user.useruuid,
            time: $("#year04").val() +"-"+$("#month04").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getCourseAbilibyCount,param,echart_A04_callback);
};
function echart_A04_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("searchBox03_script",{data:data});
        $("#searchBox04").empty().append(html);
        $(".classAreaTitle").text($("#course04 option:selected").text());
    }else if(res.code==500){
        var data=JSON.parse(res.data);
    }else{
        $("#searchBox04").empty();
        toastTip("提示",res.info);
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
        user.useruuid=data.userUUID;
        data.path_img=httpUrl.path_img;
        $("#user >.userName").text(data.name);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
        yearMonthInit();
    };
};