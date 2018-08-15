$(function () {
    menu();
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
        $("#content02 >.pageTitle >span").text(text);
        $("#content02 >.pageTitle >small").text("新增");
        $(".content").addClass("hide");
        $("#content02").removeClass("hide");

        $("#evaluation").empty().removeClass("newState editState").addClass("newState");//评价详情初始化
    });

    // 查看观察记录
    $("#email-content").on("click","tbody tr td.email-sender",function () {
        var text=$("#content01 >.pageTitle").text();
        $("#content02 >.pageTitle >span").text(text);
        $("#content02 >.pageTitle >small").text("查看记录");
        $(".content").addClass("hide");
        $("#content02").removeClass("hide");

        $("#evaluation").empty().removeClass("newState editState");//评价详情初始化
        watchRecordDetail_port($(this).parent().attr("data-id"));
    });

    // 编辑观察记录
    $("#email-content").on("click","tbody tr td.controllBtn .parentEdit",function () {
        var text=$("#content01 >.pageTitle").text();
        $("#content02 >.pageTitle >span").text(text);
        $("#content02 >.pageTitle >small").text("编辑");
        $(".content").addClass("hide");
        $("#content02").removeClass("hide");

        $("#evaluation").empty().removeClass("newState editState").addClass("editState");//评价详情初始化
        watchRecordDetail_port($(this).attr("data-id"));
    });
    
};

function content02fn() {
    // 具体人之观察 编辑 返回按钮
    $("#content02").on("click",".backBtn",function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide");
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
                watchRecordUpdate_port(id);
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
        }
    });

     // 是否标记为典型案例
    $("#evaluation").on("click",".setting >span",function () {
        $(this).find("i").toggleClass("active");
    });

    // 时间设置控件
    $("#evaluation").on("click",".timeBtn",function () {
        $(this).addClass("active").parent().siblings().find(".timeBtn").removeClass("active");
    });
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
        console.log(data);
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
    watchStudentList_port();// 学生初始化
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
            id:id
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchRecordDetail,param,watchRecordDetail_callback);
};
function watchRecordDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        console.log(data);
        data.path_img=httpUrl.path_img;
        for(var i=0;i<data.voiceMd5List.length;i++){
            data.voiceMd5List[i]=httpUrl.path_img+data.voiceMd5List[i]+""
        };
        data.commentNum=data.comment.length;
        data.recordLevel.evaluateNum=data.recordLevel.evaluate.length;
        data.recordLevel.adviceNum=data.recordLevel.advice.length;

        data.hour=[];
        for(var i=0;i<25;i++){
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
            $('#timeSetting').datepicker("hide");
        }).on('click',function () {
            if($(this).val()){
                $(this).datepicker("update",$(this).val());
            }else{
                $(this).datepicker("update",new Date()).datepicker('update',"");
            };
        });

        // 已评价的初始化
        $("#level option[value="+data.recordLevel.levelId+"]").prop("selected", true);
        $("#description").text($("#level option[value="+data.recordLevel.levelId+"]").attr("data-desc"));
        $("#evaluate").val(data.recordLevel.evaluate);
        $("#advice").val(data.recordLevel.advice);

        loadFiles();// 上传图片接口
        
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 先执行 更新日常观察记录
function watchRecordUpdate_port(id) {
    var picMd5List=[];
    for(var i=0;i<$("#carousel a.pic").length;i++){
        var pic=$("#carousel a.pic").eq(i).attr("data-pic");
        picMd5List.push(pic);
    };
    
    var data={
                recordId:id,
                comment:$("#comment").val(),
                picMd5List:picMd5List,
                typical:function () {
                    if($("#switchBtn").hasClass("off")){
                        return 0;
                    }else{
                        return 1;
                    }
                }(),
                share:function () {
                    if($("#switchBtn01").hasClass("off")){
                        return 0;
                    }else{
                        return 1;
                    }
                }(),
                advice:$("#advice").val(),
                evaluate:$("#evaluate").val(),
                levelId:$("#level").val(),
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchRecordUpdate,param,watchRecordUpdate_callback,id);
};
function watchRecordUpdate_callback(res,id) {
    // 刷新一次评价列表
    var pageNumber=Number($("#pagination span.current:not(.prev,.next)").text());   
    watchRecordList_port($("#dailyEvaluationDelete").attr("data-childid"),pageNumber);// 获取课程计划列表

    // 刷新一次评价详情
    watchRecordDetail_port(id);
    toastTip("提示","修改成功");
};

function carousel() {
    $("#evaluation").on("click","#carousel a.pic",function () {
        $("#imgBg").addClass("current");
        var src=$(this).attr("data-src");
        $("#carousel_img").empty().append("<img src="+src+" />");
    });
    $("#modal-dialog-img").click(function () {
        $("#imgBg").removeClass("current"); 
    });
    // 关闭拟态弹出框
    $("body").keydown(function (e) {
         if(e.which === 27){
            $("#imgBg").removeClass("current");
         };
    });
}

function loadFiles() {
    upToken1_port();
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
                        var data={
                                md5:JSON.parse(info.response).key,
                                path_img:httpUrl.path_img
                        };
                        var url=data.path_img+data.md5;
                        var html="<li>"+
                                "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" data-src="+url+" class=\"pic\" data-pic="+data.md5+">"+
                                    "<img src="+url+"-scale400>"+
                                    "<span class=\"deleteBtn\"></span>"+
                                "</a>"+
                            "</li>";
                        $("#addPicBtn").parent("li").before(html);
                        $('.qiniuBar').remove();
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
    },"#carousel li");
    $("#evaluation").on("click","#carousel > li span.deleteBtn",function (event) {
        $(this).parents("li").remove();
        event.stopPropagation();
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