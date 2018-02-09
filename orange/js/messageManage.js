$(function () {
    menu();
    init();
});
function init() {
    orangeStudentCardList_port();

    // 路线为空的预览图
    $('#prevBg >span').on('click',function () {
        $("#newTitle").val('').removeClass('empty');
        $('.newNumBtn >span').text('0');
        $('#personBox').empty();
        $('#curStudent').val('').attr('data-id','');
        $('#curAddress').val('').attr('disabled',true);

        $('.content').addClass('hide');
        $('#content01').removeClass('hide').find(".pageTitle >small").text("新建路线").attr("data-lineid",""); 
    });

    // 新建路线
    $("#buttonBox").on("click","#newBtn",function () {
        $("#newTitle").val('').removeClass('empty');
        $('.newNumBtn >span').text('0');
        $('#personBox').empty();
        $('#curStudent').val('').attr('data-id','');
        $('#curAddress').val('').attr('disabled',true);

        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新建路线").attr("data-lineid","");
    });

    // 编辑老师按钮
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");
        }else{
            $("#newTitle").val('').removeClass('empty');
            $('.newNumBtn >span').text('0');
            $('#personBox').empty();
            $('#curStudent').val('').attr('data-id','');
            $('#curAddress').val('').attr('disabled',true);

            $('.content').addClass('hide');
            $('#content01').removeClass('hide').find(".pageTitle >small").text("编辑路线").attr("data-lineid",$('.fa-check-square-o').attr('data-id'));
            orangeLinesDetail_port($('.fa-check-square-o').attr('data-id'));
        };
    });

    // 删除老师按钮
    $("#buttonBox").on("click","#deleteBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择删除项。。");   
        }else{
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
                        orangeLinesRemove_port();
                    };
            });
        };
    });

    // 添加班级人员控件
    $("#person").click(function () {
        var arr=[];
        for(var i=0;i<$('.student').length;i++){
            arr.push($('.student').eq(i).attr('data-id'))
        };
        orangeStudentList_port(arr);
    });

    addClassFn();
};

function addClassFn() {
    // 选择新增学生
    $("#classBox").on('click','.child:not(.disable)',function () {
        $(this).toggleClass('active'); 

        var num=$(this).parents(".children").find(".child.active").length;
        var allNum=$(this).parents(".children").find(".child:not(.disable)").length;
        if(num ==0){
            $(this).parents(".children").prev(".classTitle").find(".right").removeClass("empty all num active").text("");
        }else if(num ==allNum){
            $(this).parents(".children").prev(".classTitle").find(".right").addClass("all active").text("");
        }else{
            $(this).parents(".children").prev(".classTitle").find(".right").addClass("num active").removeClass("empty all").text(num);
        };

        var n=$('.child:not(.disable):not(.active)').length;
        var m=$('.child:not(.disable)').length;
        if(n !=0){
            $('#allInput').removeClass('active');
        }else if(m ==$('.child:not(.disable).active').length){
            $('#allInput').addClass('active');
        }
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

    // 多选学生确定
    $("#classBox").on('click','#save',function () {
        orangeAddressSome_port(); 
    });

    // 编辑学生地址
    $('#personBox').on('click','span.student',function () {
        $(this).toggleClass('current').siblings().removeClass('current');
        if($(this).hasClass('current')){
            $('.studentAdd').removeClass('disable01');
            if($(this).hasClass('noaddress')){
                $('#curStudent').val($(this).attr('data-name')).attr('data-id',$(this).attr('data-id'));
                $('#curAddress').val('').attr('disabled',false);
            }else{
                $('#curStudent').val($(this).attr('data-name')).attr('data-id',$(this).attr('data-id'));
                orangeAddressOne_port($(this).attr('data-id'))
            };
        }else{
            $('.studentAdd').addClass('disable01');
            $('#curStudent').val('').attr('data-id','');
            $('#curAddress').val('').attr('disabled',true);
        }
    });

    // 删除学生
    $('#personBox').on('click','span.delBtn',function () {
        $(this).parent().remove();
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

    // 保存地址
    $('#saveAdd').click(function () {
        if($(this).parents('.studentAdd').hasClass('disable01')){
            toastTip('提示','请先选择需编辑学生');
        }else{
            orangeAddressAddOrUpdate_port();
        } 
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
            orangeLinesAddOrUpdate_port();
        }else{
            $('#newTitle').addClass('empty');
            toastTip('提示','线路名称为必填项');
        }
        
    });
        
}

// 获得幼儿所在班级列表
function orangeStudentList_port(arr) {
    var data={
            lineId:$('#content01').find(".pageTitle >small").attr('data-lineid') || 0
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeStudentList,param,orangeStudentList_callback,arr);
};
function orangeStudentList_callback(res,arr) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};

        $("#modal-class").modal("show"); 
        var html=template("classBox_script",data);
        $("#classBox").empty().append(html);

        if(arr.length !=0){
            // 静态选取学生
            for(var i=0;i<arr.length;i++){
                $(".child[data-id="+arr[i]+"]").addClass('active');
            };

            // 显示数量
            for(var i=0;i<$('.right').length;i++){
                var aa=$('.right').eq(i);
                var num=$(aa).parents('.class').find('.child.active').length;
                if(num !=0){
                    if(num ==$(aa).parents('.class').find('.child:not(.disable)').length){
                        $(aa).addClass('active all').text('');
                    }else{
                        $(aa).addClass('active num').text(num);
                    }
                };
            };

            // 显示全选按钮
            var n=$('.child:not(.disable):not(.active)').length;
            var m=$('.child:not(.disable)').length;
            if(n !=0){
                $('#allInput').removeClass('active');
            }else if(m ==$('.child:not(.disable).active').length){
                $('#allInput').addClass('active');
            }
        };
        
        chooseNiceScroll("#classBox");
    };
};

// 获取多个学生地址
function orangeAddressSome_port() {
    var arr=[];
    for(var i=0;i<$('.child:not(.disable).active').length;i++){
        arr.push($('.child:not(.disable).active').eq(i).attr('data-id'));
    };
    if(arr.length ==0){
        toastTip('提示','请先选择学生');
    }else{
        var data={
            studentUuidList:JSON.stringify(arr)
        };
        var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
        };
        initAjax(httpUrl.orangeAddressSome,param,orangeAddressSome_callback); 
    };
};
function orangeAddressSome_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("personBox_script",data);
        $("#personBox").empty().append(html);

        $("#modal-class").modal("hide"); 
    };
};

// 获取一个学生的地址
function orangeAddressOne_port(studentUuid) {
    var data={
            studentUuid:studentUuid
    };
    var param={
        params:JSON.stringify(data),
        loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeAddressOne,param,orangeAddressOne_callback); 
};
function orangeAddressOne_callback(res) {
    if(res.code==200){
        $('#curAddress').val(res.data).attr('disabled',false);
    };
};

// 新增或者编辑学生地址
function orangeAddressAddOrUpdate_port() {
    var data={
            address: $('#curAddress').val(),
            studentUuid:$('#curStudent').attr('data-id')
    };
    var param={
        params:JSON.stringify(data),
        loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeAddressAddOrUpdate,param,orangeAddressAddOrUpdate_callback); 
};
function orangeAddressAddOrUpdate_callback(res) {
    if(res.code==200){
        $('.student.current').removeClass('noaddress');
        toastTip('提示','保存成功');
    }else{
        toastTip('提示',res.info);
    };
};

// 获得路线列表
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
        console.log(data.list);

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

// 新建路线
function orangeLinesAddOrUpdate_port() {
    var arr=[];
    for(var i=0;i<$('.student').length;i++){
        arr.push($('.student').eq(i).attr('data-id'))
    };
    var data={
            lineId:$('#content01').find(".pageTitle >small").attr('data-lineid') || 0,
            name:$('#newTitle').val(),
            userUuidList:JSON.stringify(arr)    
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeLinesAddOrUpdate,param,orangeLinesAddOrUpdate_callback);
};
function orangeLinesAddOrUpdate_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        toastTip("提示",'保存路线成功');
        orangeStudentCardList_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 删除路线
function orangeLinesRemove_port() {
    var data={
            lineId:$('#tableBox td.current >.fa-check-square-o').attr('data-id')
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeLinesRemove,param,orangeLinesRemove_callback);
};
function orangeLinesRemove_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        orangeStudentCardList_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 获取线路详情
function orangeLinesDetail_port(lineId) {
    var data={
            lineId: lineId  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeLinesDetail,param,orangeLinesDetail_callback);
};
function orangeLinesDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#newTitle").val(data.name).removeClass('empty');
        $('.newNumBtn >span').text(data.name.length);

        var data={arr:data.studentVOList};
        var html=template("personBox_script",data);
        $("#personBox").empty().append(html);
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
            $(this).addClass("current").siblings().addClass("current");
            var num=$(this).parent().index()*52+70;
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-210);

            var aa=$(this).find('i').hasClass('fa-check-square-o');
            if(aa){
                $(this).parent().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
                $(this).parent().siblings().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            }else{
                $(this).parent().find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
                $(this).parent().siblings().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            };
            ValidateBtn();

            var data={arr:JSON.parse($(this).parent().attr('data-json'))};
            console.log(data);
            var html=template("tableBox02_script",data);
            $("#tableBox02").empty().append(html);
            chooseNiceScroll("#tableBox02");  
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
    };
};
