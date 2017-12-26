$(function () {
    init();
});
function init() {
    menu();

    // 分页切换
    $("#tabs >ul >li").click(function () {
        $(this).addClass("current").siblings().removeClass("current"); 
        $("#main >ul >li").eq($(this).index()).addClass("current").siblings().removeClass("current");

        switch($(this).index()){
            case 0:
                if($("#tableBox").children().length ==0){
                    questionList_port(1,$(this).index()+1);
                };
                break;
            case 1:
                if($("#tableBox02").children().length ==0){
                    questionList_port(1,$(this).index()+1);
                };
                break;
            default:
                if($("#tableBox").children().length ==0){
                    questionList_port(1,$(this).index()+1);
                };
        };
    });

    // 查询通知人、班级
    $(".tableBox").on('mouseover',"td.email-date",function () {
        if($(this).find("div").text() =="" && !$(this).hasClass("fill")){
            $(this).addClass("fill");
            questionPeople_port($(this).attr("data-id"));
        };
    });

    // 公告删除 选中
    $(".tableBox").on("click","tbody >tr >td.num",function () {
        $(this).toggleClass("active").parents("tr").toggleClass("active").find("i").toggleClass("fa-check-square-o fa-square-o");
        if($(this).parents("tbody").find("tr.active").length !=0){
            $("#deleteBtn,#editBtn").removeClass("disable");
        }else{
            $("#deleteBtn,#editBtn").addClass("disable");
        }
    });

    // 删除公告
    $("#buttonBox").on("click","#deleteBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择删除项。。");   
        }else{
            swal({
                title: "是否删除此调查问卷？",
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
                        var type=$("#tabs >ul >li.current").index()+1;
                        for(var i=0;i<$("#main >ul >li.current tbody >tr.active").length;i++){
                            questionRemove_port($("#main >ul >li.current tbody >tr.active").eq(i).attr("data-id"),type);
                        };
                    };
            });
        };
    });

    // 阅读人详情
    $("#tableBox").on("click","tbody >tr >td.email-sender.read",function (event) {
        questionReadUser_port($(this).attr("data-id"));
        console.log(event.clipboardData);
    });

    // 弹框 参与人数详情
    $("#detailRead").on('click','.class01 >div',function () {
        $(this).addClass("active").siblings().removeClass("active"); 
        $(this).parents("li.active").find(".children01 li").eq($(this).index()).addClass('active').siblings().removeClass("active");
    });























    // 公告详情
    $("#tableBox").on("click","tbody >tr >td.email-sender:not(.read)",function () {
        if(!$(this).parent().attr("data-url")){
            $(".content").addClass("hide");
            $("#content02").removeClass("hide");
            var json=JSON.parse($(this).parent().attr("data-json"));
            json.path_img=httpUrl.path_img;
            var html=template("detail_script",json);
            $("#detail").empty().append(html);

            if($(this).parent().hasClass("isReaded")){
                $("#read").addClass("active").attr("data-contentid","").attr("data-noticeid","");
            }else{
                $("#read").removeClass("active").attr("data-contentid",json.contentId).attr("data-noticeid",json.noticeId);
            };
        }else{
            noticeReaded_port($(this).parent().attr("data-contentid"));
            window.open($(this).parent().attr("data-url"));
        };
    });





    // 返回上一级
    $(".backBtn").on("click",function () {
        if($("#read").hasClass("active")){
            $(".content").addClass("hide");
            $("#content").removeClass("hide");
        }else{
            toastTip("提示","请先点击下部的已阅读确认按钮");
        };
    });

    // 是否阅读
    $("#read").click(function () {
        if($(this).hasClass("active")){
            $(".backBtn").click();
        }else{
            $(this).addClass("active");
            noticeReaded_port($("#read").attr("data-contentid"));
        };
    });

    

    // 阅读详情 标签页
    $("#detailRead").on("click",".detailNav li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".detailBody >li").removeClass("active").eq($(this).index()).addClass("active"); 
    });
    // 阅读详情 展开此班级学生数量
    $("#detailRead").on("click","li.class",function () {
        $(this).toggleClass("active");
    });
    
    // 新增页
    $("#buttonBox").on("click","#newBtn",function () {
        $(".content").addClass("hide");
        $("#content01 .pageTitle >small").text("新增");
        $("#person").attr("data-toclasses","").attr("data-topersons","").attr("disabled",false);
        $("#carousel >li:not(.addPic)").remove();
        $("#content01").removeClass("hide").find("input[type=text]").val("");
        $("#content01").find("textarea").val("");
        $("#allInput").prop("checked",false);
        $(".right").removeClass("active all num empty").text("");
        $(".childPic").removeClass("active");
        $(".need").removeClass("empty");
        $(".newNumBtn > span").text("0");
        $("#new").removeClass("hide");
        $("#edit,.voiceList").addClass("hide");
        user.tempId=new Date().getTime();
    });

    // 编辑
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");   
        }else{
            var json=JSON.parse($("#tableBox tbody tr.active").attr("data-json"));
            var data={
                    md5Arr:json.pictures,
                    path_img:httpUrl.path_img
            };
            
            $(".content").addClass("hide");
            $("#content01").removeClass("hide");
            $("#content01 .pageTitle >small").text("编辑");
            $("#person").attr("data-toclasses","").attr("data-topersons","").attr("disabled",true).val("");
            $("#content01").find("textarea").val(json.content);
            $("#newTitle").val(json.title);
            $("#newUrl").val(json.url);

            if(json.voice){
                $(".voiceList").removeClass("hide").find("audio").attr("src",data.path_img+json.voice);
            }else{
                $(".voiceList").addClass("hide").find("audio").attr("src","");
            };

            $("#edit").attr("data-id",json.contentId);
            $("#carousel >li:not(.addPic)").remove();
            var html="";
            for(var i=0;i<data.md5Arr.length;i++){
                html+="<li>"+
                        "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" data-src="+data.path_img+data.md5Arr[i]+" class=\"pic\" data-pic="+data.md5Arr[i]+">"+
                            "<img src="+data.path_img+data.md5Arr[i]+"-scale200>"+
                            "<span class=\"deleteBtn\"></span>"+
                        "</a>"+
                    "</li>";
            };
            $("#addPicBtn").parent("li").before(html);
            $("#new").addClass("hide");
            $("#edit").removeClass("hide");
            user.tempId=new Date().getTime();
        };
    });

    // 新增图层返回主界面
    $(".closeBtn").click(function () {
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });
    
    $("#new").on("click",function () {
        ValidateInput();
        if($(".need").hasClass("empty")){
            toastTip("提示","红色框为必填项。。");
        }else{
            if($("#newUrl").val() || $("#newContent").val()){
                noticeAddNew_port();
            };
        };
    });

    // 编辑
    $("#edit").on("click",function () {
        if(!$("#newTitle").val()){
            $("#newTitle").addClass("empty");
            toastTip("提示","标题为必填");
        }else{
            $("#newTitle").removeClass("empty");
            if($("#newUrl").val() || $("#newContent").val()){
                noticeEdit_port();
            }else{
                toastTip("提示","外链和内容比填其一。")
            };
        };
    });

    // 验证标题字数
    $(".newBox #newTitle").keyup(function () {
        $(this).next(".newNumBtn").find("span").text($(this).val().length);
        if ($(this).val().length > 30) {
            $(this).addClass("more");
        } else {
            $(this).removeClass("more");
        };
        if($(this).val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"").length ==0){
            $(this).addClass("empty");
        }else{
            $(this).removeClass("empty");
        };
    });

    // 验证内容字数
    $(".newBox textarea").keyup(function () {
        $(this).next(".newNumBtn").find("span").text($(this).val().length);
        if ($(this).val().length > 1000) {
            $(this).addClass("more");
        } else {
            $(this).removeClass("more");
        };
    });
    
    $("#person").click(function () {
        if($("#classBox").children().length ==0){
            getMyClassInfo_port();
        };
        $("#modal-class").modal("show"); 
    });

    // 选择新增学生
    $("#classBox").on("click",".child >div",function () {
        $(this).toggleClass("active");

        var num=$(this).parents(".children").find(".childPic.active").length;
        var allNum=$(this).parents(".children").find(".childPic").length;
        if(num ==0){
            $(this).parents(".children").prev(".classTitle").find(".right").addClass("empty").text("");
        }else if(num ==allNum){
            $(this).parents(".children").prev(".classTitle").find(".right").addClass("all active").text("");
        }else{
            $(this).parents(".children").prev(".classTitle").find(".right").addClass("num active").removeClass("empty all").text(num);
        };
        
        $(this).parents(".children").prev(".classTitle").find(".right").text();
    });

    // 新增图片删除
    $("#carousel").on("click",".deleteBtn",function () {
        $(this).parents(".pic").parent().remove();
    });
};



// 验证input输入
function ValidateInput() {
    if(!$(".need").val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"")){
        $(".need").addClass("empty");
    };

    if($("#newUrl").val()){
        var aa=isURL($("#newUrl").val());
        console.log($("#newUrl").val(),aa);
        if(aa){
            $("#newUrl").removeClass('empty');
        }else{
            $("#newUrl").addClass('empty');
            alert('原文链接格式不对,请重新输入');
        };
    }
};

function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
};

// 获取某个公告内容列表
function questionList_port(pageNum,type) {
    var data={
            pageNumber:pageNum || 1,
            pageSize:20,
            type:type || 1
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionList,param,questionList_callback,data.type);
};
function questionList_callback(res,type) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        if(data.list.length ==0 && data.pageNumber >1){// 解决删除之后数据为零
            questionList_port(data.pageNumber-1,type)
        }else{
            if(type == 1){
                for(var i=0;i<data.list.length;i++){
                    data.list[i].createDate01=new Date(data.list[i].createDate*1000).Format("yyyy-MM-dd hh:mm");
                    data.list[i].endTime01=new Date(data.list[i].endTime*1000).Format("yyyy-MM-dd hh:mm");
                };
        
                var html=template("tableBox_script",data);
                $("#tableBox").empty().append(html);

                $("#pagination").pagination({// 渲染分页
                    items: data.totalRow,
                    itemsOnPage: data.pageSize,
                    currentPage: data.pageNumber,
                    cssStyle: '',
                    onPageClick: function (pageNumber, event) {
                        questionList_port(pageNumber,1);
                    }
                });
            }else{
                for(var i=0;i<data.list.length;i++){
                    data.list[i].createDate01=new Date(data.list[i].createDate*1000).Format("yyyy-MM-dd hh:mm");
                    data.list[i].endTime01=new Date(data.list[i].endTime*1000).Format("yyyy-MM-dd hh:mm");
                };
        
                var html=template("tableBox02_script",data);
                $("#tableBox02").empty().append(html);

                $("#pagination02").pagination({// 渲染分页
                    items: data.totalRow,
                    itemsOnPage: data.pageSize,
                    currentPage: data.pageNumber,
                    cssStyle: '',
                    onPageClick: function (pageNumber, event) {
                        questionList_port(pageNumber,2);
                    }
                });
            };

            $("#deleteBtn").addClass("disable");
        };
    };
};

// 删除公告
function questionRemove_port(id,type) {
    var data={
            id:id,
            userUuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionRemove,param,questionRemove_callback,type);
};
function questionRemove_callback(res,type) {
    if(res.code==200){
        if(type==1){
            questionList_port($("#pagination").pagination('getCurrentPage'),type);
        }else{
            questionList_port($("#pagination02").pagination('getCurrentPage'),type);
        };
    }else{
        toastTip("提示",res.info);
    };
};

// 查看通知人和班级
function questionPeople_port(id,type) {
    var data={
            pageNumber:1,
            pageSize:20,
            type:type || 1
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionList,param,questionPeople_callback,id);
};
function questionPeople_callback(res,id) {
    if(res.code==200){
        var arr=['小一班','小二班','小三班'];
        $("td.email-date[data-id="+id+"]").find("div").empty().append(arr.join(","));
    }else{
        toastTip("提示",res.info);
    };
};

// 获取某条公告内容阅读详情
function questionReadUser_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionReadUser,param,questionReadUser_callback);
};
function questionReadUser_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        console.log(data);
        data.path_img=httpUrl.path_img;
        var html=template("detailRead_script",data);
        $("#detailRead").empty().append(html);
        chooseNiceScroll("#modal-read .detailBody");
        $("#modal-read").modal("show");
    };
};

// 公告置为已读
function noticeReaded_port(contentId) {
    var data={
            noticeId:user.noticeId,
            contentId:contentId,
            uuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.noticeReaded,param,noticeReaded_callback);
};
function noticeReaded_callback(res) {
    if(res.code==200){
        questionList_port($("#pagination >li.active >span.current:not(.prev,.next)").text());
        $(".backBtn").click();
    };
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
        chooseNiceScroll("#classBox");

        $(".classTitle").click(function () {
            if($(this).next(".children").children().length ==0){
                getClassStuAndTeachers_port($(this).attr("data-id"));
            };
            $(this).parent().toggleClass("active");
        });

        // 选择班级
        $(".right").click(function (e) {
            $(this).removeClass("num").toggleClass("active all").text("");
            if($(this).hasClass("active")){
                $(this).parents(".class").find(".childPic").addClass("active");
            }else{
                $(this).parents(".class").find(".childPic").removeClass("active");
            }
            e.stopPropagation();
        });

        // 全选班级
        $("#allInput").click(function () {
            if($(this).is(":checked")){
                $(".right").addClass("active all");
                $(".childPic").addClass("active");
            }else{
                $(".right").removeClass("active all num empty").text("");
                $(".childPic").removeClass("active");
            }
        });

        $("#cancel").click(function () {
            $("#modal-class").modal("hide"); 
        });

        $("#save").click(function () {
            if($(".right.all").length ==0 && $(".right.num").length ==0){
                toastTip("提示","请先选择班级、个人。。");
            }else{
                var toClasses=[];
                var name=[];
                var toPersons=[];
                for(var i=0;i<$(".right.all").length;i++){
                    toClasses.push($(".right.all").eq(i).attr("data-id"));
                    name.push($(".right.all").eq(i).attr("data-classname"));
                };

                for(var i=0;i<$(".right.num").length;i++){
                    for(var j=0;j<$(".right.num").eq(i).parents(".class").find(".childPic.active").length;j++){
                        var obj={};
                        obj.classId=$(".right.num").eq(i).parents(".class").find(".childPic.active").eq(j).attr("data-classid");
                        obj.useruuid=$(".right.num").eq(i).parents(".class").find(".childPic.active").eq(j).attr("data-uuid");
                        toPersons.push(obj);
                        name.push($(".right.num").eq(i).parents(".class").find(".childPic.active").eq(j).attr("data-name"))
                    };
                };

                $("#person").val(name.join()).attr("data-toclasses",JSON.stringify(toClasses)).attr("data-topersons",JSON.stringify(toPersons));
                $("#person").removeClass("empty");
                $("#modal-class").modal("hide"); 
            };
        });
    };
};

// 获取班级所有学生和老师
function getClassStuAndTeachers_port(classId) {
    var data={
            classId:classId,
            useruuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getClassStuAndTeachers,param,getClassStuAndTeachers_callback,classId);
};
function getClassStuAndTeachers_callback(res,classId) {
    if(res.code==200){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img,
                classId:classId
            };
        var html=template("children_script",data);
        $("#classBox li.class[data-id="+classId+"] >.children").append(html);

        if($("#classBox li.class[data-id="+classId+"] >.classTitle >.right").hasClass("active")){
            $("#classBox li.class[data-id="+classId+"] >.children .childPic").addClass("active");
        };
    };
};

// 新增新的公告内容
function noticeAddNew_port() {
    var data={
            content:$("#newContent").val(),
            noticeId:user.noticeId,
            pictures:function () {
                var arr=[];
                for(var i=0;i<$("#carousel >li >a.pic").length;i++){
                    arr.push($("#carousel >li >a.pic").eq(i).attr("data-pic"))
                };
                return arr;
            }(),
            tempId:user.tempId,
            title:$("#newTitle").val(),
            toClasses:JSON.parse($("#person").attr("data-toclasses")),
            toPersons:JSON.parse($("#person").attr("data-topersons")),
            url:function () {
                var url="";
                if($("#newUrl").val()){
                    if($("#newUrl").val().indexOf("http")>=0){
                        url=$("#newUrl").val();
                    }else{
                        url="http://"+$("#newUrl").val();
                    }
                };
                return url;
            }(),
            uuid:$(".userName").attr("data-useruuid"),
            voice:""
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.noticeAddNew,param,noticeAddNew_callback);
};
function noticeAddNew_callback(res) {
    if(res.code==200){
        questionList_port($("#pagination >li.active >span.current:not(.prev,.next)").text());
        $(".closeBtn").click();
    };
};

// 编辑公告内容
function noticeEdit_port() {
    var data={
            content:$("#newContent").val(),
            contentId:$("#edit").attr("data-id"),
            noticeId:user.noticeId,
            pictures:function () {
                var arr=[];
                for(var i=0;i<$("#carousel >li >a.pic").length;i++){
                    arr.push($("#carousel >li >a.pic").eq(i).attr("data-pic"))
                };
                return arr;
            }(),
            title:$("#newTitle").val(),
            url:function () {
                var url="";
                if($("#newUrl").val()){
                    if($("#newUrl").val().indexOf("http")>=0){
                        url=$("#newUrl").val();
                    }else{
                        url="http://"+$("#newUrl").val();
                    }
                };
                return url;
            }(),
            voice:$(".voiceList audio").attr("src")
    };
    console.log(data);
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.noticeUpdateNoticeContent,param,noticeEdit_callback);
};
function noticeEdit_callback(res) {
    if(res.code==200){
        questionList_port($("#pagination >li.active >span.current:not(.prev,.next)").text());
        $(".closeBtn").click();
    };
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
                        var url=data.path_img+data.md5;
                        var html="<li>"+
                                    "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" data-src="+url+" class=\"pic\" data-pic="+data.md5+">"+
                                        "<img src="+url+"-scale200>"+
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

        var title="";
        for(var i=0;i<data.arr.length;i++){
            data.arr[i].iconArr=data.arr[i].icon.split(",");
            data.arr[i].pid=menuId;
            data.arr[i].url=data.arr[i].url.split("/")[2];
            if(data.arr[i].id == user.sid){
                data.arr[i].newId=function () {return data.arr[i].id+"&t="+(new Date().getTime())}();
                data.arr[i].current=true;
                title=data.arr[i].name;
            }else{
                data.arr[i].newId=function () {return data.arr[i].id+"&t="+(new Date().getTime())}();
                data.arr[i].current=false;
            };

            // 判断是否url自带参数
            if(data.arr[i].url.indexOf("?") >=0){
                data.arr[i].search=true;
            }else{
                data.arr[i].search=false;
            }
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
        loadingOut();//关闭loading

        questionList_port();

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