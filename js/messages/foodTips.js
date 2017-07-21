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
        }else{
            noticeReaded_port($(this).parent().attr("data-contentid"));
            window.open($(this).parent().attr("data-url"));
        };
    });

    // 是否已阅读
    $("#tableBox").on("click","tbody >tr >td.email-sender.read",function () {
        noticeGetReadDetail_port($(this).attr("data-contentid"));
    });

    // 新增
    $("#buttonBox").on("click","#newBtn",function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-useruuid","");
        $("#content01").find("input[type=text]").val("");
        $("#content01").find("input[type=checkbox]:checked").prop("checked",false);
    });

    // 新增图层返回主界面
    $(".closeBtn").click(function () {
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });

    // 编辑老师按钮
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");
        }else{
            teacherSingleStaffInfo_port();
        };
    });

    // 验证keyup去除必填项
    $("#userName,#birthday").keyup(function () {
        if(!$(this).val()){
            $(this).addClass("empty");
        }else{
            if($(this).val().length >20){
                $(this).addClass("empty");
                toastTip("提示","姓名最长为20字。。");
            }else{
                $(this).removeClass("empty");
            };
        };
    });
    
    $("#phoneNum").keyup(function () {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        var phone=$("#phoneNum").val();
        if(!reg.test(phone) && phone.length >=11){
            $("#phoneNum").addClass("empty").next("span").removeClass("hide");
        }else{
            $("#phoneNum").removeClass("empty").next("span").addClass("hide");
        };
    });

    // 新增老师按钮
    $("#new").click(function () {
        ValidateInput();
        if($(".newBox .empty").length ==0){
            var text=$("#content01 >.pageTitle >small").text();
            if(text =="新增"){
                teacherAdd_port();
            }else{
                teacherUpdate_port($("#content01 >.pageTitle >small").attr("data-useruuid"));
            };
        }else{
            toastTip("提示","请先填写完整。。");   
        };
    });
};



// 验证input输入
function ValidateInput() {
    if(!$("#userName").val()){
        $("#userName").addClass("empty");
    }else{
        if($("#userName").val().length >20){
            $("#userName").addClass("empty");
            toastTip("提示","姓名最长为20字。。");
        }else{
            $("#userName").removeClass("empty");
        };
    };

    if(!$("#birthday").val()){
        $("#birthday").addClass("empty");
    }else{
        $("#birthday").removeClass("empty");
    };

    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    var phone=$("#phoneNum").val();
    if(!reg.test(phone)){
        $("#phoneNum").addClass("empty").next("span").removeClass("hide");
    }else{
        $("#phoneNum").removeClass("empty").next("span").addClass("hide");
    };
};








// 获取某个公告内容列表
function noticeGetContentList_port(pageNum) {
    var data={
            noticeId:"1",
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
        
        console.log(data);
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        chooseRow();

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
            noticeId:"1",
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
        console.log(data);
    };
};

// 公告置为已读
function noticeReaded_port(contentId) {
    var data={
            noticeId:"1",
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
    };
};

// Row行选择函数
function chooseRow() {
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    $(".table thead tr i").click(function () {
        var aa=$(".table thead tr i").hasClass('fa-check-square-o');
        if(aa){
            $(".table tbody tr i").removeClass('fa-check-square-o').addClass('fa-square-o');
            $(this).removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(".table tbody tr i").removeClass('fa-square-o').addClass('fa-check-square-o');
            $(this).removeClass('fa-square-o').addClass('fa-check-square-o');
        };
        ValidateBtn();
    });
    $(".table tbody tr").click(function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
        };
        ValidateBtn();
    });
};

// 验证编辑删除按钮
function ValidateBtn() {
    var num=$(".table tbody tr i.fa-check-square-o").length;
    if(num ==0){
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    }else if( num ==1){
        $("#editBtn,#deleteBtn").removeClass("disable");
    }else{
        $("#editBtn").addClass("disable");
        $("#deleteBtn").removeClass("disable");
    }
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
        console.log(data);
        data.path_img=httpUrl.path_img;
        $("#user >.userName").text(data.name).attr("data-useruuid",data.userUUID);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / contain"
        });
        loadingOut();//关闭loading

        noticeGetContentList_port(); // 获取某个公告内容列表
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