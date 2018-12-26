$(function () {
    menu();
    init();
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

    attendAllStaffList_port();// 获得教职工所在班级列表

    // 获得考勤记录
    $("#year01,#month01").change(function () {
        $("#tableBox01").empty();
        attendLeaveRecordForApproval_port(); 
    });

    // 教师端检查确认
    $("#tableBox01").on("click",".agree,.refuse",function () {
        attendLeaveApproval_port({tleaveUUID:$(this).attr("data-tLeaveuuid"),flag:$(this).attr("data-flag")});
    });

    $("#buttonBox").on("click",".export",function () {
        var data={
                year:$("#year01").val(),
                month:$("#month01").val()
        };
        window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url="+httpUrl.attendExportLeaveApproval+"&params="+JSON.stringify(data));
    });

    // 滚动到底部继续加载数据
    window.onscroll=function () {
        if(getDocumentTop() == (getScrollHeight()-getWindowHeight())){
            if($(".attend").length !=0 && $(".attend").length%20 ==0){
                attendLeaveRecordForApproval_port(parseInt($(".attend").length/20));
            };
        };
    };

    carousel();
};

// 获得教职工所在班级列表
function attendAllStaffList_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendAllStaffList,param,attendAllStaffList_callback);
};
function attendAllStaffList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").empty().append(html);

        attendLeaveRecordForApproval_port();        
        $("#teacherClass").change(function () {
            $("#tableBox01").empty();
            attendLeaveRecordForApproval_port(); 
        });
    };
};

//  获得考勤记录
function attendLeaveRecordForApproval_port(pageNum,type) {
    var data={
            staffUUID:$("#teacherClass").val(),
            pageNum:pageNum || 0,
            year:$("#year01").val(),
            month:$("#month01").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendLeaveRecordForApproval,param,attendLeaveRecordForApproval_callback,data.pageNum);
};
function attendLeaveRecordForApproval_callback(res,pageNum) {
    if(res.code==200){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img
        };
        
        if(data.arr.length ==0){
            if(pageNum ==0){
                $("#tableBox01").empty().addClass("empty");
            }
        }else{
            $("#tableBox01").removeClass("empty");
            for(var i=0;i<data.arr.length;i++){
                data.arr[i].leaveDateArr=data.arr[i].leaveDateStr.split("|");
            };
            var html=template("tableBox01_script",data);
            $("#tableBox01").append(html);
            chooseNiceScroll(".attendBox");
        }
    };
};

// 教师端检查确认
function attendLeaveApproval_port(json) {
    var data={
            tleaveUUID:json.tleaveUUID,
            flag:json.flag
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.attendLeaveApproval,param,attendLeaveApproval_callback);
};
function attendLeaveApproval_callback(res) {
    if(res.code==200){
        $("#tableBox01").empty();
        attendLeaveRecordForApproval_port(); 
    }else{
        toastTip("提示",res.info);
    };
};

function carousel() {
    // 帖子列表图片 查看
    $("#main").on("click","a.pic",function () {
        var arr=[];
        var curPic=$(this).attr("data-pic");
        for(var i=0;i<$(this).parents('#picBox').find('.pic').length;i++){
            arr.push($(this).parents('#picBox').find('.pic').eq(i).attr("data-pic"));
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
    }else if(res.code =404){
        // window.location.href=path;
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
        $("#user >.userName").text(data.name);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
        basicButton_port();
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
    };
};