$(function () {
    init();
});
function init() {
    timeInit();
    menu();
    mousehover();
    deletePic();
    tsTempBookCourse();
};

function timeInit() {
    var week=[{id:1,name:"一"},{id:2,name:"二"},{id:3,name:"三"},{id:4,name:"四"},{id:5,name:"五"},{id:6,name:"六"},{id:7,name:"日"}];
    var html01=template("startWeek_script",{week:week});
    $("#startWeek,#endWeek").empty().append(html01);  

    var time=[{id:0,name:"00:00"},{id:1,name:"01:00"},{id:2,name:"02:00"},{id:3,name:"03:00"},{id:4,name:"04:00"},{id:5,name:"05:00"},{id:6,name:"06:00"},{id:7,name:"07:00"},{id:8,name:"08:00"},{id:9,name:"09:00"},{id:10,name:"10:00"},{id:11,name:"11:00"},{id:12,name:"12:00"},{id:13,name:"13:00"},{id:14,name:"14:00"},{id:15,name:"15:00"},{id:16,name:"16:00"},{id:17,name:"17:00"},{id:18,name:"18:00"},{id:19,name:"19:00"},{id:20,name:"20:00"},{id:21,name:"21:00"},{id:22,name:"22:00"},{id:23,name:"23:00"},{id:24,name:"24:00"}];
    var html02=template("startTime_script",{time:time});
    $("#startTime,#endTime").empty().append(html02); 
    
};

function mousehover() {
    // 年度档案册hover效果
    $("#activityList").on({
        mouseover:function () {
          $(this).addClass("current");
        },
        mouseout:function () {
          $(this).removeClass("current");
        }
    }," >li >div.yearBg");

    // 查询条件改变执行函数
    $("#school").change(function () {
        GetSchoolCourses_port($(this).val());
        $("form.form-horizontal input[name=schoolId]").val($(this).val());
    });

    // 新建活动
    $("#buttonBox").on("click","#newBtn",function () {
        $(".content").addClass("hide01");
        $("#content01").removeClass("hide01");
        $("#content01 > h1 > span").text("自选活动");
        $("#content01 > h1 > small").text("新建");
        $("form.form-horizontal input,form.form-horizontal textarea").val("");
        $("form.form-horizontal input[name=schoolId]").val($("#school").val());
        $("form.form-horizontal input[name=isStop]").val(0);
        $("#addPicBtn01,#addPicBtn02").siblings('li').remove();
        $("#addPicBtn").css({"background":""});
        $("#switchBtn").removeClass("close").text("启用").next("input[name=isStop]").val();
        $("form.form-horizontal select >option").prop("selected",false);
    });

    // 编辑活动
    $("#activityList").on("click","span.editBtn",function () {
        GetCourseDetails_port($(this).attr("data-id"),$(this).attr("data-name"));
    });

    // 活动 签到学生列表
    $("#activityList").on("click","span.signInBtn",function () {
        $(".content").addClass("hide01");
        // $("#backBtn").removeClass("hide01");
        $("#content02").removeClass("hide01");
        $("#content02 > h1 > span").text($(this).attr("data-name"));
        $("#content02 > h1 > small").text("签到");
        tsGetBookedChildren_port($(this).attr("data-id"),$(this).attr("data-time"));
    });

    // 签到
    $("#members").on("click","a.membersBg",function () {
        if($(this).children("span").hasClass("active")){
            tsCancelRoll_port($(this).attr("data-courseId"),$(this).attr("data-time"),$(this).attr("data-useruuid"));
        }else{
            tsCallRoll_port($(this).attr("data-courseId"),$(this).attr("data-time"),$(this).attr("data-useruuid"));
        };
    });

    // 删除活动
    $("#activityList").on("click","span.deleteBtn",function () {
        var id=$(this).attr("data-id");
        swal({
                title: "确定删除此活动吗?",
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
                        tsDelCourse_port(id);
                    };
        });
        $("#myModal").modal("show");
    });

    // 返回上一层级按钮执行函数
    $(".backBtn").on({
        click:function () {
          $(".content").addClass("hide01")
          $("#content").removeClass("hide01");
          // $("#backBtn").addClass("hide01");
        }
    });

    $("#submit").click(function () {
        if(!$(".form-horizontal input.fill").val()){
            $(".form-horizontal input.fill").attr("placeholder","此为必填项。。").addClass("empty");
        };

        var reg = new RegExp("^[0-9]*[1-9][0-9]*$");
        if(!$(".form-horizontal input.fillnum").val() || !$(".form-horizontal input.fillnum").val().match(reg)){
            $(".form-horizontal input.fillnum").attr("placeholder","容纳人数需为数字。。").addClass("empty");
        };

        if($(".faceimage.fill").css("background-image").indexOf("addBtn.png") >0){
            $(".faceimage.fill").addClass("empty");
        };

        if($(".form-horizontal input.fill.empty").length==0 && $(".faceimage.fill.empty").length==0 && $(".form-horizontal input.fillnum.empty").length==0){
            var data={};
            var arr=$("form.form-horizontal").serializeArray();
            for(var i=0;i<arr.length;i++){
                data[arr[i].name]=arr[i].value
            };
            if($("select[name=bookTimeWeekEnd]").val() > $("select[name=bookTimeWeekStart]").val() || ($("select[name=bookTimeWeekEnd]").val() == $("select[name=bookTimeWeekStart]").val() && $("select[name=bookTimeHourEnd]").val() > $("select[name=bookTimeHourStart]").val())){
                AddCourse_port(data);
            }else{
                toastTip("提示","预约结束时间必须大于预约开始时间");
            };
        };
    });

    // 新增活动 取消按钮
    $("#quit").click(function () {
        $(".content").addClass("hide01")
        $("#content").removeClass("hide01");
    });


    // 是否停用此活动
    $("#switchBtn").click(function () {
        $(this).toggleClass("close");
        if($(this).hasClass("close")){
            $(this).text("停用");
            $(this).next("input[name=isStop]").val(1);
        }else{
            $(this).text("启用");
            $(this).next("input[name=isStop]").val(0);
        }
    });

    $(".form-horizontal").on("keyup","input.fill.empty",function () {
        if($(this).val()){
            $(this).removeClass("empty");
        }; 
    });
    $(".form-horizontal").on("keyup","input.fillnum",function () {
        var reg = new RegExp("^[0-9]*[1-9][0-9]*$");
        if($(this).val().match(reg)){
            $(this).removeClass("empty");
        }else{
            $(this).addClass("empty");
        }; 
    });
};







// 获取园区ID
function GetSchoolIds_port() {
    var data={
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.GetSchoolJYIds,param,GetSchoolIds_callback);
};
function GetSchoolIds_callback(res) {
    if(res.code==200){
        if(res.data =="[]"){
            $("#modal03").modal("show");
        }else{
            var data=JSON.parse(res.data);
            var data01={data:data};
            var html=template("school_script",data01);
            $("#school").empty().append(html);

            GetSchoolCourses_port($("#school").val());
            $("#searchBtn").click(function () {
                GetSchoolCourses_port($("#school").val());
            });
        }
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 获取学校课程
function GetSchoolCourses_port(id) {
    var data={
            schoolId:id,
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.GetSchoolCourses,param,GetSchoolCourses_callback,id);
};
function GetSchoolCourses_callback(res,id) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].pic=httpUrl.path_img+data[i].pic+"-scale600"
        };
        var data01={data:data,typeId:user.typeID};
        var html=template("activityList_script",data01);
        $("#activityList").empty().append(html);
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 删除课程
function tsDelCourse_port(id) {
    var data={
            courseId:id,
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.tsDelCourse,param,tsDelCourse_callback);
};
function tsDelCourse_callback(res) {
    if(res.code==200){
        $("#myModal").modal("hide");
        GetSchoolCourses_port($("#school").val());
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 签到学生列表
function tsGetBookedChildren_port(id,time) {
    $("#members").empty();
    var data={
            courseId:id,
            time:time,
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.tsGetBookedChildren,param,tsGetBookedChildren_callback,data);
};
function tsGetBookedChildren_callback(res,json) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={
                data:data,
                courseId:json.courseId,
                time:json.time,
                path:httpUrl.path_img
        };
        
        // console.log(data01);
        var html=template("members_script",data01);
        $("#members").empty().append(html);
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 签到
function tsCallRoll_port(id,time,userUuid) {
    var data={
            courseId:id,
            time:time,
            useruuid:userUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.tsCallRoll,param,tsCallRoll_callback,data);
};
function tsCallRoll_callback(res,json) {
    if(res.code==200){
        tsGetBookedChildren_port(json.courseId,json.time);
    }else{
        console.log("错误");
    }
};

// 签到 取消
function tsCancelRoll_port(id,time,userUuid) {
    var data={
            courseId:id,
            time:time,
            useruuid:userUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.tsCancelRoll,param,tsCancelRoll_callback,data);
};
function tsCancelRoll_callback(res,json) {
    if(res.code==200){
        tsGetBookedChildren_port(json.courseId,json.time);
    }else{
        console.log("错误");
    }
};


// 获取学校课程
function AddCourse_port(data) {
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.AddCourse,param,AddCourse_callback);
};
function AddCourse_callback(res) {
    if(res.code==200){
        $("#quit").click(); 
       GetSchoolCourses_port($("#school").val());
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 课程详情 
function GetCourseDetails_port(id,name) {
    var data={
            courseId:id,
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.GetCourseDetails,param,GetCourseDetails_callback,name);
};
function GetCourseDetails_callback(res,name) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        $(".content").addClass("hide01");
        $("#content01").removeClass("hide01");
        $("#content01 > h1 > small").text("编辑");
        $("form.form-horizontal input,form.form-horizontal textarea").val("");
        $("form.form-horizontal input[name=id]").val($(this).attr("data-id"));
        $("form.form-horizontal input[name=schoolId]").val($("#school").val());
        $("#addPicBtn01,#addPicBtn02").siblings('li').remove();
        $('.fill,.fillnum').removeClass('empty');

        for(i in data){
            $("input[name="+i+"]").val(data[i]);
            $("textarea[name="+i+"]").val(data[i]);
        };

        $(".form-group select[name='bookTimeWeekStart'] >option[value="+data['bookTimeWeekStart']+"]").prop("selected",true);
        $(".form-group select[name='bookTimeHourStart'] >option[value="+data['bookTimeHourStart']+"]").prop("selected",true);
        $(".form-group select[name='bookTimeWeekEnd'] >option[value="+data['bookTimeWeekEnd']+"]").prop("selected",true);
        $(".form-group select[name='bookTimeHourEnd'] >option[value="+data['bookTimeHourEnd']+"]").prop("selected",true);

        data.pic=httpUrl.path_img+data.pic+"-scale200";
        if(data.coursePics){
            data.coursePics=JSON.parse(data.coursePics);
        };
        if(data.workShow){
            data.workShow=JSON.parse(data.workShow);
        };
        data.path=httpUrl.path_img;
        
        $("#addPicBtn").css({
            "background":"transparent url("+data.pic+") center center no-repeat",
            "background-size":"contain"
        });

        var html01=template("addPicBtn01_script",data);
        $("#addPicBtn01").before(html01);
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 删除图片函数
function deletePic() {
    $(".form-horizontal").on({
        mouseover:function () {
            $(this).find("span.deleteIcon").addClass("current");
        },
        mouseout:function () {
            $(this).find("span.deleteIcon").removeClass("current");
        }
    },".pagination li");

    $(".form-horizontal").on("click",".pagination > li span.deleteIcon",function (event) {
        $(this).parents("li").remove();
        var arr01=[];
        for(var i=0;i<$("#addPicBtn01").parent("ul").find("a.pic").length;i++){
            arr01.push($("#addPicBtn01").parent("ul").find("a.pic").eq(i).attr("data-pic"))
        };
        $("input[name=coursePics]").val(JSON.stringify(arr01));

        var arr02=[];
        for(var i=0;i<$("#addPicBtn02").parent("ul").find("a.pic").length;i++){
            arr02.push($("#addPicBtn02").parent("ul").find("a.pic").eq(i).attr("data-pic"))
        };
        $("input[name=workShow]").val(JSON.stringify(arr02));
        event.stopPropagation();
    });
};


// 上传图片
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
                        var imgUrl=data.path_img+data.md5+"-scale200";
                        $("#addPicBtn").css({
                            "background":"transparent url("+imgUrl+") center center no-repeat",
                            "background-size":"contain"
                        });

                        $("#addPicBtn").removeClass("empty").empty().next("input[name=pic]").val(data.md5);
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

        var Qiniu2 = new QiniuJsSDK();
        var uploader02 = Qiniu2.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'addPicBtn01',         // 上传选择的点选按钮，必需
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
                    prevent_duplicates: true,
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
                        var imgUrl=data.path_img+data.md5;
                        var html="<li>"+
                                    "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" class=\"pic\" data-pic="+data.md5+">"+
                                        "<img src="+imgUrl+"-scale200>"+
                                        "<span class=\"deleteIcon\"></span>"+
                                    "</a>"+
                                "</li>";
                        $("#addPicBtn01").before(html);
                        var arr=[];
                        for(var i=0;i<$("#addPicBtn01").parent("ul").find("a.pic").length;i++){
                            arr.push($("#addPicBtn01").parent("ul").find("a.pic").eq(i).attr("data-pic"))
                        };
                        $("input[name=coursePics]").val(JSON.stringify(arr));
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


// 补加预约人数
function tsTempBookCourse() {
    //获取全部班级列表 
    $("#members").on("click","li.addmembersBtn > a.membersNewBg",function () {
        if($("#classBox").children().length==0){
            getMyClassInfo_port();
        }else{
            $(".child").removeClass("active");
        }; 
    });

    // 获得选中班级的学生列表
    $("#classBox").on("click",".classTitle",function () {
        $(".classTitle,.classTabsBody").removeClass("active");
        $(this).addClass("active");
        $(".classTabsBody[data-id="+$(this).attr("data-id")+"]").addClass("active");

        if($(".classTabsBody[data-id="+$(this).attr("data-id")+"]").children().length ==0){
            getClassStuAndTeachers_port($(this).attr("data-id"));
        };
    });

    // 添加临时人员
    $("#classBox").on("click","#save",function () {
        if($(".child.active").length ==0){
            toastTip("提示","请先选择班级、个人。。");
        }else{
            var arr=[];
            for(var i=0;i<$(".child.active").length;i++){
                arr.push($(".child.active").eq(i).attr("data-uuid"));
                tsTempBookCourse_port($(".child.active").eq(i).attr("data-uuid"));
            };
            $("#modal-class").modal("hide"); 
        };
    });

    // 选中人员
    $("#classBox").on("click",".child",function () {
        $(this).toggleClass("active"); 
    });
};

// 获取全部班级列表
function tsTempBookCourse_port(useruuid) {
    var data={
            courseId:$("#members >li.addmembersBtn >a").attr("data-courseid"),
            useruuid:useruuid,
            time:$("#members >li.addmembersBtn >a").attr("data-time")
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.tsTempBookCourse,param,tsTempBookCourse_callback,data);
};
function tsTempBookCourse_callback(res,json) {
    if(res.code==200){
        tsGetBookedChildren_port(json.courseId,json.time);
    }else{
        // console.log('请求错误，返回code非200');
    }
};


// 获取我的班级信息
function getMyClassInfo_port() {
    var data={
            uuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getMyClassInfo,param,getMyClassInfo_callback);
};
function getMyClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("classBox_script",data);
        $("#classBox").empty().append(html);
        chooseNiceScroll(".classTabs >ul");

        $(".classTabs >ul:first >li:first >span.classTitle").click();// 默认第一班选中；
    };
};

// 获取班级所有学生和老师
function getClassStuAndTeachers_port(classId) {
    var data={
            classId:classId,
            useruuid:$(".userName").attr("data-useruuid"),
            classUUID:classId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    // initAjax(httpUrl.getClassStuAndTeachers,param,getClassStuAndTeachers_callback,classId);
    initAjax(httpUrl.attendGetChildOfClass,param,getClassStuAndTeachers_callback,classId);
};
function getClassStuAndTeachers_callback(res,classId) {
    if(res.code==200){
        var data={
                arr:JSON.parse(res.data),
                classId:classId
        };
        var html=template("children_script",data);
        $(".classTabsBody[data-id="+classId+"]").append(html);
        if(data.arr.length==0){
            toastTip("提示","此班级暂时人员。。");
        };
    };
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
        basicButton_port();
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
        $("#user >.userName").text(data.name).attr("data-useruuid",data.userUUID);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        user.userUuid=data.userUUID;
        user.typeID=data.typeID;
        GetSchoolIds_port();
        loadingOut();//关闭loading

        user.companyUUID=data.companyUUID;
        loadFiles();
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