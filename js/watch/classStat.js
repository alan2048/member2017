var jsonAll01,jsonAll02,jsonAll03,jsonAll04;
$(function () {
    init();
});
function init() {
    menu();
    $(window).resize(function () {

        echart_A01("searchBox01",jsonAll01);
        echart_A02("searchBox02",jsonAll02);
        echart_A04("searchBox04",jsonAll04);
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

    $("#userClass04,#course04,#year04,#month04,#userGrade04").change(function () {
        if(this.id=="userClass04"){
            if($(this).val()){
                $("#userGrade04 >option:contains(未选择)").prop("selected",true);
            }else{
                $("#userGrade04 >option").eq(1).prop("selected",true);
            }
        };

        if(this.id=="userGrade04"){
            if($(this).val()){
                $("#userClass04 >option:contains(未选择)").prop("selected",true);
            }else{
                $("#userClass04 >option").eq(1).prop("selected",true);
            }
        };
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
        
        getUserClassInfo_port();
};

// echart_A01接口
function echart_A01_port() {
    var data={
            classId:$("#userClass01").val(),
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
function colorfn(trans) {
    var color=['rgba(194,235,105,'+trans+')','rgba(248,226,100,'+trans+')','rgba(106,234,212,'+trans+')','rgba(244,155,127,'+trans+')','rgba(137,163,244,'+trans+')','rgba(239,154,154,'+trans+')','rgba(42,159,194,'+trans+')','rgba(39,107,182,'+trans+')','rgba(104,73,203,'+trans+')','rgba(198,91,207,'+trans+')','rgba(199,83,96,'+trans+')','rgba(203,140,89,'+trans+')'];
    return color;
}
function echart_A01(id,data){
    if(data){
    var myChart = echarts.init(document.getElementById(id));
    var res={
            legend:[],
            series:[]
    };

    for(var i=0;i<data.pie.length;i++){
        res.legend.push(data.pie[i].LYName);
    };
    res.xAxis=data.bar[0].detail.BJNames;
    
    var colorArr=["#cddc38","#ffeb3b","#ffc107","#ff9800","#ff5722","#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc349"];
    for(var i=0;i<data.bar.length;i++){
        var per01={
                name:data.bar[i].name,
                type:'bar',
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {normal: {color:colorArr[i], label:{show:false}}},
                data:data.bar[i].detail.BJVals
        };
        res.series.push(per01);
    };

    // 二次定位bar
    res.curIndex=0;
    if($("#searchBox01").attr("curname")){
        for(var i=0;i<res.series.length;i++){
            if(res.series[i].name == $("#searchBox01").attr("curname")){
                res.curIndex=i;
            };
        };
    };

    var curClass=$("#userClass01 >option:selected").text();
    var pieArr=[];

    for(var i=0;i<data.pie.length;i++){
        var obj={
                value:data.pie[i].Val,
                name:data.pie[i].LYName,
                itemStyle:{normal:{color:colorArr[i]}}
                /*,selected:function () {
                    var bool=false;
                    if(i==res.curIndex){
                        bool=true;
                    };
                    return bool;  
                }()*/ // 默认选中状态
        };
        pieArr.push(obj);
    };

    var option = {
            title : [{
                text: '班级六大领域发展水平-'+curClass,
                x:'center'
            },{
                text:curClass,
                x:'25%',
                y:'6%',
                textAlign: 'center',
                textStyle:{fontSize:14}
            },{
                text:pieArr[res.curIndex].name+' -全年级对比',
                x:'75%',
                y:'6%',
                textAlign: 'center',
                textStyle:{fontSize:14}
            }],
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:res.legend
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : res.xAxis,
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
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'10%',
                left: '55%',
                right: '5%',
                bottom: '12%',
                containLabel: true
            },
            series : [
                {
                    name:curClass,
                    type:'pie',
                    selectedMode: 'single',
                    radius : [50, 150],
                    center : ['25%', '50%'],
                    roseType : 'area',
                    data:pieArr,
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    }
                },
                res.series[res.curIndex]
            ]
        };

    myChart.setOption(option);

    myChart.on('click', function (params) {
        if(params.seriesType=="pie"){
            var index=params.dataIndex;
            option.series=[
                {
                    name:curClass,
                    type:'pie',
                    radius : [50, 150],
                    center : ['25%', '50%'],
                    roseType : 'area',
                    data:pieArr
                },res.series[index]
            ];
            option.title=[{
                text: '班级六大领域发展水平-'+curClass,
                x:'center'
            },{
                text:curClass,
                x:'25%',
                y:'90%',
                textAlign: 'center',
                textStyle:{fontSize:14}
            },{
                text:params.name+' -全年级对比',
                x:'75%',
                y:'90%',
                textAlign: 'center',
                textStyle:{fontSize:14}
            }];

            myChart.setOption(option);
            $("#searchBox01").attr("curname",params.name); // 二次定位
        }else{
            var curName=params.name;
            if($("#userClass01 >option:selected").text() != curName){
                $("#userClass01 >option:contains("+curName+")").prop("selected",true);
                
                echart_A01_port();
            };
        };
    });
    };
};

















// echart_A03接口  儿童课程能力统计
function echart_A02_port() {
    var data={
            courseId:$("#course").val(),
            classId:$("#userClass02").val(),
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
function echart_A02(id,data){
    var myChart = echarts.init(document.getElementById(id));
    var res={
            legend:[],
            series:[],
            pieArr01:[],
            pieArr02:[]
    };

    // 里面圆 总和计算
    for(var i=0;i<data.pie.length;i++){
        data.pie[i].sum=0;
        for(var j=0;j<data.pie[i].detail.length;j++){
            data.pie[i].sum += Number(data.pie[i].detail[j].Val);
        };
    };

    var colorArr01=["#7deef1","#65e392","#ed9869","#69a1ed","#ed69eb"];
    // 里面圆 pie计算
    for(var i=0;i<data.pie.length;i++){
        var obj={
            value:data.pie[i].sum, 
            name:data.pie[i].LYName,
            itemStyle: {normal: {color:colorArr01[i]}}
        };
        res.pieArr01.push(obj);
    };

    for(var i=0;i<data.pie.length;i++){
        for(var j=0;j<data.pie[i].detail.length;j++){
            res.legend.push(data.pie[i].detail[j].dimName);
        };
    };
    
    res.xAxis=data.bar[0].detail.BJNames;
    
    var colorArr=["#cddc38","#ffeb3b","#ffc107","#ff9800","#ff5722","#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc349"];
    for(var i=0;i<data.bar.length;i++){
        var per01={
                name:data.bar[i].name,
                type:'bar',
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {normal: {color:"#cddc38", label:{show:false}}},
                data:data.bar[i].detail.BJVals
        };
        res.series.push(per01);
    };

    // 二次定位bar
    res.curIndex=0;
    if($("#searchBox02").attr("curname")){
        for(var i=0;i<res.series.length;i++){
            if(res.series[i].name == $("#searchBox02").attr("curname")){
                res.curIndex=i;
            };
        };
    };

    var curClass=$("#userClass02 >option:selected").text();
    var pieArr=[];

    var colorNum=0;
    for(var i=0;i<data.pie.length;i++){
        for(var j=0;j<data.pie[i].detail.length;j++){
            var obj={
                    value:data.pie[i].detail[j].Val,
                    name:data.pie[i].detail[j].dimName,
                    itemStyle: {normal: {color:colorArr[colorNum]}}
            };
            pieArr.push(obj);
            colorNum++;
        };
    };


    var option = {
            title : [{
                text: '班级维度分数统计-'+curClass,
                x:'center'
            },{
                text:curClass,
                x:'25%',
                y:'6%',
                textAlign: 'center',
                textStyle:{fontSize:14}
            },{
                text:pieArr[res.curIndex].name+' -全年级对比',
                x:'75%',
                y:'6%',
                textAlign: 'center',
                textStyle:{fontSize:14}
            }],
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:res.legend
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : res.xAxis,
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
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'10%',
                left: '55%',
                right: '5%',
                bottom: '12%',
                containLabel: true
            },
            series : [
                {
                    name:'内圆',
                    type:'pie',
                    radius: [0, '30%'],
                    center : ['25%', '50%'],
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} : {c}"
                    },
                    data:res.pieArr01
                },{
                    name:curClass,
                    type:'pie',
                    selectedMode: 'single',
                    radius : ['40%', '55%'],
                    center : ['25%', '50%'],
                    data:pieArr,
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    }
                },
                res.series[res.curIndex]
            ]
        };


    myChart.setOption(option);

    myChart.on('click', function (params) {
        console.log(params);
        if(params.seriesType=="pie" && params.seriesName !="内圆"){
            var index=params.dataIndex;
            
            option.series=[
                {
                    name:'内圆',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],
                    center : ['25%', '50%'],
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:res.pieArr01
                },{
                    name:curClass,
                    type:'pie',
                    radius : ['40%', '55%'],
                    center : ['25%', '50%'],
                    data:pieArr,
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    }
                },res.series[index]
            ];

            option.series[2].itemStyle.normal.color=params.color;// pie与bar 色彩统一

            option.title=[{
                text: '班级维度分数统计-'+curClass,
                x:'center'
            },{
                text:curClass,
                x:'25%',
                y:'6%',
                textAlign: 'center',
                textStyle:{fontSize:14}
            },{
                text:params.name+' -全年级对比',
                x:'75%',
                y:'6%',
                textAlign: 'center',
                textStyle:{fontSize:14}
            }];

            myChart.setOption(option);
            $("#searchBox02").attr("curname",params.name); // 二次定位
        }else if(params.seriesType=="bar"){ 
            var curName=params.name;
            if($("#userClass02 >option:selected").text() != curName){
                $("#userClass02 >option:contains("+curName+")").prop("selected",true);
                
                echart_A02_port();
            };
        };
    });

    myChart.on('legendselectchanged', function (params) {

        var insideArr=[];
        for(var i=0;i<data.pie.length;i++){
            for(var j=0;j<data.pie[i].detail.length;j++){
                data.pie[i].detail[j].LYName=data.pie[i].LYName;

                var name=data.pie[i].detail[j].dimName;
                data.pie[i].detail[j].selected=true;
                data.pie[i].detail[j][name]=true;
                data.pie[i].detail[j].Val01 = Number(data.pie[i].detail[j].Val);

                insideArr.push(data.pie[i].detail[j]);
            };
        };

        // 重新计算
        for(var i=0;i<insideArr.length;i++){
            for(j in params.selected){
                if(j==insideArr[i].dimName){
                    insideArr[i].selected=params.selected[j];
                    insideArr[i][j]=params.selected[j];
                };
            };
        };


        // 扣除未选 
        for(var i=0;i<data.pie.length;i++){
            data.pie[i].sum=0;
            for(var j=0;j<insideArr.length;j++){
                if(insideArr[j].selected && data.pie[i].LYName==insideArr[j].LYName){
                    data.pie[i].sum += insideArr[j].Val01;
                };
            };
        };

        var newPieArr=[];
        // 扣除之后  重新刷新
        var colorArr01=["#7deef1","#65e392","#ed9869","#69a1ed","#ed69eb"];
        for(var i=0;i<data.pie.length;i++){
            var obj={
                value:data.pie[i].sum, 
                name:data.pie[i].LYName,
                itemStyle: {normal: {color:colorArr01[i]}}
            };
            if(obj.value !=0){
                newPieArr.push(obj);
            }
        };
        
        option.series[0]={
                    name:'内圆',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],
                    center : ['25%', '50%'],
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:newPieArr
                };

        myChart.setOption(option);
        
    });

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
        data.splice(data.length-1,1);// 切除 未分配组员
        var html=template("userClass_script",{data:data});
        $("#userClass01,#userClass02,#userClass03,#userClass04").append(html);

        echart_A01_port();
        echart_A03_port();
        getPersonCourse_port(); // 获取课程列表
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 获取用户班级信息接口
function classGradeList_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classGradeList,param,classGradeList_callback);
};
function classGradeList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("userGrade_script",{data:data});
        $("#userGrade04").append(html);
        echart_A04_port();
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
        classGradeList_port();
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
        // console.log(data);
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
            gradeId:$("#userGrade04").val(),
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

        jsonAll04=data;
        echart_A04("searchBox04",data);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
    }else{
        $("#searchBox04").empty();
        toastTip("提示",res.info);
        // console.log('请求错误，返回code非200');
    }
};
function echart_A04(id,json){
    var myChart = echarts.init(document.getElementById(id));
    var res={
            legend:[],
            series:[[],[],[],[],[]],
            yAxis:[]
    };
    for(var i=1;i<json.length;i++){
        res.yAxis.push(json[i][0]);

        res.series[0].push(json[i][1]);
        res.series[1].push(json[i][2]);
        res.series[2].push(json[i][3]);
        res.series[3].push(json[i][4]);
        res.series[4].push(json[i][5]);
    };

    var curTitle="";
    if($("#userClass04").val()){
        curTitle=$("#userClass04 >option:selected").text();
    };
    if($("#userGrade04").val()){
        curTitle=$("#userGrade04 >option:selected").text();
    };

    var option = {
            title:{
                text: curTitle+'—各维度水平分布统计',
                x:'center'
            },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params, ticket, callback) {
                    var curName=params[0].name;
                    var sum=(Number(params[0].data)+Number(params[1].data)+Number(params[2].data)+Number(params[3].data)+Number(params[4].data));
                    var average=0;
                    if(sum !=0){
                        var average=(Number(params[0].data*1)+Number(params[1].data*2)+Number(params[2].data*3)+Number(params[3].data*4)+Number(params[4].data*5))/sum
                    };
                    var html=curName+"<br>"+
                                "<span class='hoverBtn' style='background-color:"+params[0].color+"'></span>"+params[0].seriesName+":"+params[0].data+"<br>"+
                                "<span class='hoverBtn' style='background-color:"+params[1].color+"'></span>"+params[1].seriesName+":"+params[1].data+"<br>"+
                                "<span class='hoverBtn' style='background-color:"+params[2].color+"'></span>"+params[2].seriesName+":"+params[2].data+"<br>"+
                                "<span class='hoverBtn' style='background-color:"+params[3].color+"'></span>"+params[3].seriesName+":"+params[3].data+"<br>"+
                                "<span class='hoverBtn' style='background-color:"+params[4].color+"'></span>"+params[4].seriesName+":"+params[4].data+"<br>"+
                                "平均水平:"+average.toFixed(2)+"<br>"
                    return html;
                }
    },
    legend: {
        x : 'center',
        y : 'bottom',
        data: ['水平1', '水平2','水平3','水平4','水平5']
    },
    grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true
    },
    xAxis:  {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: res.yAxis
    },
    series: [
        {
            name: '水平1',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data: res.series[0],
            itemStyle:{normal:{color:"#7deef1"}}
        },
        {
            name: '水平2',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data: res.series[1],
            itemStyle:{normal:{color:"#65e392"}}
        },
        {
            name: '水平3',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data: res.series[2],
            itemStyle:{normal:{color:"#ed9869"}}
        },
        {
            name: '水平4',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data: res.series[3],
            itemStyle:{normal:{color:"#69a1ed"}}
        },
        {
            name: '水平5',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data: res.series[4],
            itemStyle:{normal:{color:"#ed69eb"}}
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