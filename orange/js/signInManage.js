$(function () {
    menu();
    init();
});
function init() {
    // 签到卡为空的预览图
    $('#prevBg >span').on('click',function () {
        $("#newTitle").val('').removeClass('empty');
        $("#person").val('').attr('data-id','').removeClass('empty');

        $('.content').addClass('hide');
        $('#content01').removeClass('hide').find(".pageTitle >small").text("新建签到卡").attr("data-lineid",""); 
    });

    // 新建签到卡
    $("#buttonBox").on("click","#newBtn",function () {
        $("#newTitle").val('').removeClass('empty');
        $("#person").val('').attr('data-id','').removeClass('empty');

        $('.content').addClass('hide');
        $('#content01').removeClass('hide').find(".pageTitle >small").text("新建签到卡").attr("data-lineid","");
    });

    // 编辑老师按钮
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");
        }else{
            $("#newTitle").val('').removeClass('empty');
            $("#person").val('').attr('data-id','').removeClass('empty');

            $('.content').addClass('hide');
            $('#content01').removeClass('hide').find(".pageTitle >small").text("编辑签到卡").attr("data-lineid",$('.fa-check-square-o').attr('data-id'));
            orangeCardDetail_port($('.fa-check-square-o').attr('data-id'));
        };
    });

    // 删除老师按钮
    $("#buttonBox").on("click","#deleteBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择删除项。。");   
        }else{
            swal({
                title: "是否删除此签到卡？",
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
                        orangeCardRemove_port();
                    };
            });
        };
    });

    // 添加班级人员控件
    $("#person").click(function () {
        orangeStudentCardAll_port($("#person").attr('data-id'));
    });

    addClassFn();
};

function addClassFn() {
    // 选择新增学生 单选
    $("#classBox").on('click','.child:not(.disable)',function () {
        $('.child:not(.disable)').not(this).removeClass('active');
        $('.right').removeClass("empty all num active").text("");
        $(this).toggleClass('active'); 
    });

    // 选择班级
    $("#classBox").on('click','.right',function (e) {
        $(this).removeClass("num").toggleClass("active all").text("");
        if($(this).hasClass("active")){
            $(this).parents(".class").find(".child:not(.disable)").addClass("active");
        }else{
            $(this).parents(".class").find(".child:not(.disable)").removeClass("active");
        }

        var n=$('.child:not(.disable):not(.active)').length;
        var m=$('.child:not(.disable)').length;
        if(n !=0){
            $('#allInput').removeClass('active');
        }else if(m ==$('.child:not(.disable).active').length){
            $('#allInput').addClass('active');
        }
        e.stopPropagation();
    });

    // 全选
    $("#classBox").on('click','#allInput',function () {
        $(this).toggleClass('active');
        if($(this).hasClass("active")){
            $("#classBox .right").addClass('active').removeClass('num').text('');
            $("#classBox .child:not(.disable)").addClass('active');
        }else{
            $("#classBox .right").removeClass('active').text('');
            $("#classBox .child:not(.disable)").removeClass('active');
        }
    });

    // 关闭
    $("#classBox").on('click','#cancel',function () {
        $("#modal-class").modal("hide"); 
    });

    // 单选学生确定
    $("#classBox").on('click','#save',function () {
        if($('.child:not(.disable).active').length !=0){
            $("#person").val($('.child:not(.disable).active').attr('data-name')).attr('data-id',$('.child:not(.disable).active').attr('data-id')).removeClass('empty');
        }else{
            if(!$("#person").val()){
                $("#person").addClass('empty');
            }else{
                $("#person").removeClass('empty');
            };
        };
        $("#modal-class").modal('hide');
    });

    // 验证标题字数
    $(".newBox #newTitle").keyup(function () {
        if($(this).val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"").length ==0){
            $(this).addClass("empty");
        }else{
            $(this).removeClass("empty");
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

    // 新增线路
    $("#new").on('click','span:last-of-type',function () {
        if($('#newTitle').val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"")){
            $('#newTitle').removeClass('empty');
        }else{
            $('#newTitle').addClass('empty');
            toastTip('提示','卡号名称为必填项');
        };
        if($('#person').val()){
            $('#person').removeClass('empty');
        }else{
            $('#person').addClass('empty');
            toastTip('提示','学生为必填项');
        };
        if($('#newTitle').val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"") && $('#person').val()){
            orangeCardAddOrUpdate_port();
        }
    });
        
};

// 获得幼儿所在班级列表
function orangeStudentCardAll_port(obj) {
    var data={
            id:$('.pageTitle small').attr('data-lineid') || 0
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeStudentcardCheck,param,orangeStudentCardAll_callback,obj);
};
function orangeStudentCardAll_callback(res,obj) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};

        $("#modal-class").modal("show"); 
        var html=template("classBox_script",data);
        $("#classBox").empty().append(html);

        if(obj){
            $(".child[data-id="+obj+"]").addClass('active');// 静态选取学生
        };
        
        chooseNiceScroll("#classBox");
    }else{
        toastTip('提示',res.info);
    };
};

// 获得签到卡列表
function orangeStudentCardList_port(pageNum) {
    var data={
            pageNumber:pageNum || 1,
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
        if(data.list.length ==0){
            $('#contentPrev').removeClass('hide');
        }else{
            $('#content').removeClass('hide');
        };
        
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        chooseRow();
        
        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRow,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNumber,
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
            id:$('#content01').find(".pageTitle >small").attr('data-lineid') || 0,
            cardId:$('#newTitle').val(),
            studentUuid:$("#person").attr('data-id'),
            studentName: $("#person").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeCardAddOrUpdate,param,orangeCardAddOrUpdate_callback);
};
function orangeCardAddOrUpdate_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        toastTip("提示",'保存签到卡成功');
        orangeStudentCardList_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 删除签到卡
function orangeCardRemove_port() {
    var data={
            id:$('#tableBox td.current >.fa-check-square-o').attr('data-id')
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

// 获取线路详情
function orangeCardDetail_port(id) {
    var data={
            id: id  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeCardDetail,param,orangeCardDetail_callback);
};
function orangeCardDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#newTitle").val(data.cardId).removeClass('empty');
        $("#person").val(data.studentName).attr('data-id',data.studentUuid);
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
        orangeStudentCardList_port();
    };
};
