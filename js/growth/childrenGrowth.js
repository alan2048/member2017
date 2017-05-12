$(function () {
    init();
});
function init() {
    growthLabel_port();

    // 点击标签 切换list内容
    $("#label").on("click","span",function () {
        $(this).addClass("active").siblings().removeClass("active");
        growthList_port(user.classId,0,$("#label >span.active").attr("data-id"),0);
    });

    // 切换班级
    $("#logo .curClass").click(function () {
        growthStudent_port(user.classId);
    });  

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

    // 发表评论
    $("#list").on("click",".commentBtn",function () {
        $("#list .commentBox[data-messageId="+$(this).attr("data-messageId")+"]").addClass("active").find("textarea").attr("placeholder","评论：").focus();
        $("#list .commentBox[data-messageId="+$(this).attr("data-messageId")+"]").find(".comment").attr("data-cuseruuid","");
    });

    // 回复评论
    $("#list").on("click",".commentListBox >li",function () {
        $(this).parents(".commentList").next(".commentBox").addClass("active").find("textarea").attr("placeholder","回复 "+$(this).attr("data-commentUserName")+":").focus();
        $(this).parents(".commentList").next(".commentBox").addClass("active").find(".comment").attr("data-cuseruuid",$(this).attr("data-commentUseruuid"));
    });

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
        $("#label").empty().append(html);
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
            if($("#list .commentList[data-messageId="+json.messageId+"] li").length ==1){
                $("#list .commentList[data-messageId="+json.messageId+"]").empty();
            }else{
                $("#list .commentList[data-messageId="+json.messageId+"] li[data-commentId="+json.commentId+"]").remove();
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
                path_img:httpUrl.path_img
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