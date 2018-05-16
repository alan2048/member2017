var jsonAll01,jsonAll02,jsonAll03;
$(function () {
    init();
});
function init() {
    menu();
    $("#year01,#month01").change(function () {
        echart_A01_port();
    });
    $("#year02,#month02,#class").change(function () {
        echart_A02_port();
    });
    $("#userClass03,#course,#year03,#month03").change(function () {
        echart_A03_port();
    });

    $(window).resize(function () {
        echart_A01("searchBox01",jsonAll01);
        echart_A02("searchBox02",jsonAll02);
        echart_A03("searchBox03",jsonAll03);
    });
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

        echart_A01_port();
        echart_A02_port();

        getUserClassInfo_port();
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
    initAjax(httpUrl.watchTeacherStat,param,echart_A01_callback);
};
function echart_A01_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var json={
                xAxis:[],
                series:[]
        };
        for(var i=0;i<data.length;i++){
            json.xAxis.push(data[i].keyStr);
            json.series.push(data[i].valueStr);
        };
        jsonAll01=json;
        echart_A01("searchBox01",json);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        console.log(data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A01(id,json){
    var myChart = echarts.init(document.getElementById(id));

    var option = {
            title:{
                text:"教师观察记录数量统计",
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
                    name:'发帖数量',
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

// echart_A02接口
function echart_A02_port() {
    var data={
            year:$("#year02").val(),
            month:$("#month02").val(),
            classId:$("#class").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchClassStat,param,echart_A02_callback);
};
function echart_A02_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var json={
                xAxis:[],
                series:[]
        };
        for(var i=0;i<data.length;i++){
            json.xAxis.push(data[i].keyStr);
            json.series.push(data[i].valueStr);
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
                text:"班级观察记录数量统计",
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            color: ['#a2d7f6'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
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
                    name:'发帖数量',
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
        $("#userClass03").append(html);

        getPersonCourse_port();
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
        $("#course").empty().append(html);

        echart_A03_port();
    }else{
        // console.log('请求错误，返回code非200');
    }
};

function echart_A03_port() {
    var data={
            year:$("#year03").val(),
            month:$("#month03").val(),
            courseId:$("#course").val(),
            classId:$("#userClass03").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchCourseStat,param,echart_A03_callback);
};
function echart_A03_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var json={
                xAxis:[],
                series:[]
        };
        for(var i=0;i<data.length;i++){
            json.xAxis.push(data[i].keyStr);
            json.series.push(data[i].valueStr);
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

    var option = {
            title:{
                text:"各观察指标相关观察记录数量",
                left:"center",
                textStyle: {
                    color: '#656666'
                }
            },
            color: ['#a2d7f6'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
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
                    name:'发帖数量',
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
    };
};