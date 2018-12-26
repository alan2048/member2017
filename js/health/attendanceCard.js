$(function () {
    menu();
    init();
});
function init() {
    // 绑定按钮
    $("#tableBox").on("click",".editIcon",function () {
        if($(this).hasClass("current")){
            $("#newTitle").val('');
            $("#person").val($(this).parents("tr").attr("data-childname")).attr('data-uuid',$(this).parents("tr").attr("data-childuuid"));

            $('.content').addClass('hide');
            $('#content01').removeClass('hide');
            $("#newTitle").removeClass('empty').focus();
        }else{
            toastTip("提示","请先解除绑定。"); 
        };
    });

    // 删除老师按钮
    $("#tableBox").on("click",".deleteIcon",function () {
        if(!$(this).hasClass("current")){
            toastTip("提示","此学生暂未绑卡，无需解除绑定。");   
        }else{
            var id=$(this).parents("tr").attr("data-cardid");
            swal({
                title: "确认解除绑定？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e15d5d",
                confirmButtonText: "解除",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        orangeCardRemove_port(id);
                    };
            });
        };
    });

    // 返回上一级
    $("#new").on('click','span:first-of-type',function () {
        swal({
            title: "您还未保存，确定退出吗？",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e15d5d",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: true,
            closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    orangeStudentCardList_port();
                };
        });
    });

    // 新增考勤卡
    $("#new").on('click','span:last-of-type',function () {
        if($('#newTitle').val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"")){
            $('#newTitle').removeClass('empty');
        }else{
            $('#newTitle').addClass('empty');
            toastTip('提示','卡号为必填项');
        };
        if($('#newTitle').val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"") && $('#person').val()){
            orangeCardAddOrUpdate_port();
        }
    });

    $("#searchBtn").click(function () {
        orangeStudentCardList_port();
    });

    $(".clear").click(function () {
        $(this).prev().val("");
    });
};

// 获得签到卡列表
function orangeStudentCardList_port(pageNum) {
    var curPage=$("#pagination >li.active >span.current:not(.prev, .next)").text();
    var data={
            classUUID:$("#teacherClass").val(),
            pageNum:pageNum || curPage || 1,
            pageSize:20
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeStudentCardList,param,orangeStudentCardList_callback);
};
function orangeStudentCardList_callback(res) {
    if(res.code==200){
        loadingOut();//关闭loading
        var data=JSON.parse(res.data);
        $('.content').addClass('hide');
        $('#content').removeClass('hide');
        
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        chooseRow();
        
        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRecord,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNum,
            cssStyle: '',
            onPageClick: function (pageNumber, event) {
                orangeStudentCardList_port(pageNumber);
            }
        });
    };
};

// 新建签到卡
function orangeCardAddOrUpdate_port() {
    var data={
            cardID:$('#newTitle').val(),
            userUUID:$("#person").attr('data-uuid')
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeCardAddOrUpdate,param,orangeCardAddOrUpdate_callback);
};
function orangeCardAddOrUpdate_callback(res) {
    if(res.code==200){
        $('.content').addClass('hide');
        $('#content').removeClass('hide');
        toastTip("提示",'保存考勤卡成功');
        orangeStudentCardList_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 删除签到卡
function orangeCardRemove_port(id) {
    var data={
            cardID:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeCardRemove,param,orangeCardRemove_callback);
};
function orangeCardRemove_callback(res) {
    if(res.code==200){
        orangeStudentCardList_port();
    }else{
        toastTip("提示",res.info);
    };
};

// Row行选择函数
function chooseRow() {
    chooseNiceScroll("#tableBox");
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏

    $("#tableBox .table.table-email tbody tr >td.email-sender").on({
        mouseover:function () {
            $(this).addClass("active").siblings().addClass("active");
        },
        mouseout:function () {
            $(this).removeClass("active").siblings().removeClass("active");
        },
        click:function (e) {
            $(this).parent().siblings().find("td").removeClass("current");
            $(this).toggleClass("current").siblings().toggleClass("current");

            var aa=$(this).parent().find('i').hasClass('fa-check-square-o');
            if(aa){
                $(this).parent().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
                $(this).parent().siblings().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            }else{
                $(this).parent().find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
                $(this).parent().siblings().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            };
            ValidateBtn(); 
        }
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
    }else if(res.code ==404){
        toastTip("提示",res.info,1500,function () {
            window.location.href="../../index.html";
        });
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
        basicAllClassInfo_port();
    };
};

// 获得登录人所在学校所有班级列表
function basicAllClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicAllClassAndTeacherGroupInfo,param,basicAllClassInfo_callback);
};
function basicAllClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html01=template("teacherClass_script",data);
        $("#teacherClass").append(html01);
        orangeStudentCardList_port();
        $("#teacherClass").change(function () {
            orangeStudentCardList_port();
        });
    };
};