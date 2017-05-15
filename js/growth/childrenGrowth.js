$(function () {
    init();
});
function init() {
    // 切换班级
    $("#logo .curClass").click(function () {
        growthStudent_port(user.classId);
    });  

    newInit();// 发帖
    listInit();// 帖子列表
};
// 发帖
function newInit() {
    loadFiles();

    chooseNiceScroll("#upload");
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

    // 发帖
    $("#commentNew").click(function () {
        if($("#editor >#input >textarea").hasClass("more")){
            toastTip("提示","最多输入1000字...",2000);
        }else{
            var pictureList=[];
            for(var i=0;i<$("#picListUl >li").length;i++){
                pictureList.push($("#picListUl >li").eq(i).attr("data-pic"))
            };
            var labelList=[];
            if($(".newLabel >span").length==0){
                labelList=[""]
            }else{
                for(var i=0;i<$(".newLabel >span").length;i++){
                    labelList.push($(".newLabel >span").eq(i).attr("data-id"));
                };
            };
        
            var data={
                    childUseruuidList:[],
                    classId:user.classId,
                    content:$("#input >textarea").val(),
                    labelList:labelList,
                    pictureList:pictureList,
                    stickyPost:0,
                    video:0
            };
            console.log(data);
            // growthAdd_port(data);  
        };      
    });
};
// 帖子列表
function listInit() {
    growthLabel_port();
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
        var r=confirm("确定删除吗？");
        if(r == true){
            growthMessageDelete_port(user.classId,$(this).attr("data-messageId"));
        };
    });

    // 删除一条内容
    $("#list").on("click",".praiseBtn",function () {
        growthAddordelete_port(user.classId,$(this).attr("data-messageId"),$(this).attr("data-praiseid"))
    });

    // 删除某一条评论
    $("#list").on("click",".commentDelete",function (e) {
        e.stopPropagation();    
        growthCommentDelete_port(user.classId,$(this).attr("data-messageId"),$(this).attr("data-commentId"))
    });

    // 发表评论 弹框
    $("#list").on("click",".commentBtn",function () {
        $("#list .commentBox[data-messageId="+$(this).attr("data-messageId")+"]").addClass("active").find("textarea").attr("placeholder","评论：").focus();
        $("#list .commentBox[data-messageId="+$(this).attr("data-messageId")+"]").find(".comment").attr("data-cuseruuid","");
    });

    // 回复评论 弹框
    $("#list").on("click",".commentListBox >li",function () {
        if($(this).find(".commentTip").length==1){
            $(this).parents(".commentList").next(".commentBox").addClass("active").find("textarea").attr("placeholder","回复 "+$(this).attr("data-commentUserName")+":").focus();
            $(this).parents(".commentList").next(".commentBox").addClass("active").find(".comment").attr("data-cuseruuid",$(this).attr("data-commentUseruuid"));
        };
    });

    // 新增 回复 评论
    $("#list").on("click",".comment",function () {
        var data={
                classId:user.classId,
                cuseruuid:$(this).attr("data-cuseruuid"),
                messageId:$(this).attr("data-messageId"),
                content:$(this).prev("textarea").val()
        };
        growthCommentAdd_port(data);
    });
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
        $("#newBtn").click();
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
        for(var i=0;i<data.arr.length;i++){
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
        
        var html=template("list_script",data);
        if(type ==0){
            $("#list").empty().append(html);
        }else{
            $("#list").append(html);
        };

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
        console.log(data);
    }else{
        console.log(res.info);
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
        console.log(111222);
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
// 消息提示函数
function toastTip(heading,text,hideAfter) {
    $.toast({
            heading: heading,
            text: text,
            showHideTransition: 'slide',
            icon: 'success',
            hideAfter: hideAfter || 1500,
            loaderBg: '#13b5dd',
            position: 'bottom-right'
    });
};

// 上传图片
function loadFiles() {
        Dropzone.options.myAwesomeDropzone=false;
        Dropzone.autoDiscover=false;
        var myDropzone=new Dropzone('#addBtn',{
            url: httpUrl.picUrl,//84服务器图片
            paramName: "mbFile", // The name that will be used to transfer the file
            maxFilesize: 50, // MB
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        });
        myDropzone.on('success',function(file,responseText){
            if(responseText.uploadFileMd5==undefined){
                alert('没有上传成功,请重试');
                return ;
            };
            // recordUploadSave_port(responseText.uploadFileMd5);
            var data={
                    md5:responseText.uploadFileMd5,
                    path_img:httpUrl.path_img
            };
            var html=template("picMain01_script",data);
            $("#upload ul.picBody").append(html);
            $("#addBtn").parent(".uploadBg").addClass("hide").find("#addBtn >div").remove();
            $("#upload .addBtn01").removeClass("hide");
            isMaxNum();// 判断是否超过40张
            
        });
        myDropzone.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
        });
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