var jsonAll01,jsonAll02,jsonAll03;
$(function () {
    init();
});
function init() {
    menu();
    $(window).resize(function () {
        echart_A01("searchBox01",jsonAll01,$("#classMember01").find("option:selected").text());
        echart_A02("searchBox02",jsonAll02,$("#classMember02").find("option:selected").text());
    });

    // echart_A01接口函数
    $("#classMember01,#month01,#year01").change(function () {
        if($("input[type=checkbox][data-type=1]").is(":checked")){
            var timeArr=[];
            for(var i=0;i<$("input[type=checkbox][data-type=1]").parents(".timeBox").find("input[type=text]").length;i++){
                if($("input[type=checkbox][data-type=1]").parents(".timeBox").find("input[type=text]").eq(i).val()){
                    timeArr.push($("input[type=checkbox][data-type=1]").parents(".timeBox").find("input[type=text]").eq(i).val());
                };
            };

            if(timeArr.length !=0){
                echart_A01_choose_port(timeArr);
            }else{
                toastTip("提示","请先选择自定义时间",3000)
            };
        }else{
            echart_A01_port();
        };
    });

    $("#classMember02,#month02,#year02,#course").change(function () {
        if($("input[type=checkbox][data-type=2]").is(":checked")){
            var timeArr=[];
            for(var i=0;i<$("input[type=checkbox][data-type=2]").parents(".timeBox").find("input[type=text]").length;i++){
                if($("input[type=checkbox][data-type=2]").parents(".timeBox").find("input[type=text]").eq(i).val()){
                    timeArr.push($("input[type=checkbox][data-type=2]").parents(".timeBox").find("input[type=text]").eq(i).val());
                };
            };

            if(timeArr.length !=0){
                echart_A02_choose_port(timeArr);
            }else{
                toastTip("提示","请先选择自定义时间",3000)
            };
        }else{
            echart_A02_port();
        };
    });

    $(".timeBox input").prop("checked",false).val("");// 自定义时间初始化
    // 启用 自定义时间
    $(".timeBox input[type=checkbox]").change(function () {
        if($(this).is(":checked")){
            $(this).parents(".timeBox").addClass("active");

            var timeArr=[];
            for(var i=0;i<$(this).parents(".timeBox").find("input[type=text]").length;i++){
                if($(this).parents(".timeBox").find("input[type=text]").eq(i).val()){
                    timeArr.push($(this).parents(".timeBox").find("input[type=text]").eq(i).val());
                };
            };

            if($(this).attr("data-type") == 1){
                $("#year01,#month01").attr("disabled",true);
                if(timeArr.length !=0){
                    echart_A01_choose_port(timeArr);
                }else{
                    toastTip("提示","请同时选择自定义时间",3000)
                };
            }else{
                $("#year02,#month02").attr("disabled",true);
                if(timeArr.length !=0){
                    echart_A02_choose_port(timeArr);
                }else{
                    toastTip("提示","请同时选择自定义时间",3000)
                };
            };
        }else{
            $(this).parents(".timeBox").removeClass("active");

            if($(this).attr("data-type") == 1){
                $("#year01,#month01").attr("disabled",false);
                echart_A01_port();
            }else{
                $("#year02,#month02").attr("disabled",false);
                echart_A02_port();
            };
        };
    });

    // 重置按钮
    $(".timeBox span.resetBtn").click(function () {
        if($(this).parents(".timeBox").hasClass("active")){
            $(this).parents(".timeBox").find("input").val("");
        }else{
            toastTip("提示","请先开启启用按钮");
        } 
    });

    $('.timeTool').datepicker({
        format: 'yyyy-mm',
        todayHighlight:true,
        startView: 1,
        maxViewMode: 1,
        minViewMode:1,
        autoclose: true,
        language:'zh-CN'
    }).on('click',function () {
        if($(this).val()){
            // $(this).datepicker("update",$(this).val());
        }else{
            $(this).datepicker("update",new Date()).datepicker('update',"");
        };

        $(this).parents(".timeBox").addClass("active").find("input[type=checkbox]").prop("checked",true);
        if($(this).attr("data-type") == 1){
            $("#year01,#month01").attr("disabled",true);
        }else{
            $("#year02,#month02").attr("disabled",true);
        };
    }).on("changeDate",function (ev) {

        var timeArr=[];
        for(var i=0;i<$(this).parents(".timeBox").find("input[type=text]").length;i++){
            if($(this).parents(".timeBox").find("input[type=text]").eq(i).val()){
                timeArr.push($(this).parents(".timeBox").find("input[type=text]").eq(i).val());
            };
        };

        if($(this).attr("data-type") == 1){
            if(timeArr.length !=0){
                echart_A01_choose_port(timeArr);
            }else{
                toastTip("提示","请先选择自定义时间",3000)
            };
        }else{
            if(timeArr.length !=0){
                echart_A02_choose_port(timeArr);
            }else{
                toastTip("提示","请先选择自定义时间",3000)
            };
        };
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
        getUserClassInfo_port01();
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
        $("#userClass01").append(html);

        // 默认第一班级的所有成员
        if(data.length>0){
            // echart_A01_port();
            getClassStudentInfo_port(data[0].classUUID);
        };

        // 切换班级时成员接口切换
        $("#userClass01").change(function () {
            var classId=$(this).val();
            getClassStudentInfo_port(classId);
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
        var html=template("classMember_script",{data:data});
        $("#classMember01").empty().append(html);

        if($("input[type=checkbox][data-type=1]").is(":checked")){
            var timeArr=[];
            for(var i=0;i<$("input[type=checkbox][data-type=1]").parents(".timeBox").find("input[type=text]").length;i++){
                if($("input[type=checkbox][data-type=1]").parents(".timeBox").find("input[type=text]").eq(i).val()){
                    timeArr.push($("input[type=checkbox][data-type=1]").parents(".timeBox").find("input[type=text]").eq(i).val());
                };
            };

            if(timeArr.length !=0){
                echart_A01_choose_port(timeArr);
            }else{
                toastTip("提示","请先选择自定义时间",3000)
            };
        }else{
            echart_A01_port();
        };
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// echart_A01接口
function echart_A01_port() {
    var data={
            classId:$("#userClass01").val(),
            useruuid:$("#classMember01").val(),
            time: $("#year01").val() +"-"+$("#month01").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getStudentAbility,param,echart_A01_callback,0);
};
function echart_A01_callback(res,type) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        jsonAll01=data;
        data.type=type;
        var name=$("#classMember01").find("option:selected").text();
        echart_A01("searchBox01",data,name);

        if(data.type ==0){
            data.curTime=$("#year01").val()+"年"+$("#month01").val()+"月";
            data.childName=$("#classMember01 >option:selected").text();
            var html=template("advice_script",data);
            $(".analysisBody").empty().append(html);
            $(".analysisTitle >span").text(data.curTime);
            $('.detailBox').each(function () {
                this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
            });
            chooseNiceScroll(".analysisBody");
        }
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        jsonAll01=data;
        var name=$("#classMember01").find("option:selected").text();
        echart_A01("searchBox01",data,name);
    }else{
        // console.log('请求错误，返回code非200');
    }
};

function textareaAutoFn() { 
    

}

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
// echart_A01接口
function echart_A01_choose_port(arr) {
    var data={
            classId:$("#userClass01").val(),
            useruuid:$("#classMember01").val(),
            time: arr
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getStudentAbilityStrongChooseMonths,param,echart_A01_callback,1);
};

// 获取用户班级信息接口
function getUserClassInfo_port01() {
    var data={};
    var param={
            // params:JSON.stringify(data)
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenMyClassInfo,param,getUserClassInfo_callback01);
};
function getUserClassInfo_callback01(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("userClass_script",{data:data});
        $("#userClass02").append(html);

        // 默认第一班级的所有成员
        if(data.length>0){
            getClassStudentInfo_port01(data[0].classUUID);
        };

        // 切换班级时成员接口切换
        $("#userClass02").change(function () {
            var classId=$(this).val();
            getClassStudentInfo_port01(classId);
        });

    }else{
        // console.log('请求错误，返回code非200');
    }
};
function getClassStudentInfo_port01(classId) {
    var data={
            classId:classId
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicStudent,param,getClassStudentInfo_callback01);
};
function getClassStudentInfo_callback01(res,tabIndex) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("classMember_script",{data:data});
        $("#classMember02").empty().append(html);

        // 获取课程列表
        if($("#course").children().length ==0){
            getPersonCourse_port();
        }else{
            if($("input[type=checkbox][data-type=2]").is(":checked")){
                var timeArr=[];
                for(var i=0;i<$("input[type=checkbox][data-type=2]").parents(".timeBox").find("input[type=text]").length;i++){
                    if($("input[type=checkbox][data-type=2]").parents(".timeBox").find("input[type=text]").eq(i).val()){
                        timeArr.push($("input[type=checkbox][data-type=2]").parents(".timeBox").find("input[type=text]").eq(i).val());
                    };
                };

                if(timeArr.length !=0){
                    echart_A02_choose_port(timeArr);
                }else{
                    toastTip("提示","请先选择自定义时间",3000)
                };
            }else{
                echart_A02_port();
            };
        };
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

        echart_A02_port();
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// echart_A03接口  儿童课程能力统计
function echart_A02_port() {
    var data={
            courseId:$("#course").val(),
            classId:$("#userClass02").val(),
            useruuid:$("#classMember02").val(),
            time: $("#year02").val() +"-"+$("#month02").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getStudentCourseAbility,param,echart_A02_callback);
};
function echart_A02_choose_port(arr) {
    var data={
            courseId:$("#course").val(),
            classId:$("#userClass02").val(),
            useruuid:$("#classMember02").val(),
            time: arr
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getStudentCourseAbilityChooseMonths,param,echart_A02_callback);
};
function echart_A02_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        jsonAll02=data;
        var name=$("#classMember02").find("option:selected").text();
        echart_A02("searchBox02",data,name);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        jsonAll02=data;
        var name=$("#classMember02").find("option:selected").text();
        echart_A02("searchBox02",data,name);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A02(id,json,curName){
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

    var courseName=$("#course >option:selected").text();

    var option={
            backgroundColor: '#fff',
            title: {
                text: courseName+'—'+data.name,
                left: 'center',
                textStyle: {
                    color: '#525252',
                    fontSize: 20
                },
                subtextStyle: {
                    color: '#525252'
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


(function($){
    $.fn.datepicker.dates['zh-CN'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            today: "今天",
            suffix: [],
            meridiem: ["上午", "下午"]
    };
}(jQuery));