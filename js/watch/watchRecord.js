$(function () {
    menu();
});
function init() {
    // 月份选择初始化
    var month=[1,2,3,4,5,6,7,8,9,10,11,12];
    var htmlMonth=template("month_script",{month});
    $("#month01").append(htmlMonth);

    watchClassList_port();// 获得教职工所在班级列表

    // 查询条件改变执行函数
    $("#coursesDim,#year01,#month01,#teachers").change(function () {
        watchStudentList_port();
    });
    // 点击查询按钮
    $("#searchBtn").click(function () {
        watchStudentList_port();
    });

    // 点击具体学生，执行弹出函数
    $("#members").on('click','li >a.membersBg',function () {
        var  childUuid=$(this).attr('data-useruuid');
        $("#email-content").empty();//评价列表初始化
        $("#evaluation").empty();//评价详情初始化
        var data={
                courses:$("#courses option:selected").text(),
                coursesDim:$("#coursesDim option:selected").text(),
                year:$("#year01 option:selected").text(),
                month:$("#month01 option:selected").text(),
                childUuid:childUuid
        };
        var html=template("page-header_script",data);
        $("#page-header").empty().append(html);
        $("#dailyEvaluationDelete").attr("data-childid",childUuid);//删除Btn 埋藏childid
        watchRecordList_port(childUuid);// 获取课程计划列表
    });
     
    // 删除接口
    $("#dailyEvaluationDelete").click(function () {
        if($("#email-content tbody tr i.fa-check-square-o").length !=0){
            var right=confirm("确认删除吗？");
            if(right){
                dailyEvaluationDelete_port();
            };
        }else{
            alert("请先选择删除项。。")
        };
    });

    // 点击完成按钮，先执行验证再执行保存接口
    $("#evaluation").on("click","#finalBtn",function () {
        var id=$(this).attr("data-id");
        var level=$("#level").val();
        var num=$("#level option").length;
        // num==1 解决option为空时能提交
        if(level || num ==1){
            watchRecordUpdate_port(id);
        }else{
            alert("请先选择水平。。");
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
    $("#evaluation").on("click","#switchBtn",function () {
        $(this).toggleClass("off");
    });

    deletePic();// 删除图片函数

    carousel();// 图片放大插件函数

    exportAll();// 导出

    // niceScroll滚动条
    chooseNiceScroll("#modal-dialog-qunzu .first-content");
    chooseNiceScroll("#modal-dialog-qunzu .second-content");
};

// 查询接口函数
function watchRecordList_port(childUuid,pageNumber) {
    var data={
            childUuid:childUuid,
            teacherUuid:$("#teachers").val(),
            courseId:$("#courses").val(),
            dimId:$("#coursesDim").val(),
            year:$("#year01").val(),
            month:$("#month01").val(),
            pageSize:12,
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
        // console.log(data);
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
                watchRecordList_port($("#dailyEvaluationDelete").attr("data-childid"),pageNumber);
            }
        });
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 删除接口函数
function dailyEvaluationDelete_port() {
    var data={
            id:$("#email-content tbody tr i.fa-check-square-o").attr("data-id")
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
    watchRecordList_port($("#dailyEvaluationDelete").attr("data-childid"),pageNumber);// 获取课程计划列表
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

        watchCourseList_port();// 获取个人观察计划列表
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
        if($("#courses").children().length !=0){
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
            console.log(data);
            for(var i=0;i<data.length;i++){
                data[i].portrait=httpUrl.path_img+data[i].portrait+"&minpic=1";
            };
            var html=template("members_script",{data});
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
            id:id || 107
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
        data.path_img=httpUrl.path_img;
        for(var i=0;i<data.voiceMd5List.length;i++){
            data.voiceMd5List[i]=httpUrl.path_img+data.voiceMd5List[i]+'&minpic=1'
        };

        var html=template("evaluation_script",data);
        $("#evaluation").empty().append(html);

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
                share:0,
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
    $.toast({
        heading: 'Success',
        text: '修改成功',
        showHideTransition: 'slide',
        icon: 'success',
        hideAfter: 1500,
        loaderBg: '#13b5dd',
        position: 'bottom-right'
    });
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
        Dropzone.options.myAwesomeDropzone=false;
        Dropzone.autoDiscover=false;
        var myDropzone=new Dropzone('#addPicBtn',{
            url: httpUrl.picUrl,//84服务器图片
            paramName: "mbFile", // The name that will be used to transfer the file
            maxFilesize: 50, // MB
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        });
        myDropzone.on('success',function(file,responseText){
            var data={
                    md5:JSON.parse(responseText).result,
                    path_img:httpUrl.path_img
            };
            var url=data.path_img+data.md5;
            // var imgUrl=httpUrl.path_img+responseText.uploadFileMd5;
            var html="<li>"+
                        "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" data-src="+url+"&minpic=0 class=\"pic\" data-pic="+data.md5+">"+
                            "<img src="+url+"&minpic=1>"+
                            "<span class=\"deleteBtn\"></span>"+
                        "</a>"+
                    "</li>";
            $("#addPicBtn").parent("li").before(html).find("div").remove();
        });
        myDropzone.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
        });
}

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
                loaderBg: '#13b5dd',
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
                loaderBg: '#13b5dd',
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
                    loaderBg: '#13b5dd',
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
    $("#email-content tbody tr").click(function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            $("#evaluation").empty();//评价详情初始化
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
            $(this).siblings().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            var id=$(this).find('i').attr("data-id");
            watchRecordDetail_port(id); 
        };
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
// niceScroll滚动条
function chooseNiceScroll(AA) {
    $(AA).niceScroll({ 
        cursorcolor: "#ccc",//#CC0071 光标颜色 
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
        cursorwidth: "6px", //像素光标的宽度 
        cursorborder: "0", //     游标边框css定义 
        cursorborderradius: "5px",//以像素为光标边界半径 
        autohidemode: false //是否隐藏滚动条 
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
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / contain"
        });
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
                data.arr[i].current=true;
            }else{
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
