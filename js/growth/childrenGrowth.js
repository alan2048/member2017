template.defaults.escape=false;
$(function () {
    loadingOut();//关闭loading
    init();
});
function init() {
    // 切换班级
    $("#logo .curClass").click(function () {
        $("#modal-class").modal("show");
    });  
    $("#classBox").on("click","span",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".curClass").text($(this).text()).attr("data-classid",$(this).attr("data-id"));
        user.classId=$(this).attr("data-id");
        $("#teacherClass option[value="+$(this).attr("data-id")+"]").prop("selected",true);
        $("#modal-class").modal("hide");
        growthStudent_port(user.classId);// 加载所有学生
        growthList_port(user.classId,0,$("#label >span.active").attr("data-id"),0);
    });
    $("#changeClass").on("change","#teacherClass",function () {
        $(".curClass").text($(this).find("option:checked").text()).attr("data-classid",$(this).val());
        user.classId=$(this).val();
        growthStudent_port(user.classId);// 加载所有学生
        growthList_port(user.classId,0,$("#label >span.active").attr("data-id"),0);
    });


    newInit();// 发帖
    listInit();// 帖子列表

    // 滚动到顶
    $("[data-click=scroll-top]").click(function(e){
        e.preventDefault();
        $("html, body").animate({scrollTop:$("body").offset().top},500)
    });
    // 滚动 显示隐藏
    $(document).scroll(function(){
        var e=$(document).scrollTop();
        if(e>=800){
            $("[data-click=scroll-top]").addClass("in");
        }else{
            $("[data-click=scroll-top]").removeClass("in");
        };
        if(e>=200){
            $("#changeClass").addClass("active");
        }else{
            $("#changeClass").removeClass("active");
        };
    });

    // banner自动缩放
    $(window).resize(function () {
        windowResize();
    });

    carousel();// 图片轮播
};
// 发帖
function newInit() {
    loginUserInfo_port();// 谁可见
    
    chooseNiceScroll("#upload");
    chooseNiceScroll("#whoBox");
    // 发帖 开关 输入框
    $("#newBtn,#newText").click(function () {
        $("#editor").toggleClass("active").find("#input >textarea").val("");
    });

    // 是否置顶
    $(".newTopBtn").click(function () {
        $(this).toggleClass("active"); 
        if($(this).hasClass("active")){
            $(this).find("span").text("开");
        }else{
            $(this).find("span").text("关");
        };
    });

    // 计算字数
    $("#editor >#input >textarea").keyup(function () {
        $("#editor .newNumBtn >span").text($(this).val().length);
        if($(this).val().length>1000){
            $(this).addClass("more");
        }else{
            $(this).removeClass("more");
        }
    });

    // 发帖 添加图片
    $("#editor .newPicBtn").click(function () {
        $("#modal-picture").modal("show"); 
    });

    // 发帖 谁可见
    $("#editor .newWhoBtn").click(function () {
        $("#modal-who").modal("show"); 
    });

    // 点击上传图片
    $(".picMain >ul").on("click","li.addBtn01",function () {
        $("#addBtn").click();
    });

    // 选择图片
    $(".picMain >ul").on("click","li.loadImg",function () {
        $(this).toggleClass("active");
        isMaxNum();// 判断是否超过40张
    });

    // 删除图片
    $("#picListUl").on("click",".deleteBtn",function (e) {
         e.stopPropagation();
         $(this).parents("li").remove();
    });

    // 发帖 添加标签
    $("#editor .newLabelBtn").click(function () {
        $("#modal-label").modal("show"); 
    });

    // 选择 标签
    $("#labelLib").on("click","span",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".newLabel").empty().text("标签：").append($(this).clone()).find("span").append("<span class=\"deleteBtn\"></span>");
        $("#modal-label").modal("hide"); 
    });

    // 删除标签
    $(".newLabel").on("click",".deleteBtn",function (e) {
         $(".newLabel").empty();
    });

    // 加载已选择的图片
    $("#picBtn").click(function () {
        var AA=$("#picTabContent .picMain ul.picBody >li.active");
        if(AA.length>40){
            toastTip("提示","支持最大张数为40张",2000);
        }else{
            var arr=[];
            if(AA.length >0){
                for(var i=0;i<AA.length;i++){
                    arr.push(AA.eq(i).attr("data-md5"))
                }
            };
            var data={
                    arr:arr,
                    path_img:httpUrl.path_img
                };
            var html=template("picListUl_script",data);
            $("#picListUl").empty().append(html).parent("#picList").addClass("active");
            $("#modal-picture").modal("hide");
        }
    });

    // 选择可选人
    $("#modal-who .whoBody").on("click","li",function () {
        $(this).toggleClass("active"); 
    });

    // 选择可选人 确定按钮
    $("#whoBtn").click(function () {
        $(".newWho").empty().text("谁可见：").append($(".whoBody >li.active").clone());
        $("#modal-who").modal("hide");
    });

    // 删除 可选人 
    $(".newWho").on("click","li >.deleteBtn",function () {
        if($(".newWho li").length ==1){
            $(".newWho").empty();
        }else{
            $(this).parent("li").remove();
        };
    });

    // 发帖
    $("#commentNew").click(function () {
        if($("#editor >#input >textarea").hasClass("more")){
            toastTip("提示","最多输入1000字...",2000);
        }else if($("#editor >#input >textarea").val() || $("#picListUl >li").length >0){
            var pictureList=[];
            for(var i=0;i<$("#picListUl >li").length;i++){
                pictureList.push($("#picListUl >li").eq(i).attr("data-pic"))
            };
            pictureList=distinct(pictureList);// 数组去重

            var labelList=[];
            if($(".newLabel >span").length==0){
                labelList=[];
            }else{
                for(var i=0;i<$(".newLabel >span").length;i++){
                    labelList.push($(".newLabel >span").eq(i).attr("data-id"));
                };
            };
            var childUseruuidList=[];
            for(var i=0;i<$(".newWho >li.active").length;i++){
                childUseruuidList.push($(".newWho >li.active").eq(i).attr("data-studentuuid"))
            };
            var stickyPost;
            if($(".newTopBtn").hasClass("active")){
                stickyPost="1";
            }else{
                stickyPost="0"
            };
        
            var data={
                    childUseruuidList:childUseruuidList,
                    classId:user.classId.toString(),
                    content:$("#input >textarea").val(),
                    labelList:labelList,
                    pictureList:pictureList,
                    stickyPost:stickyPost,
                    video:""
            };
            // console.log(data);
            growthAdd_port(data);  
        }else{
            toastTip("提示","文字和图片至少需选择一项",2000);
        };      
    });
};
// 帖子列表
function listInit() {
    
    // 点击标签 切换list内容
    $("#label").on("click","span",function () {
        $(this).addClass("active").siblings().removeClass("active");
        growthList_port(user.classId,0,$("#label >span.active").attr("data-id"),0);
    });

    // 滚动到底部继续加载数据
    window.onscroll=function () {
        if(getDocumentTop() == (getScrollHeight()-getWindowHeight())){
            growthList_port(user.classId,$("#list >li:last").attr("data-newidmax") || 0,$("#label >span.active").attr("data-id"),1);
        };
    };

    // 删除一条内容
    $("#list").on("click",".canDelete",function () {
    	var messageId=$(this).attr("data-messageId");
    	swal({
                title: "是否删除此信息？",
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
                        growthMessageDelete_port(user.classId,messageId);
                    };
        });
    });

    // 删除一条内容
    $("#list").on("click",".praiseBtn",function () {
        growthAddordelete_port(user.classId,$(this).attr("data-messageId"),$(this).attr("data-praiseid"))
    });

    // 一条里面的谁可见
    $("#list").on("click",".visibleBtn",function () {
        var data={
                arr:JSON.parse($(this).attr("data-visible")),
                path_img:httpUrl.path_img
        };
        var html=template("who01_script",data);
        $("#modal-who01 .whoBody").empty().append(html);
        $("#modal-who01").modal("show");
    });

    // 删除某一条评论
    $("#list").on("click",".commentDelete",function (e) {
        e.stopPropagation(); 
        var mId=$(this).attr("data-messageId"),cId=$(this).attr("data-commentId");
        swal({
                title: "是否删除此信息？",
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
                        growthCommentDelete_port(user.classId,mId,cId);
                    };
        });   
    });

    // 发表评论 弹框
    $("#list").on("click",".commentBtn",function () {
        $("#list .commentBox[data-messageId="+$(this).attr("data-messageId")+"]").addClass("active").find("textarea").val("").attr("placeholder","评论：").focus();
        $("#list .commentBox[data-messageId="+$(this).attr("data-messageId")+"]").find(".comment").attr("data-cuseruuid","");
    });

    // 回复评论 弹框
    $("#list").on("click",".commentListBox >li",function () {
        if($(this).find(".commentTip").length==1){
            $(this).parents(".commentList").next(".commentBox").addClass("active").find("textarea").val("").attr("placeholder","回复 "+$(this).attr("data-commentUserName")+":").focus();
            $(this).parents(".commentList").next(".commentBox").addClass("active").find(".comment").attr("data-cuseruuid",$(this).attr("data-commentUseruuid"));
        }else{
            $(this).parents(".commentList").next(".commentBox").addClass("active").find(".cancelBtn").click();// 不可评论自己 同时关闭回复框
        };
    });

    // 新增 回复 评论
    $("#list").on("click",".comment",function () {
        // 去空去回车去空白符
        if($(this).prev("textarea").val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"")){
            var data={
                classId:user.classId,
                cuseruuid:$(this).attr("data-cuseruuid"),
                messageId:$(this).attr("data-messageId"),
                content:$(this).prev("textarea").val()
            };
            growthCommentAdd_port(data);
        }else{
            toastTip("提示","请先填写评论...",2000);
        };
    });

    // 取消置顶
    $("#list").on("click",".stickyPost >span",function () {
        growthCancelSticky_port($(this).attr("data-messageid")); 
    });

    // 最多显示5行 函数
    $("#list").on("click",".fold",function () {
        $(this).toggleClass("active");
        if($(this).hasClass("active")){
            $(this).text("收起");
        }else{
            $(this).text("展开全文");
        };
        $(this).prevAll("span").toggleClass("active"); 
    });

    // 显示>12张图片
    $("#list").on("click",".twelve",function () {
        $(this).addClass("hide").parent("li").nextAll(".more").removeClass("hide").parents(".pictureList").next(".foldPic").removeClass("hide");
    });
    // 折叠>12张图片
    $("#list").on("click",".foldPic",function () {
        $(this).addClass("hide").prev("ul").find(".more").addClass("hide");
        $(this).prev("ul").find(".twelve").removeClass("hide");
    });

    $("#list").on("click",".cancelBtn",function () {
        $(this).parents(".commentBox").removeClass("active"); 
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
        // 家长权限控制
        if(data.typeID != "20"){
            $("#editor .newWhoBtn,#editor .newTopBtn").addClass("current");
        };

        user.companyUUID=data.companyUUID;
        user.useruuid=data.userUUID;// UUid 初始化
        loadFiles();
        watchClassList_port();
    }else{
        toastTip("提示",res.info,"",function () {
           window.location.href="../../index.html"; 
        });
    };
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
        user.classId=$("#teacherClass").val(); 
        
        growthLabel_port();
        growthStudent_port(user.classId);// 加载所有学生
    };
};

// 获取学校所有的标签
function growthLabel_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthLabel,param,growthLabel_callback);
};
function growthLabel_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("lable_script",data);
        $("#label,#labelLib").empty().append(html);
        growthList_port(user.classId,0,$("#label >span.active").attr("data-id"),0);
    };
};

// 获取当前班级学生列表
function growthStudent_port(classId) {
    var data={
            classId:classId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthStudent,param,growthStudent_callback);
};
function growthStudent_callback(res) {
    if(res.code=200){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img
        };
        var html=template("who_script",data);
        $("#modal-who .whoBody").empty().append(html);
    };
};

// 新增一条内容
function growthAdd_port(json) {
    var data={
                childUseruuidList:json.childUseruuidList,
                classId:json.classId,
                content:json.content,
                labelList:json.labelList,
                pictureList:json.pictureList,
                stickyPost:json.stickyPost,
                video:json.video
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthAdd,param,growthAdd_callback);
};
function growthAdd_callback(res) {
    if(res.code==200){
        $("#picListUl,.newLabel,.newWho").empty();
        $(".newNumBtn >span").text("0");
        $("#newBtn").click();
        growthList_port(user.classId,0,$("#label >span.active").attr("data-id"),0);
    };
};




// 删除一条内容
function growthMessageDelete_port(classId,messageId) {
    var data={
            classId:classId,
            messageId:messageId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthMessageDelete,param,growthMessageDelete_callback,messageId);
};
function growthMessageDelete_callback(res,messageId) {
    if(res.code==200){
        $("#list >li[data-id="+messageId+"]").remove();
    };
};

// 点赞或者取消点赞
function growthAddordelete_port(classId,messageId,praiseId) {
    var data={
            classId:classId,
            messageId:messageId,
            praiseId:praiseId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthAddordelete,param,growthAddordelete_callback,data);
};
function growthAddordelete_callback(res,json) {
    if(res.code==200){
        if(res.info =="点赞成功"){
            var data=JSON.parse(res.data);
            $("#list .praiseBtn[data-messageId="+json.messageId+"]").addClass("hover").text("取消赞").attr("data-praiseid",data.id);
            if($(".praiseList[data-messageId="+json.messageId+"]").children().length==0){
                var html=template("praise_script",data);
                $(".praiseList[data-messageId="+json.messageId+"]").append(html);
            }else{
                $(".praiseList[data-messageId="+json.messageId+"] >.praiseListBox").append("<span data-praiseid="+data.id+" class=\"praiseUserName\">,"+data.praiseUserName+"</span>");
            };
        };
        if(res.info =="取消赞成功"){
            $("#list .praiseBtn[data-messageId="+json.messageId+"]").removeClass("hover").text("赞").attr("data-praiseid",0);
            if($(".praiseList[data-messageId="+json.messageId+"] >.praiseListBox >.praiseUserName").length==1){
                $(".praiseList[data-messageId="+json.messageId+"]").empty();
            }else{
                $(".praiseList[data-messageId="+json.messageId+"] >.praiseListBox >.praiseUserName[data-praiseid="+json.praiseId+"]").remove();
            };
        };
    };
};

// 删除某一条评论
function growthCommentDelete_port(classId,messageId,commentId) {
    var data={
            classId:classId,
            messageId:messageId,
            commentId:commentId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthCommentDelete,param,growthCommentDelete_callback,data);
};
function growthCommentDelete_callback(res,json) {
    if(res.code==200){
        if(res.info =="删除成功"){
            if($("#list .commentList[data-messageid="+json.messageId+"] li").length ==1){
                $("#list .commentList[data-messageid="+json.messageId+"]").empty();
            }else{
                $("#list .commentList[data-messageid="+json.messageId+"] li[data-commentid="+json.commentId+"]").remove();
            };
        };
    };
};

// 新增评论
function growthCommentAdd_port(json) {
    var data={
            classId:json.classId,
            cuseruuid:json.cuseruuid,
            messageId:json.messageId,
            content:json.content
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthCommentAdd,param,growthCommentAdd_callback,data);
};
function growthCommentAdd_callback(res,json) {
    if(res.code==200){
        $(".commentBox[data-messageId="+json.messageId+"]").removeClass("active").find("textarea").text("");
        var data=JSON.parse(res.data);
        data.createUseruuid=$(".commentList[data-messageId="+json.messageId+"]").attr("data-createUseruuid");
        data.messageId=json.messageId;
        data.useruuid=user.useruuid;
        if($(".commentList[data-messageId="+json.messageId+"]").find("li").length >0){
            data.empty=1;
            var html=template("comment_script",data);
            $(".commentList[data-messageId="+json.messageId+"] >ul").append(html);
            $(".commentBox[data-messageId="+json.messageId+"] textarea").val("");
        }else{
            data.empty=0;
            var html=template("comment_script",data);
            $(".commentList[data-messageId="+json.messageId+"]").append(html);
            $(".commentBox[data-messageId="+json.messageId+"] textarea").val("");
        };

        
    };
};

// 获取班级内容列表
function growthList_port(classId,idMax,labelId,type) {
    var data={
            classId:classId,
            idMax:idMax,
            labelId:labelId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthList,param,growthList_callback,type);
};
function growthList_callback(res,type) {
    if(res.code==200){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img,
                useruuid:user.useruuid
        };

        if(data.arr.length==0){
            if(type==0){
                toastTip("提示","此班级下暂无记录。。");
            }else{
                toastTip("提示","已没有记录。。")
            }
            
        }else{
            for(var i=0;i<data.arr.length;i++){
                data.arr[i].visible=JSON.stringify(data.arr[i].visibleList);
                data.arr[i].createTime=new Date(data.arr[i].createTime*1000).Format("yyyy年MM月dd日 hh:mm");
                // 最多显示5行
                if(data.arr[i].content.length > 210){
                    data.arr[i].content01=data.arr[i].content.slice(209);
                    data.arr[i].content=data.arr[i].content.slice(0,209);
                };
                // 最多显示12张图片
                if(data.arr[i].pictureList.length > 12){
                
                };
            };
        };

        var html=template("list_script",data);
        if(type ==0){
            $("#list").empty().append(html);
        }else{
            $("#list").append(html);
        };
    }else{
        console.log(res.info);
    };
};


// 取消内容置顶
function growthCancelSticky_port(messageId) {
    var data={
            messageId:messageId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthCancelSticky,param,growthCancelSticky_callback);
};
function growthCancelSticky_callback(res) {
    if(res.code=200){
        growthList_port(user.classId,0,$("#label >span.active").attr("data-id"),0);
    };
};

//文档高度
function getDocumentTop() {
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if (document.body) {
        bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

//可视窗口高度
function getWindowHeight() {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

//滚动条滚动高度
function getScrollHeight() {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
};

// niceScroll滚动条
function chooseNiceScroll(AA,color) {
    $(AA).niceScroll({ 
        cursorcolor: color || "#ccc",//#CC0071 光标颜色 
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
        cursorwidth: "5px", //像素光标的宽度 
        cursorborder: "0", //     游标边框css定义 
        cursorborderradius: "5px",//以像素为光标边界半径 
        autohidemode: false //是否隐藏滚动条 
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
                browse_button: 'addBtn',         // 上传选择的点选按钮，必需
                uptoken: user.upToken1, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: httpUrl.path_img,     // bucket域名，下载资源时用到，必需
                max_file_size: '1024mb',             // 最大文件体积限制
                multi_selection: true,              // 多选上传
                max_retries: 3,                     // 上传失败最大重试次数
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FileUploaded': function(up, file, info) {
                        var data={
                                md5:JSON.parse(info.response).key,
                                path_img:httpUrl.path_img
                        };
                        var html=template("picMain01_script",data);
                        $("#upload ul.picBody").append(html);
                        $("#addBtn").parent(".uploadBg").addClass("hide").find("#addBtn >div").remove();
                        $("#upload .addBtn01").removeClass("hide");
                        isMaxNum();// 判断是否超过40张
                    },
                    'Error': function(up, err, errTip) {
                            console.log(errTip);
                    }
                }
            });
    };
};

// 判断是否超过40张
function isMaxNum() {
    $(".maxNum >span").text($("#upload .picBody >li.active").length);
    if($("#upload .picBody >li.active").length >40){
        $(".maxNum >span").addClass("active");   
    }else{
        $(".maxNum >span").removeClass("active"); 
    }
};

// 图片放大 轮播
function carousel() {
    // 帖子列表图片 查看
    $("#list").on("click",".pictureList >li > a.pic",function () {
        $(".deleteBtn01").addClass("hide");
        var arr=[];
        var curPic=$(this).attr("data-pic");
        for(var i=0;i<$(this).parents(".pictureList").find("li").length;i++){
            arr.push($(this).parents(".pictureList").find("li").eq(i).attr("data-pic"));
        };
        console.log(arr);
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

    // 新增 图片查看
    $("#picListUl").on("click","li > a.pic",function () {
        $(".deleteBtn01").removeClass("hide");
        var arr=[];
        var curPic=$(this).attr("data-pic");
        for(var i=0;i<$(this).parents("#picListUl").find("li").length;i++){
            arr.push($(this).parents("#picListUl").find("li").eq(i).attr("data-pic"));
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
        $("#picListUl >li[data-pic="+cur+"]").remove();
    });

    
    // 前一张
    $("#modal-dialog-img .prevBtn").click(function () {
        var cur=$(this).next("#carousel_img").find("img").attr("data-curpic");
        var arr=JSON.parse($(this).attr("data-arr"));
        if(arr.indexOf(cur) >0){
            var newCur=arr[arr.indexOf(cur)-1];
            if(arr.indexOf(cur)-1 == 0){
                $("#carousel_img").prev(".prevBtn").addClass("hide");
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            }else{
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
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            }else{
                $("#carousel_img >img").attr("data-curpic",newCur).attr("src",httpUrl.path_img+newCur+"");
            };
        };

        if(arr.indexOf(cur)== 0){
            $("#carousel_img").prev(".prevBtn").removeClass("hide");
        }
    });
};

// 数组去重
function distinct(arr) {
    var obj = {},
        i = 0,
        len = 0;
    if (Array.isArray(arr) && arr.length > 0) {
        len = arr.length;
        for (i = 0; i < len; i += 1) {
            obj[arr[i]] = arr[i];
        }
        return Object.keys(obj);
    }
    return [];
};

// window resize
function windowResize() {
    var w=document.body.clientWidth;
    var h=w*620/1920;
    if(h >500){
        $(".carousel-inner > .item img").css("height",h);
    }else{
        $(".carousel-inner > .item img").css("height",500);   
    };
};