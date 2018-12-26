$(function () {
    menu();
    localStorage.clear();
});
function init() {
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
    $("#coursesDim,#month01,#teachers").change(function (e) {
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

    // 删除观察记录
    $("#email-content").on("click",".parentDelete",function () {
        var id=$(this).attr("data-id");
        if($(this).attr('data-delete') ==1){
                swal({
                    title: "是否删除此观察记录？",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e15d5d",
                    confirmButtonText: "删除",
                    cancelButtonText: "取消",
                    closeOnConfirm: true,
                    closeOnCancel: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            dailyEvaluationDelete_port(id);
                        };
                });
            }else{
                toastTip("提示","非本人创建不可删除");
            }
    });

    // 新增观察记录
    $("#content01").on("click","#newBtn",function () {
        var text=$("#content01 >.pageTitle").text();
        $("#content02 >.pageTitle >span").text(text).attr("data-childUuid",$("#content01 >.pageTitle").attr("data-useruuid"));
        $("#content02 >.pageTitle >small").text("新增");
        $(".content").addClass("hide");
        $("#content02").removeClass("hide").removeClass("looking");

        $("#evaluation").empty().removeClass("newState editState").addClass("newState");//评价详情初始化
        if($("#dimBox").children().length ==0){
            watchDimStructure_port();
        };
        watchRecordDetail_port(0);
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

    // 编辑观察记录
    $("#email-content").on("click","tbody tr td.controllBtn .parentEdit",function () {
        var text=$("#content01 >.pageTitle").text();
        $("#content02 >.pageTitle >span").text(text);
        $("#content02 >.pageTitle >small").text("编辑");
        $(".content").addClass("hide");
        $("#content02").removeClass("hide").removeClass("looking");

        $("#evaluation").empty().removeClass("newState editState").addClass("editState");//评价详情初始化
        watchRecordDetail_port($(this).attr("data-id"));
    });
    
};

function content02fn() {
    // 具体人之观察 编辑 返回按钮
    $("#content02").on("click",".backBtn",function () {
        if($("#content02").hasClass("looking")){
            localStorage.clear();
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

    // 点击完成按钮，先执行验证再执行保存接口
    $("#evaluation").on("click","#finalBtn",function () {
        var id=$(this).attr("data-id");
        var level=$("#level").val();
        var num=$("#level option").length;
        // num==1 解决option为空时能提交
        if(level || num ==1){
            if($(".validate").hasClass("max")){
                toastTip("提示","红色区域的最大字数为1000字。。");
            }else{
                if($("#evaluation").hasClass("newState")){
                    watchBatchAdd_port();
                };
                if($("#evaluation").hasClass("editState")){
                    if($("#level").val()){
                        watchRecordUpdate_port(id);
                    }else{
                        toastTip("提示","请先选择水平");
                    };
                };
            };
        }else{
            toastTip("提示","请先选择水平。。");
        };
        
    });

    // 点击水平下拉框自动切换水平描述
    $("#evaluation").on("change","#level",function () {
        if($(this).val()){
            var text=$(this).find("option[value="+$(this).val()+"]").attr("data-desc");
            $("#description").text(text);
        }else{
            $("#description").text("");
        };
        localStorageFn();
    });

     // 是否标记为典型案例
    $("#evaluation").on("click",".setting >span",function () {
        $(this).find("i").toggleClass("active");
        localStorageFn();// 缓存
    });

    // 时间设置控件
    $("#evaluation").on("click",".timeBtn",function () {
        $(this).addClass("active").parent().siblings().find(".timeBtn").removeClass("active");
        if($(this).hasClass("defaultTime")){
            $(".timePlug").find("input,select").attr("disabled",'disabled');
        }else{
            $(".timePlug").find("input,select").attr("disabled",false);
        };
        localStorageFn();
    });

    // 时间设置控件
    $("#evaluation").on("click","#addIcon",function () {
        if($("#addDim").attr("data-courseid")){
            $(".dimHeader[data-courseid="+$("#addDim").attr("data-courseid")+"]").addClass('active').siblings().removeClass('active');
            $(".dimBody").eq($(".dimHeader.active").index()).addClass('active').siblings().removeClass('active');
        };
        
        var arr=[];
        for(var i=0;i<$("#addDim >span").length;i++){
            arr.push($("#addDim >span").eq(i).attr("data-id"));
        };

        $(".dimBody.active .dimPiece.active").removeClass("active");
        for(var i=0;i<arr.length;i++){
            $(".dimBody.active .dimPiece[data-id="+arr[i]+"]").addClass("active");
        };
        $("#modal-dialog-qunzu").modal("show");
    });

    $("#evaluation").on("click","#addDim >span",function () {
        if(!$(this).hasClass("active")){
            if($("#addDim >span.active").length !=0){
                localStorageFn();// 先保存前缓存
            };

            $(this).addClass("active").siblings().removeClass("active");

            // 水平描述
            var curDimId=$("#addDim >span.active").attr("data-id");
            var curDescArr=JSON.parse(localStorage.getItem("description_"+curDimId));

            var html=template("level_script",{arr:curDescArr});
            $("#level").empty().append(html); 

            emptyNewFn();// 重置
            $(".subTitle").text($(this).text());

            var curLoaclStorage=JSON.parse(localStorage.getItem("dimId_"+$("#addDim").attr("data-courseid")+"_"+$(this).attr("data-id")));
            if(curLoaclStorage){
                console.log(curLoaclStorage);
                curLoaclStorage.path_img=httpUrl.path_img;
                $("#comment").val(curLoaclStorage.comment).next(".maxNum").find("span").text(curLoaclStorage.comment.length);
                $("#evaluate").val(curLoaclStorage.evaluate).next(".maxNum").find("span").text(curLoaclStorage.evaluate.length);
                $("#advice").val(curLoaclStorage.advice).next(".maxNum").find("span").text(curLoaclStorage.advice.length);

                var html01=template("pictureList_script",curLoaclStorage);
                $("#carousel >.addPicBox").before(html01);

                var html02=template("videoList_script",curLoaclStorage);
                $(".voiceList >.addPicBox").before(html02);

                if(curLoaclStorage.share !=0){
                    $(".share").addClass("active");
                };

                if(curLoaclStorage.typical !=0){
                    $(".typical").addClass("active");
                };

                if(curLoaclStorage.timeType ==0){
                    $(".defaultTime").addClass("active");
                }else{
                    $(".timeBtn:not(.defaultTime)").addClass("active");
                    $(".defaultTime").removeClass("active");
                };

                $("#timeSetting").val(curLoaclStorage.timeSetting);
                $("#timeHour >option[value="+curLoaclStorage.timeHour+"]").prop("selected",true);
                $("#timeMinute >option[value="+curLoaclStorage.timeMinute+"]").prop("selected",true);
                if(curLoaclStorage.levelId){
                    $("#level >option[value="+curLoaclStorage.levelId+"]").prop("selected",true);
                    $("#description").text($("#level >option[value="+curLoaclStorage.levelId+"]").attr("data-desc"));
                };
            };  
        };
        
    });

    $("#evaluation").on("change","#timeHour,#timeMinute",function () {
        localStorageFn();
    });

    // 切换维度tab
    $("#dimBox").on("click",".dimHeader",function () {
        var _self=this;
        if($(".dimBody.active .dimPiece.active").length !=0){
            swal({
                    title: "切换观察计划将会清空之前的选择，确认继续？",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e15d5d",
                    confirmButtonText: "继续",
                    cancelButtonText: "取消",
                    closeOnConfirm: true,
                    closeOnCancel: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            $(".dimBody.active .dimPiece.active").removeClass("active");
                            $(_self).addClass("active").siblings().removeClass("active");
                            $(".dimBody").removeClass("active").eq($(_self).index()).addClass("active");
                        };
                });
        }else{
            $(this).addClass("active").siblings().removeClass("active");
            $(".dimBody").removeClass("active").eq($(this).index()).addClass("active");
        };
    });

    // 选择观察维度
    $("#dimBox").on("click",".dimPiece",function () {
        $(this).toggleClass("active")
    });

    // 确定维度按钮
    $("#dimBox").on("click",".modal-footer >span",function () {
        if($(".dimPiece.active").length==0){
            toastTip("提示","至少选择一项");
        }else{
            var arr=[];
            for(var i=0;i<$(".dimPiece.active").length;i++){
                var obj={};
                obj.id=$(".dimPiece.active").eq(i).attr("data-id");
                obj.name=$(".dimPiece.active").eq(i).text();
                arr.push(obj);
            };
            var html=template("addDim_script",{arr:arr});

            // 如果已选观察维度时
            var curDimId=$("#addDim >span.active").attr("data-id");
            $("#addDim").empty().append(html).attr("data-courseid",$(".dimHeader.active").attr("data-courseid"));
            if(curDimId){
                var length=$("#addDim >span[data-id="+curDimId+"]").length;
                if(length !=0){
                    $("#addDim >span[data-id="+curDimId+"]").click();
                }else{
                    $("#addDim >span").eq(0).addClass("active");
                    emptyNewFn();
                };
            }else{
                $("#addDim >span").eq(0).addClass("active");
                emptyNewFn();
            };

            $(".subTitle").text(arr[0].name);

            var dimIds=[];
            for(var i=0;i<arr.length;i++){
                dimIds.push(arr[i].id)
            };

            var curLoaclArr=[];
            if(localStorage.length>0){
                for(var i=0;i<localStorage.length;i++){
                    curLoaclArr.push(localStorage.key(i).slice(12));
                };  
            };


            var minusArr=arrDiff(dimIds,curLoaclArr);// 减去去重

            if(minusArr.length >0){
               watchDimLevel_map_port(minusArr); 
            };
            
            $("#modal-dialog-qunzu").modal("hide");
        };
    });

    $("#evaluation").on("click","#addDim span.deleteBtn",function (e) {
        e.stopPropagation();
        var _self=this;
        swal({
            title: "确认删除此观察维度吗？",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e15d5d",
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            closeOnConfirm: true,
            closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    if($(_self).parent().hasClass("active")){
                        $(_self).parent().remove();
                        if($("#addDim >span").length ==0){
                            emptyNewFn();
                            $("#level").empty();
                        }else{
                            $("#addDim >span").eq(0).click(); 
                        };
                    }else{
                        $(_self).parent().remove();
                    };    
            };
        });
    });
};

// 数组去重
function arrDiff(arr01,arr02) {
    var arr=[];
    for(var i=0;i<arr01.length;i++){
        var num=0;
        for(var j=0;j<arr02.length;j++){
            if(arr01[i]==arr02[j]){
                num++
            };
        };
        if(num==0){
            arr.push(arr01[i]);
        }
    };
    return arr;  
};

function localStorageFn() {
    if($("#addDim >span.active").attr("data-id")){
        var obj={
                advice:$("#advice").val(),
                childUuid:$("#content02 >.pageTitle >span").attr("data-childuuid"),
                comment:$("#comment").val(),
                courseId:$("#addDim").attr("data-courseid"),
                dimId:$("#addDim >span.active").attr("data-id"),
                evaluate:$("#evaluate").val(),
                levelId:$("#level").val(),
                pictureList:function () {
                    var arr=[];
                    for(var i=0;i<$("#carousel .pic").length;i++){
                        arr.push($("#carousel .pic").eq(i).attr("data-pic"))
                    };
                    return arr; 
                }(),
                videoList:function () {
                    var arr=[];
                    for(var i=0;i<$(".voiceList .pic").length;i++){
                        arr.push($(".voiceList .pic").eq(i).attr("data-pic"))
                    };
                    return arr; 
                }(),
                share:function () {
                    var i=0;
                    if($(".share").hasClass("active")){
                        i=1;
                    };
                    return i;
                }(),
                typical:function () {
                    var i=0;
                    if($(".typical").hasClass("active")){
                        i=1;
                    };
                    return i;
                }(),
                timeType:function () {
                    var i=0;
                    if(!$(".defaultTime").hasClass("active")){
                        i=1;
                    };
                    return i;
                }(),
                userTime:function () {
                    var time="";
                    if(!$(".defaultTime").hasClass("active")){
                        var curTime=$("#timeSetting").val()+" "+$("#timeHour").val()+":"+$("#timeMinute").val();
                        time=new Date(curTime).getTime()/1000;
                    };
                    return time;
                }(),
                timeSetting:$("#timeSetting").val(),
                timeHour:$("#timeHour").val(),
                timeMinute:$("#timeMinute").val()
        };
        localStorage.setItem("dimId_"+obj.courseId+"_"+obj.dimId,JSON.stringify(obj));
    }else{
        if($("#evaluation").hasClass("newState")){
            toastTip("提示","请先选择观察维度",4000);
        };
    };
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
            childUuid:$("#content01 >.pageTitle").attr("data-useruuid"),
            teacherUuid:$("#teachers").val(),
            courseId:$("#courses").val(),
            dimId:$("#coursesDim").val(),
            year:$("#year01").val(),
            month:$("#month01").val(),
            pageSize:10,
            pageNumber:pageNumber || 1
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchRecordList,param,watchRecordList_callback);
};
function watchRecordList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        for(var i=0;i<data.list.length;i++){
            switch (data.list[i].state){
                case '0':
                    data.list[i].STATE="<span class=\"unRead\"></span>";
                    break;
                default:
                    data.list[i].STATE=data.list[i].state;
            }
        }

        var html=template("table-email",data);
        $("#email-content").empty().append(html);

        chooseRow();// Row行选择函数
        editRow();// 编辑行函数   
        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRow,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNumber,
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

// 删除接口函数
function dailyEvaluationDelete_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    
    initAjax(httpUrl.watchRecordDelete,param,dailyEvaluationDelete_callback);
};
function dailyEvaluationDelete_callback(res) {
    $("#evaluation").empty();//评价详情初始化
    var pageNumber=Number($("#pagination span.current:not(.prev,.next)").text());   
    watchRecordList_port($("#content01 >.pageTitle").attr("data-useruuid"),pageNumber);// 获取课程计划列表
};

// 所选维度的水平映射结构
function watchDimStructure_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    
    initAjax(httpUrl.watchDimStructure,param,watchDimStructure_callback);
};
function watchDimStructure_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        
        var html=template("dimBox_script",{arr:data});
        $("#dimBox").append(html);

        // 兼容数据过多过长
        $("#modal-dialog-qunzu").modal("show");
        var w=0;
        for(var i=0;i<$(".dimHeader").length;i++){
            w+=$(".dimHeader").eq(i).outerWidth()+45;
        };
        $("#modal-dialog-qunzu").modal("hide");
        $("#dimBox >.modal-header >ul").css("width",w);

        chooseNiceScroll("#dimBox");
        chooseNiceScroll("#dimBox >.modal-header","","2px");
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 所选维度的水平映射结构
function watchDimLevel_map_port(arr) {
    var data={
            dimIds:arr
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    
    initAjax(httpUrl.watchDimLevel_map,param,watchDimLevel_map_callback);
};
function watchDimLevel_map_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        for(var item in data){
            localStorage.setItem("description_"+item,JSON.stringify(data[item]));
        };
        
        var curDimId=$("#addDim >span.active").attr("data-id");
        var curDescArr=JSON.parse(localStorage.getItem("description_"+curDimId));

        var html=template("level_script",{arr:curDescArr});
        $("#level").empty().append(html);
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
        watchTeacherList_port();// 获得班级教职工列表
        $("#teacherClass").change(function () {
            watchTeacherList_port($(this).val());
        });
    };
};

//   获得班级教职工列表
function watchTeacherList_port() {
    var data={
            classId: $("#teacherClass").val()  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchTeacherList,param,watchTeacherList_callback,data.userUUID);
};
function watchTeacherList_callback(res,userUUID) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teachers_script",data);
        $("#teachers").empty().append(html);
        if($("#courses").children().length ==0){
            watchCourseList_port();// 获取个人观察计划列表
        }else{
            watchStudentList_port();
        };
    }else{
        toastTip("提示",res.info);
    };
};

// 获取关联课程接口
function watchCourseList_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchCourseList,param,watchCourseList_callback);
};
function watchCourseList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("courses_script",data);
        $("#courses").append(html);


        watchDimList();// 获取观察计划的维度列表
        $("#courses").change(function () {
            watchDimList();
        });
    }else{
        toastTip("提示",res.info);
    }
};
// 获取关联指标接口
function watchDimList() {
    var data={
            courseId:$("#courses").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchDimList,param,watchDimList_callback);
};
function watchDimList_callback(res) {
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
            classId:$("#teacherClass").val(),
            teacherUuid:$("#teachers").val(),
            courseId:$("#courses").val(),
            dimId:$("#coursesDim").val(),
            year:$("#year01").val(),
            month:$("#month01").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchStudentList,param,watchStudentList_callback);
};
function watchStudentList_callback(res) {
    if(res.code==200){
        if(res.data){
            var data=JSON.parse(res.data);
            for(var i=0;i<data.length;i++){
                data[i].portrait=httpUrl.path_img+data[i].portrait+"-scale400";
            };
            var json={data:data};
            var html=template("members_script",json);
            $("#members").empty().append(html);
        }else{
            toastTip("提示",res.info);
            $("#members").empty();
        };
    }else{
        toastTip("提示",res.info);
    }
};


// 查询接口函数
function watchRecordDetail_port(id) {
    var data={
            recordId:id
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    if(id !=0){
        initAjax(httpUrl.watchSingle_detail,param,watchRecordDetail_callback);
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
        data.createDate=new Date(data.recordTime*1000).Format("yyyy-MM-dd hh:mm");
        data.commentNum=data.comment.length;
        data.evaluateNum=data.evaluate.length;
        data.adviceNum=data.advice.length;

        data.isMySelf=false;
        if(user.userUuid==data.observerUuid){
            data.isMySelf=true;
        };

        data.hour=[];
        for(var i=0;i<24;i++){
            data.hour.push(i)
        };

        data.minute=[];
        for(var i=0;i<60;i++){
            data.minute.push(i)
        };

        var html=template("evaluation_script",data);
        $("#evaluation").empty().append(html);
        
        $('#timeSetting').datepicker({
            todayHighlight:true,
            language:'zh-CN'
        }).on("changeDate",function (ev) {
            localStorageFn();
            $('#timeSetting').datepicker("hide");
        }).on('click',function () {
            localStorageFn();
            if($(this).val()){
                $(this).datepicker("update",$(this).val());
            }else{
                $(this).datepicker("update",new Date()).datepicker('update',"");
            };
        });

        if(data.recordId){
            // 已评价的初始化
            $("#level option[value="+data.levelId+"]").prop("selected", true);
            $("#description").text($("#level option[value="+data.levelId+"]").attr("data-desc"));
            $("#curLevel").text($("#level option[value="+data.levelId+"]").attr("data-desc"));
            $("#evaluate,#evaluate02").val(data.evaluate);
            if(!data.evaluate){
                $(".evaluateBox").addClass("hide");
            }
            $("#advice,#advice02").val(data.advice);
            if(!data.advice){
                $(".adviceBox").addClass("hide");
            }
        };

        if($("#content02").hasClass("looking")){
            $("#comment,#evaluate,#advice").attr("readonly",true);
            $("#level").attr("disabled",true);
        };
        loadFiles();// 上传图片接口
        
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 先执行 更新日常观察记录
function watchRecordUpdate_port(id) {
    var data={
            recordAdd:{
                advice:$("#advice").val(),
                comment:$("#comment").val(),
                evaluate:$("#evaluate").val(),
                levelId:$("#level").val(),
                recordId:id,
                pictureList:function () {
                    var arr=[];
                    for(var i=0;i<$("#carousel .pic").length;i++){
                        arr.push($("#carousel .pic").eq(i).attr("data-pic"))
                    };
                    return arr; 
                }(),
                videoList:function () {
                    var arr=[];
                    for(var i=0;i<$(".voiceList .pic").length;i++){
                        arr.push($(".voiceList .pic").eq(i).attr("data-pic"))
                    };
                    return arr; 
                }(),
                share:function () {
                    var i=0;
                    if($(".share").hasClass("active")){
                        i=1;
                    };
                    return i;
                }(),
                typical:function () {
                    var i=0;
                    if($(".typical").hasClass("active")){
                        i=1;
                    };
                    return i;
                }()
            }
    };
    console.log(data);
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchUpdate2,param,watchRecordUpdate_callback,id);
};
function watchRecordUpdate_callback(res,id) {
    if(res.code==200){
        // 刷新一次评价列表
        localStorage.clear();
        $(".content").addClass("hide");
        $("#content01").removeClass("hide");

        var pageNumber=Number($("#pagination span.current:not(.prev,.next)").text());   
        watchRecordList_port($("#content01 >.pageTitle").attr("data-useruuid"),pageNumber);// 获取课程计划列表

        toastTip("提示","修改成功"); 
    }else{
        console.log(res);
    }
    
};

// 先执行 更新日常观察记录
function watchBatchAdd_port() {
    var data={
                childUUID:$("#content02 >.pageTitle >span").attr("data-childuuid"),
                requestID:function () {
                    return new Date().getTime();
                }(),
                recordList:function () {
                    var curArr=[];
                    for(var i=0;i<$("#addDim >span").length;i++){
                        curArr.push("dimId_"+$("#addDim").attr("data-courseid")+"_"+$("#addDim >span").eq(i).attr("data-id"))
                    };

                    var arr=[];
                    for(var i=0;i<curArr.length;i++){
                        var obj=JSON.parse(localStorage.getItem(curArr[i]));
                        arr.push(obj);
                    };

                    var num=0;
                    for(var i=0;i<arr.length;i++){
                        if(!arr[i]){
                            num++
                        }else{
                            if(!arr[i].levelId){
                                num++
                            }
                        };
                    };

                    if(num !=0){
                        var data=0;
                    }else{
                        var data=arr;
                    }
                    return data;
                }()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    if(data.recordList==0){
        toastTip("提示","每一维度下的观察维度水平为必选");
    }else{
        initAjax(httpUrl.watchBatchAdd,param,watchBatchAdd_callback);
    };
};
function watchBatchAdd_callback(res,id) {
    if(res.code==200){
        localStorage.clear();
        $(".content").addClass("hide");
        $("#content01").removeClass("hide");

        var pageNumber=Number($("#pagination span.current:not(.prev,.next)").text());   
        watchRecordList_port($("#content01 >.pageTitle").attr("data-useruuid"),pageNumber);// 获取课程计划列表
    }else{
        toastTip("提示",res.info);
    };
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

function loadFiles() {
    if(!user.upToken1){
        upToken1_port();
    }else{
        loadFiles01();// 七牛公有文件上传
        loadFiles02();
    };
    // 获取公有文件上传token
    function upToken1_port() {
        var data={
                comUUID:user.companyUUID
        };
        var param={
                params:JSON.stringify(data),
                loginId:httpUrl.loginId
        };
        initAjax(httpUrl.upToken1,param,upToken1_callback);
    };
    function upToken1_callback(res) {
        if(res.code==200){
            user.upToken1=res.data;
            loadFiles01();// 七牛公有文件上传
            loadFiles02();
        };
    };
    function loadFiles01() {
        var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'addPicBtn',         // 上传选择的点选按钮，必需
                uptoken: user.upToken1, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: httpUrl.path_img,     // bucket域名，下载资源时用到，必需
                max_file_size: '1024mb',             // 最大文件体积限制
                multi_selection: true,              // 多选上传
                max_retries: 3,                     // 上传失败最大重试次数
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                filters : {
                    max_file_size : '1024mb',
                    prevent_duplicates: false,
                    mime_types: [
                        {title : "Image files", extensions : "jpg,jpeg,bmp,gif,png"} // 限定jpg,gif,png后缀上传
                    ]
                },
                init: {
                    'FileUploaded': function(up, file, info) {
                        if($("#carousel >.picItem").length <40){
                            var data={
                                    md5:JSON.parse(info.response).key,
                                    path_img:httpUrl.path_img
                            };
                            var url=data.path_img+data.md5;
                            var html="<li data-pic="+data.md5+" class='picItem'>"+
                                    "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" data-src="+url+" class=\"pic\" data-pic="+data.md5+">"+
                                        "<img src="+url+"-scale400>"+
                                        "<span class=\"deleteBtn\"></span>"+
                                    "</a>"+
                                "</li>";
                            $("#addPicBtn").parent("li").before(html);
                            $('.qiniuBar').remove();
                            localStorageFn();
                        }else{
                            toastTip("提示","图片数量上限为40张",4000);
                            $('.qiniuBar').remove();
                        }
                    },
                    'BeforeUpload': function(up, file) {// 每个文件上传前，处理相关的事情
                        $("body").append("<span class='qiniuBar'></span>");
                    },
                    'UploadProgress': function(up, file) {// 进度条
                        $(".qiniuBar").width(file.percent + "%");
                    },
                    'Error': function(up, err, errTip) {
                        toastTip(errTip);
                    }
                }
            });
    };

    function loadFiles02() {
        var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'addPicBtn02',         // 上传选择的点选按钮，必需
                uptoken: user.upToken1, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: httpUrl.path_img,     // bucket域名，下载资源时用到，必需
                max_file_size: '1024mb',             // 最大文件体积限制
                multi_selection: true,              // 多选上传
                max_retries: 3,                     // 上传失败最大重试次数
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                filters : {
                    max_file_size : '1024mb',
                    prevent_duplicates: false,
                    mime_types: [
                        // {title : "Video files", extensions : "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4"}
                        {title : "Video files", extensions : "mp4"}
                    ]
                },
                init: {
                    'FileUploaded': function(up, file, info) {
                        if($(".voiceList >li:not(.addPicBox)").length <1){
                            var data={
                                    md5:JSON.parse(info.response).key,
                                    path_img:httpUrl.path_img
                            };
                            var url=data.path_img+data.md5;
                            var html="<li>"+
                                    "<a href=\"#modal-dialog-video\" data-toggle=\"modal\" data-src="+url+" class=\"pic\" data-pic="+data.md5+">"+
                                        "<img src='../../images/watch/play.png' class='mascot' style='background:url("+url+"?vframe/png/offset/1/w/480/h/360) center center no-repeat;background-size: contain;'>"+
                                        "<span class=\"deleteBtn\"></span>"+
                                    "</a>"+
                                "</li>";
                            $("#addPicBtn02").parent("li").before(html);
                            $('.qiniuBar').remove();
                            localStorageFn();
                        }else{
                            toastTip("提示","短视频上限为1个",4000);
                            $('.qiniuBar').remove();
                        };
                    },
                    'BeforeUpload': function(up, file) {// 每个文件上传前，处理相关的事情
                        $("body").append("<span class='qiniuBar'></span>");
                    },
                    'UploadProgress': function(up, file) {// 进度条
                        $(".qiniuBar").width(file.percent + "%");
                    },
                    'Error': function(up, err, errTip) {
                        toastTip(errTip);
                    }
                }
            });
    };
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
        localStorageFn();
    });
};

// Row行选择函数
function chooseRow() {
    
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
        localStorageFn();
    });

    $("#evaluation").on("keyup","#evaluate",function () {
        $(this).next(".maxNum").find("span").text($(this).val().length);
        if($(this).val().length >1000){
            $(this).addClass("max").next(".maxNum").find("span").addClass("max");
        }else{
            $(this).removeClass("max").next(".maxNum").find("span").removeClass("max");
        };
        localStorageFn();
    });

    $("#evaluation").on("keyup","#advice",function () {
        $(this).next(".maxNum").find("span").text($(this).val().length);
        if($(this).val().length >1000){
            $(this).addClass("max").next(".maxNum").find("span").addClass("max");
        }else{
            $(this).removeClass("max").next(".maxNum").find("span").removeClass("max");
        };
        localStorageFn();
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