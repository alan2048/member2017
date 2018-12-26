var jsonAll01;
$(function () {
    menu();
    localStorage.clear();
});
function init() {
    $(window).resize(function () {
        if(!$("#content03").hasClass("hide")){
            echart_A01("searchBox01",jsonAll01);
        };
    });

    // 月份选择初始化
    var month={month:[1,2,3,4,5,6,7,8,9,10,11,12]};
    var htmlMonth=template("month_script",month);
    var d=new Date();
    $("#month01").append(htmlMonth).find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);

    // 年份选择初始化
    var year={arr:[d.getFullYear()+1]};
    for(var i=d.getFullYear();i>2015;i--){
        year.arr.push(i)
    };
    year.arr.reverse();
    var yearMonth=template("year_script",year);
    $("#year01").append(yearMonth).find("option[value="+d.getFullYear()+"]").prop("selected",true);

    watchClassList_port();// 获得教职工所在班级列表

    // 查询条件改变执行函数
    $("#month01,#teacherClass,#field,#coursesDim").change(function (e) {
        watchStudentList_port();
    });
    $("#year01").change(function (e) {
        if($(this).val()){
            $("#month01").find("option[value=\"\"]").remove();
            watchStudentList_port();
        }else{
            $("#month01").prepend("<option value=\"\" selected=\"selected\">所有月份</option>");
            watchStudentList_port();
        }
        
    });
    // 点击查询按钮
    $("#searchBtn").click(function () {
        watchStudentList_port();
    });

    content01fn();//content01 系列函数

    content02fn();// content02 系列函数

    content03fn();

    deletePic();// 删除图片函数

    carousel();// 图片放大插件函数

    exportAll();// 导出

    validate();
};


function content01fn() {
    // 点击具体学生，执行弹出函数
    $("#members").on('click','li >a.membersBg',function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle").text($(this).attr("data-username")).attr("data-useruuid",$(this).attr('data-useruuid'));

        var  childUuid=$(this).attr('data-useruuid');
        var data={
                courses:$("#courses option:selected").text(),
                coursesDim:$("#coursesDim option:selected").text(),
                year:$("#year01 option:selected").text(),
                month:$("#month01 option:selected").text(),
                childUuid:childUuid
        };
        var html=template("page-header_script",data);
        $("#page-header").empty().append(html);
        
        $("#email-content").empty();//评价列表初始化
        $("#evaluation").empty();//评价详情初始化
        $("#dailyEvaluationDelete").attr("data-childid",childUuid);//删除Btn 埋藏childid
        watchRecordList_port(childUuid);// 获取课程计划列表
    });

    // 具体人之观察记录列表 返回按钮
    $("#content01").on("click",".backBtn",function () {
        watchStudentList_port();
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });

    // 查看观察记录
    $("#email-content").on("click","tbody tr td.email-sender",function () {
        var text=$("#content01 >.pageTitle").text();
        $("#content02 >.pageTitle >span").text(text);
        $("#content02 >.pageTitle >small").text("查看记录");
        $(".content").addClass("hide");
        $("#content02").removeClass("hide").addClass("looking");

        $("#evaluation").empty().removeClass("newState editState");//评价详情初始化
        watchRecordDetail_port($(this).parent().attr("data-id"));
    }); 
};

function content02fn() {
    // 具体人之观察 编辑 返回按钮
    $("#content02").on("click",".backBtn",function () {
        if($("#content02").hasClass("looking")){
            $(".content").addClass("hide");
            $("#content01").removeClass("hide");
        }else{
            swal({
                title: "退出将清除数据，确定退出吗？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e15d5d",
                confirmButtonText: "退出",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        localStorage.clear();
                        $(".content").addClass("hide");
                        $("#content01").removeClass("hide");
                    };
            });
        };
    });
};

function content03fn() {
    $("#content01").on('click',"#analyse",function () {
        $("#content03 >.pageTitle >span").text($("#content01 >.pageTitle").text())
        $(".content").addClass("hide");
        $("#content03").removeClass("hide");
        recordStat_port($(this).attr("data-childid"));
    });

    $("#content03").on("click",".backBtn",function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide");
    });
};

function emptyNewFn() {
    $("#comment,#evaluate,#advice,#timeSetting").val("");
    $("#timeHour >option[value=0],#timeMinute >option[value=0]").prop("selected",true);
    $(".setting .switchBtn").removeClass("active");
    $("#carousel >li:not(.addPicBox)").remove();
    $(".voiceList >li:not(.addPicBox)").remove();
    $(".timeBtn").removeClass("active");
    $(".timeBtn.defaultTime").addClass("active");
    $("#description").text("");
    $(".maxNum >span").text("0");
    $(".subTitle").text("");
};


// 查询接口函数
function watchRecordList_port(childUuid,pageNumber) {
    var data={
            childUUID:$("#content01 >.pageTitle").attr("data-useruuid"),
            dim3ID:$("#coursesDim").val(),
            yearStr:$("#year01").val(),
            monthStr:$("#month01").val(),
            pageSize:10,
            pageNum:pageNumber || 1
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.parentListChildRecord,param,watchRecordList_callback,childUuid);
};
function watchRecordList_callback(res,childUuid) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#analyse").attr("data-childid",childUuid);
        var html=template("table-email",data);
        $("#email-content").empty().append(html);

        editRow();// 编辑行函数   
        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRecord,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNum,
            cssStyle:'',
            // cssStyle: 'pagination-without-border pull-right m-t-0',
            onPageClick: function (pageNumber, event) {
                watchRecordList_port($("#content01 >.pageTitle").attr("data-useruuid"),pageNumber);
            }
        });
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 获得教职工所在班级列表
function watchClassList_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchClassList,param,watchClassList_callback);
};
function watchClassList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").empty().append(html);

        parentListField_port();// 领域列表
    };
};

// 领域列表
function parentListField_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.parentListField,param,parentListField_callback);
};
function parentListField_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("field_script",data);
        $("#field").append(html);

        parentDimList();// 获取观察计划的维度列表
        $("#field").change(function () {
            parentDimList();
        });
    }else{
        toastTip("提示",res.info);
    }
};
// 维度列表
function parentDimList() {
    var data={
            dim0ID:$("#field").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.parentListDim,param,parentDimList_callback);
};
function parentDimList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("coursesDim_script",data);
        $("#coursesDim").empty().append(html);
        watchStudentList_port();//获取班级学生观察记录列表
    }else{
        toastTip("提示",res.info);
    }
};

// 查询接口函数
function watchStudentList_port() {
    var data={
            classUUID:$("#teacherClass").val(),
            dim3ID:$("#coursesDim").val(),
            yearStr:$("#year01").val(),
            monthStr:$("#month01").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.parentListChildRecordCount,param,watchStudentList_callback);
};
function watchStudentList_callback(res) {
    if(res.code==200){
        if(res.data){
            var data=JSON.parse(res.data);
            if(data.length !=0){
                for(var i=0;i<data.length;i++){
                    data[i].portrait=httpUrl.path_img+data[i].childPortraitMD5+"-scale400";
                };
                var json={data:data};
                var html=template("members_script",json);
                $("#members").empty().append(html);
            }else{
                $("#members").empty();
                toastTip("提示","此查询条件下无数据");
            }
        }else{
            toastTip("提示",res.info);
            $("#members").empty();
        };
    }else{
        toastTip("提示",res.info);
    }
};

// 雷达
function recordStat_port(childUuid) {
    var data={
            childUUID:childUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.parentStat,param,recordStat_callback);
};
function recordStat_callback(res) {
    if(res.code==200){
        $("#page-loader").removeClass("in");    
        var data=JSON.parse(res.data);
        
        jsonAll01=data.stat;
        echart_A01("searchBox01",data.stat);

        var data01=data;
        var html=template("advice_script",data01);
        $("#advice").empty().html(html);
        $('textarea').each(function () {
            this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
        });
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

function echart_A01(id,json,curName){
    var myChart = echarts.init(document.getElementById(id));

    var data={
            indicator:[],
            legend:[$("#year01").val()+"-"+$("#month01").val()],
            value:[],
            name:$("#content03 >.pageTitle >span").text()
    };

    for(var i=0;i<json.length;i++){
        data.value.push(Number(json[i].value.slice(0,3)));

        var aa={};
        aa.name=json[i].dim0Name;
        aa.max=100;
        data.indicator.push(aa);
    };

    var option={
            backgroundColor: '#fff',
            title: {
                text: '领域发展水平—'+data.name,
                left: 'center',
                textStyle: {
                    color: '#525252',
                    fontSize: 16
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
                        color: 'rgba(52, 52, 52, 0.1)'
                    }
                }
            },
            series: [
                {
                    name: data.legend[0],
                    type: 'radar',
                    data: [
                        {
                            value: data.value,
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
                            opacity: 0.8
                        }
                    }
                }
            ]
        };

    myChart.setOption(option);
};


// 查询接口函数
function watchRecordDetail_port(id) {
    var data={
            recordUUID:id
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    if(id !=0){
        initAjax(httpUrl.parentSingle_detail,param,watchRecordDetail_callback);
    }else{
        var res={
                code:200
        };
        var data={
                advice:"",
                childName:"",
                childUuid:$("#content01 >.pageTitle").attr("data-useruuid"),
                comment:"",
                dimLevelList:[],
                dimName:"",
                dimid:"",
                evaluate:"",
                levelId:'',
                observerUuid:'',
                observerName:'',
                pictureList:[],
                recordId:'',
                recordTime:'',
                share:'0',
                timeType:'0',
                typical:'0',
                videoList:[],
                visible:''
        };
        res.data=JSON.stringify(data);
        watchRecordDetail_callback(res)
    };
};
function watchRecordDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        data.path_img=httpUrl.path_img;
        data.commentNum=data.comment.length;
        data.isEmpty=true;
        if(data.comment.length ==0 && data.picList.length ==0 && data.videoList.length ==0){
            data.isEmpty=false;
        }

        var html=template("evaluation_script",data);
        $("#evaluation").empty().append(html);

        if($("#content02").hasClass("looking")){
            $("#comment,#evaluate,#advice").attr("readonly",true);
            $("#level").attr("disabled",true);
        };
        
    }else{
        // console.log('请求错误，返回code非200');
    }
};

function carousel() {
    $("#evaluation").on("click",".voiceList a.pic",function () {
        var player = videojs('my-player');
        player.src({
            src:httpUrl.path_img+$(this).attr("data-pic"),
            type:'video/mp4'
        });
        player.play();
    });
    // 帖子列表图片 查看
    $("#evaluation").on("click","#carousel a.pic",function () {
        $(".deleteBtn01").addClass("hide");
        if($("#evaluation").hasClass('newState') || $("#evaluation").hasClass('editState')){
            $(".deleteBtn01").removeClass("hide");
        };
        var arr=[];
        var curPic=$(this).attr("data-pic");
        for(var i=0;i<$(this).parents('#carousel').find('.picItem').length;i++){
            arr.push($(this).parents('#carousel').find('.picItem').eq(i).attr("data-pic"));
        };
        
        var src=httpUrl.path_img+$(this).attr("data-pic")+"";
        $("#carousel_img").empty().append("<img src="+src+" data-curpic="+curPic+" />");
        $("#carousel_img").prev(".prevBtn").attr("data-arr",JSON.stringify(arr)).removeClass("hide");
        $("#carousel_img").next(".nextBtn").attr("data-arr",JSON.stringify(arr)).removeClass("hide");
        if(arr.indexOf(curPic) ==0){
            $("#carousel_img").prev(".prevBtn").addClass("hide")
        }; 
        if(arr.indexOf(curPic)+1 ==arr.length){
            $("#carousel_img").next(".nextBtn").addClass("hide")
        }; 
    });

    // 删除 新增图片按钮
    $("#modal-dialog-img .deleteBtn01").click(function () {
        var cur=$("#carousel_img").find("img").attr("data-curpic");
        var arr=JSON.parse($("#modal-dialog-img .prevBtn").attr("data-arr"));
        if(arr.length==1){
            $(this).prev(".closeBtn01").click();
        }else{
            if(arr.indexOf(cur)+1 !=arr.length ){
                $("#carousel_img").empty().append("<img src="+httpUrl.path_img+arr[arr.indexOf(cur)+1]+" data-curpic="+arr[arr.indexOf(cur)+1]+" />");
            }else{
                $("#carousel_img").empty().append("<img src="+httpUrl.path_img+arr[arr.indexOf(cur)-1]+" data-curpic="+arr[arr.indexOf(cur)-1]+" />");
            };
        };
        arr.splice(arr.indexOf(cur),1);
        $("#modal-dialog-img .nextBtn,#modal-dialog-img .prevBtn").attr("data-arr",JSON.stringify(arr));
        
        // 检查前后一步图标是否隐藏
        var cur01=$("#carousel_img").find("img").attr("data-curpic");
        if(arr.indexOf(cur01)== 0){
            $("#carousel_img").prev(".prevBtn").addClass("hide");
        };
        if(arr.indexOf(cur01)+1 == arr.length){
            $("#carousel_img").next(".nextBtn").addClass("hide");
        }

        // 删除
        $("#carousel li.picItem[data-pic="+cur+"]").remove();
    });

    
    // 前一张
    $("#modal-dialog-img .prevBtn").click(function () {
        var cur=$(this).next("#carousel_img").find("img").attr("data-curpic");
        var arr=JSON.parse($(this).attr("data-arr"));
        if(arr.indexOf(cur) >0){
            var newCur=arr[arr.indexOf(cur)-1];
            if(arr.indexOf(cur)-1 == 0){
                $("#carousel_img").prev(".prevBtn").addClass("hide");
                $("#carousel_img").empty().append("<img alt='正在加载,请稍后...'/>");
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            }else{
                $("#carousel_img").empty().append("<img alt='正在加载,请稍后...'/>");
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            };

            if(arr.indexOf(cur)+1 == arr.length){
                $("#carousel_img").next(".nextBtn").removeClass("hide");
            }
        };
    });

    // 键盘左右键控制
    $(window).keyup(function (e) {
        if($("#modal-dialog-img").hasClass("in")){
            if(e.which ==37 && !$("#modal-dialog-img .prevBtn").hasClass("hide")){
                $("#modal-dialog-img .prevBtn").click()
            };
            if(e.which ==39 && !$("#modal-dialog-img .nextBtn").hasClass("hide")){
                $("#modal-dialog-img .nextBtn").click()
            };
        };
    });

    // 后一张
    $("#modal-dialog-img .nextBtn").click(function () {
        var cur=$(this).prev("#carousel_img").find("img").attr("data-curpic");
        var arr=JSON.parse($(this).attr("data-arr"));
        if(arr.indexOf(cur)+1 <arr.length){
            var newCur=arr[arr.indexOf(cur)+1];
            if(arr.indexOf(cur)+2 == arr.length){
                $("#carousel_img").next(".nextBtn").addClass("hide");
                $("#carousel_img").empty().append("<img alt='正在加载,请稍后...'/>");
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            }else{
                $("#carousel_img").empty().append("<img alt='正在加载,请稍后...'/>");
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            };
        };

        if(arr.indexOf(cur)== 0){
            $("#carousel_img").prev(".prevBtn").removeClass("hide");
        }
    });
};

// 导出
function exportAll() {
    // 单选
    $("#members").on("click",".membersTitle",function () {
        $(this).find("span").toggleClass("checked");
    });
    // 全选
    $("#buttonBox").on("click","#checkedAll",function () {
        var n=0;
        for(var i=0;i<$(".membersTitle >span").length;i++){
            if(!$(".membersTitle >span").eq(i).hasClass("checked")){
                n++;
            }
        };
        if(n > 0){
            $(".membersTitle >span").addClass("checked"); 
        }else{
            $(".membersTitle >span").removeClass("checked"); 
        };
    });   
    // 导出
    $("#buttonBox").on("click","#export",function () {
        if(!$("#year01").val()){
            $.toast({
                heading: 'Success',
                text: '请先选择导出年份',
                showHideTransition: 'slide',
                icon: 'success',
                hideAfter: 1500,
                loaderBg: '#edd42e',
                position: 'bottom-right'
            }); 
        };
        if(!$("#month01").val()){
            $.toast({
                heading: 'Success',
                text: '请先选择导出月份',
                showHideTransition: 'slide',
                icon: 'success',
                hideAfter: 1500,
                loaderBg: '#edd42e',
                position: 'bottom-right'
            }); 
        };
        if($("#year01").val() && $("#month01").val()){
            if($(".membersTitle >span.checked").length >0){
                var arr=[];
                for(var i=0;i<$(".membersTitle >span.checked").length;i++){
                    arr.push($(".membersTitle >span.checked").eq(i).attr("data-useruuid"))
                };
                var data={
                        studentUuidList:arr.join(),
                        year:$("#year01").val(),
                        month:$("#month01").val(),
                };
                window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&params="+JSON.stringify(data)+"&url=/web/sample/record/word/download");
            }else{
                $.toast({
                    heading: 'Success',
                    text: '请先选择导出的学生',
                    showHideTransition: 'slide',
                    icon: 'success',
                    hideAfter: 1500,
                    loaderBg: '#edd42e',
                    position: 'bottom-right'
                }); 
            }
        }  
    });
};

// 删除图片函数
function deletePic() {
    $("#evaluation").on({
        mouseover:function () {
            $(this).find("span.deleteBtn").addClass("current");
        },
        mouseout:function () {
            $(this).find("span.deleteBtn").removeClass("current");
        }
    },"#carousel li,.voiceList li");
    $("#evaluation").on("click","#carousel > li span.deleteBtn,.voiceList > li span.deleteBtn",function (event) {
        $(this).parents("li").remove();
        event.stopPropagation();
    });
};

// 评价行
function editRow() {
    //  编辑接口函数
    $("#dailyEvaluation").click(function () {
        var num=$("#email-content tbody tr i.fa-check-square-o").length;
        if(num>1){
            alert("编辑时为单选，请重新选择。。");
            $("#email-content tbody tr i.fa-check-square-o").removeClass('fa-check-square-o').addClass('fa-square-o');
        }else if(num==0){
            alert("请先选择。。");
        }else{
            var dailyEvaluationId=$("#email-content tbody tr i.fa-check-square-o").attr('data-id');  
            window.location.href="dailyEvaluation_new.html"+"?userUuid="+user.userUuid+"&classId="+user.classId+"&perssionNames=教学管理过程性监测日常监测"+"&dailyEvaluationId="+dailyEvaluationId;
        }
    });   
};

// 验证字数
function validate() {
    $("#evaluation").on("keyup","#comment",function () {
        $(this).next(".maxNum").find("span").text($(this).val().length);
        if($(this).val().length >1000){
            $(this).addClass("max").next(".maxNum").find("span").addClass("max");
        }else{
            $(this).removeClass("max").next(".maxNum").find("span").removeClass("max");
        };
    });

    $("#evaluation").on("keyup","#evaluate",function () {
        $(this).next(".maxNum").find("span").text($(this).val().length);
        if($(this).val().length >1000){
            $(this).addClass("max").next(".maxNum").find("span").addClass("max");
        }else{
            $(this).removeClass("max").next(".maxNum").find("span").removeClass("max");
        };
    });

    $("#evaluation").on("keyup","#advice",function () {
        $(this).next(".maxNum").find("span").text($(this).val().length);
        if($(this).val().length >1000){
            $(this).addClass("max").next(".maxNum").find("span").addClass("max");
        }else{
            $(this).removeClass("max").next(".maxNum").find("span").removeClass("max");
        };
    });
};











// 菜单
function menu() {
    loginUserInfo_port();
    menuChildList_port(user.pid);
    basicButton_port();
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
        user.curCompany ={
                id:data.companyid || 10086
        };
        user.userUuid=data.userUUID;
        data.path_img=httpUrl.path_img;
        $("#user >.userName").text(data.name);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+") no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
        init();// 取得登入信息之后 init初始化
    }else if(res.code ==404){
        toastTip("提示",res.info,2000,function () {
            window.location.href="../../index.html";
        });
    };
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
    }else if(res.coed =404){
        // window.location.href=path;
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
        $("#buttonBox").append(html);
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    };
};