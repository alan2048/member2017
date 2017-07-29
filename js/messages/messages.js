$(function () {
    init();
});
function init() {
    menu();
    loadFiles();

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

    // 阅读人详情
    $("#tableBox").on("click","tbody >tr >td.email-sender.read",function () {
        noticeGetReadDetail_port($(this).attr("data-contentid"));
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
        $("#person").attr("data-toclasses","").attr("data-topersons","");
        $("#carousel >li:not(.addPic)").remove();
        $("#content01").removeClass("hide").find("input[type=text]").val("");
        $("#content01").find("textarea").val("");
        $("#allInput").prop("checked",false);
        $(".right").removeClass("active all num empty").text("");
        $(".childPic").removeClass("active");
        $(".need").removeClass("empty");
        $(".newNumBtn > span").text("0");
    });

    // 新增图层返回主界面
    $(".closeBtn").click(function () {
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });
    
    $("#new").click(function () {
        ValidateInput();
        if($(".need").hasClass("empty")){
            toastTip("提示","红色框为必填项。。");
        }else{
            if($("#newUrl").val() || $("#newContent").val())
            noticeAddNew_port();
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
};



// 验证input输入
function ValidateInput() {
    if(!$(".need").val()){
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
/*function isURL(str_url){ 
      var strRegex = "^((https|http|ftp|rtsp|mms)?://)"  
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@  
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
        + "|" // 允许IP和DOMAIN（域名） 
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
        + "[a-z]{2,6})" // first level domain- .com or .museum  
        + "(:[0-9]{1,4})?" // 端口- :80  
        + "((/?)|" // a slash isn't required if there is no file name  
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";  
        var re=new RegExp(strRegex);  
        if (re.test(str_url)){ 
           return (true);  
        }else{  
           return (false);  
        } 
}; */







// 获取某个公告内容列表
function noticeGetContentList_port(pageNum) {
    var data={
            noticeId:user.noticeId,
            pageNum:pageNum || 1,
            uuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.noticeGetContentList,param,noticeGetContentList_callback);
};
function noticeGetContentList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;
        for(var i=0;i<data.noticeContents.length;i++){
            data.noticeContents[i].time=new Date(data.noticeContents[i].time*1000).Format("yyyy-MM-dd");
            data.noticeContents[i].json=JSON.stringify(data.noticeContents[i]);
        };
        
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);

        // 渲染分页
        $("#pagination").pagination({
            items: data.TotalMsgs,
            itemsOnPage: data.CountPerPage,
            currentPage: data.NowPage,
            cssStyle: '',
            onPageClick: function (pageNumber, event) {
                noticeGetContentList_port(pageNumber);
            }
        });
    };
};

// 获取某条公告内容阅读详情
function noticeGetReadDetail_port(contentId) {
    var data={
            noticeId:user.noticeId,
            contentId:contentId,
            uuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.noticeGetReadDetail,param,noticeGetReadDetail_callback);
};
function noticeGetReadDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;
        var html=template("detailRead_script",data);
        $("#detailRead").empty().append(html);
        chooseNiceScroll("#modal-read .modal-content");
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
        noticeGetContentList_port($("#pagination >li.active >span.current:not(.prev,.next)").text());
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
            tempId:new Date().getTime(),
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
    console.log(data);
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.noticeAddNew,param,noticeAddNew_callback);
};
function noticeAddNew_callback(res) {
    if(res.code==200){
        noticeGetContentList_port($("#pagination >li.active >span.current:not(.prev,.next)").text());
        $(".closeBtn").click();
    };
};

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
                data.arr[i].current=true;
                title=data.arr[i].name;
            }else{
                data.arr[i].current=false;
            };

            // 判断是否url自带参数
            if(data.arr[i].url.indexOf("?") >=0){
                data.arr[i].search=true;
            }else{
                data.arr[i].search=false;
            }
        };

        // 动态title
        $("title").text(title);
        $(".pageTitle:not(.detail)").text(title);
        $(".pageTitle.detail").html(title+"<small>新增</small>");

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
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading

        noticeGetDesc_port();
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

// 公告noticeId获取接口
function noticeGetDesc_port() {
    var data={
            noticeMarkId:GetQueryString("noticeMarkId"),
            uuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.noticeGetDesc,param,noticeGetDesc_callback);
};
function noticeGetDesc_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        user.noticeId=data.id;
        noticeGetContentList_port(); // 获取某个公告内容列表
    };
};