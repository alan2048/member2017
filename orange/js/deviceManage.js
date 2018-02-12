$(function () {
    menu();
    init();
});
function init() {
    // 签到卡为空的预览图
    $('#prevBg >span').on('click',function () {
        $("#deviceCode").val('').removeClass('empty');
        $("#deviceName").val('').removeClass('empty');
        $('.newNumBtn >span').text('0');

        $('.content').addClass('hide');
        $('#content01').removeClass('hide').find(".pageTitle >small").text("添加设备").attr("data-lineid",""); 
    });

    // 添加设备
    $("#buttonBox").on("click","#newBtn",function () {
        $("#deviceCode").val('').removeClass('empty');
        $("#deviceName").val('').removeClass('empty');
        $('.newNumBtn >span').text('0');

        $('.content').addClass('hide');
        $('#content01').removeClass('hide').find(".pageTitle >small").text("添加设备").attr("data-lineid","");
    });

    // 编辑老师按钮
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");
        }else{
            $("#deviceCode").val('').removeClass('empty');
            $("#deviceName").val('').removeClass('empty');
            $('.newNumBtn >span').text('0');

            $('.content').addClass('hide');
            $('#content01').removeClass('hide').find(".pageTitle >small").text("编辑签到卡").attr("data-lineid",$('.fa-check-square-o').attr('data-id'));
            orangeEquipmentDetail_port($('.fa-check-square-o').attr('data-id'));
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
                        orangeEquipmentRemove_port();
                    };
            });
        };
    });

     // 验证标题字数
    $("#deviceName").keyup(function () {
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

    // 验证标题字数
    $("#deviceCode").keyup(function () {
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
                    orangeEquipmentList_port();
                };
        });
    });

    // 新增设备
    $("#new").on('click','span:last-of-type',function () {
        if($('#deviceCode').val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"")){
            $('#deviceCode').removeClass('empty');
        }else{
            $('#deviceCode').addClass('empty');
            toastTip('提示','设备码为必填项');
        };
        if($('#deviceName').val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"")){
            $('#deviceName').removeClass('empty');
        }else{
            $('#deviceName').addClass('empty');
            toastTip('提示','设备名称为必填项');
        };
        if(!$('#deviceCode').hasClass('empty') && !$('#deviceCode').hasClass('empty')){
            orangeEquipmentAddOrUpdate_port();
        }
    });
};

// 获得签到卡列表
function orangeEquipmentList_port(pageNum) {
    var data={
            pageNumber:pageNum || 1,
            pageSize:20
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeEquipmentList,param,orangeEquipmentList_callback);
};
function orangeEquipmentList_callback(res) {
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
                orangeEquipmentList_port(pageNumber);
            }
        });
    };
};

// 添加设备
function orangeEquipmentAddOrUpdate_port() {
    var data={
            id:$('#content01').find(".pageTitle >small").attr('data-lineid') || 0,
            name:$('#deviceName').val(),
            rfid:$("#deviceCode").val(),
            type: $("#deviceType").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeEquipmentAddOrUpdate,param,orangeEquipmentAddOrUpdate_callback);
};
function orangeEquipmentAddOrUpdate_callback(res) {
    if(res.code==200){
        toastTip("提示",'设备添加成功');
        orangeEquipmentList_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 删除签到卡
function orangeEquipmentRemove_port() {
    var data={
            id:$('#tableBox td.current >.fa-check-square-o').attr('data-id')
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeEquipmentRemove,param,orangeEquipmentRemove_callback);
};
function orangeEquipmentRemove_callback(res) {
    if(res.code==200){
        orangeEquipmentList_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 获取设备详情
function orangeEquipmentDetail_port(id) {
    var data={
            id: id  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.orangeEquipmentDetail,param,orangeEquipmentDetail_callback);
};
function orangeEquipmentDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#deviceCode").val(data.rfid).removeClass('empty');
        $("#deviceName").val(data.name).removeClass('empty');
        $("#deviceType >option[value="+data.type+"]").prop('selected',true);

        $("#person").val(data.name).attr('data-id',data.studentUuid);
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
        orangeEquipmentList_port();
    };
};
