$(function () {
    menu();
    init();
});
function init() {
    // 消息为空的预览图
    $('#prevBg >span').on('click',function () {
        $("#newTitle").val('').removeClass('empty');
        $('.newNumBtn >span').text('0');
        $("#person").removeClass('empty');
        $('#personBox').empty();

        $('.content').addClass('hide');
        $('#content01').removeClass('hide').find(".pageTitle >small").text("新建消息").attr("data-lineid",""); 
    });

    // 新建消息
    $("#buttonBox").on("click","#newBtn",function () {
        $(".need").val('').removeClass('empty');
        $('.newNumBtn >span').text('0');
        $('#addPicBtn').css("background","").removeClass('empty').attr("data-pic","").parent().removeClass("pic");

        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-id","");
    });

    // 编辑老师按钮
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");
        }else{
            $(".need").val('').removeClass('empty');
            $('.newNumBtn >span').text('0');
            $('#addPicBtn').css("background","").removeClass('empty').attr("data-pic","").parent().removeClass("pic");

            $(".content").addClass("hide");
            $('#content01').removeClass('hide').find(".pageTitle >small").text("编辑").attr("data-id",$('.fa-check-square-o').attr('data-id'));
            discoverKnowledgeDetail_port($('.fa-check-square-o').attr('data-id'));
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
                        discoverKnowledgeRemove_port();
                    };
            });
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
                    discoverKnowledgeList_port();
                };
        });
    });

    // 新增设备
    $("#new").on('click','span:last-of-type',function () {
        if($('#addPicBtn').attr('data-pic')){
            $('#addPicBtn').removeClass('empty');
        }else{
            $('#addPicBtn').addClass('empty');
            toastTip('提示','封面为必填项');
        };

        if($('#newTitle').val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"")){
            $('#newTitle').removeClass('empty');
        }else{
            $('#newTitle').addClass('empty');
            toastTip('提示','知识标题为必填项');
        };

        if($('#url').val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"")){
            var aa=isURL($("#url").val());
            if(aa){
                $("#url").removeClass('empty');
            }else{
                $("#url").addClass('empty');
                toastTip('提示','链接网址格式不对,请重新输入');
            };
        }else{
            $('#url').addClass('empty');
            toastTip('提示','链接网址为必填项');
        };

        if(!$('#newTitle').hasClass('empty') && !$('#url').hasClass('empty') && !$('#addPicBtn').hasClass('empty')){
            discoverKnowledgeAdd_port();
        }
    });

    $(".deleteBtn").on('click',function () {
        $(this).prev().css("background","").attr("data-pic","").parent().removeClass("pic");
    });

    $("#tableBox").on("click","tbody >tr >td.num",function () {
        $(this).toggleClass("active").find("i").toggleClass("fa-check-square-o fa-square-o").parents("tr").toggleClass("active").siblings().removeClass('active').find('td').removeClass('active').find('i').removeClass("fa-check-square-o").addClass("fa-square-o");
        if($(this).parents("tbody").find("tr.active").length !=0){
            $("#deleteBtn,#editBtn").removeClass("disable");
        }else{
            $("#deleteBtn,#editBtn").addClass("disable");
        }
    });

    $("#tableBox").on("click",".email-sender:not(.email-date)",function () {
        var url=$(this).parent().attr("data-url");
        if(url.search(/http/) <0){
            window.open("http://"+$(this).parent().attr("data-url"));
        }else{
            window.open($(this).parent().attr("data-url"));
        };
    });
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

// 获得消息列表
function discoverKnowledgeList_port(pageNum) {
    var data={
            pageNumber:pageNum || 1,
            pageSize:20
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.discoverKnowledgeList,param,discoverKnowledgeList_callback);
};
function discoverKnowledgeList_callback(res) {
    if(res.code==200){
        loadingOut();//关闭loading
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;

        $('.content').addClass('hide');
        if(data.list.length ==0){
            $('#contentPrev').removeClass('hide');
        }else{
            $('#content').removeClass('hide');
        };

        for(var i=0;i<data.list.length;i++){
            data.list[i].createTime01=new Date(data.list[i].createDate*1000).Format("yyyy-MM-dd hh:mm");
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
                discoverKnowledgeList_port(pageNumber);
            }
        });
    };
};

// 新建消息
function discoverKnowledgeAdd_port() {
    var data={
            cover:$('#addPicBtn').attr("data-pic"),
            id:$("#content01 .pageTitle >small").attr("data-id") || 0,
            name:$('#newTitle').val(),
            url:$('#url').val()    
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.discoverKnowledgeAdd,param,discoverKnowledgeAdd_callback);
};
function discoverKnowledgeAdd_callback(res) {
    if(res.code==200){
        toastTip("提示",'保存知识成功');
        discoverKnowledgeList_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 发现第三方链接详情
function discoverKnowledgeDetail_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.discoverKnowledgeDetail,param,discoverKnowledgeDetail_callback);
};
function discoverKnowledgeDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#url").val(data.url);
        $("#newTitle").val(data.name);
        $(".newNumBtn span").text(data.name.length);

        var imgUrl=httpUrl.path_img+data.cover+"-scale200";
        $("#addPicBtn").css({
            "background":"transparent url("+imgUrl+") center center no-repeat",
            "background-size":"contain"
        });

        $("#addPicBtn").removeClass("empty").empty().attr('data-pic',data.cover).parent().addClass('pic');
    }else{
        toastTip("提示",res.info);
    };
};

// 删除消息
function discoverKnowledgeRemove_port() {
    var data={
            id:$('#tableBox .fa-check-square-o').attr('data-id')
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.discoverKnowledgeRemove,param,discoverKnowledgeRemove_callback);
};
function discoverKnowledgeRemove_callback(res) {
    if(res.code==200){
        discoverKnowledgeList_port();
    }else{
        toastTip("提示",res.info);
    };
};

// Row行选择函数
function chooseRow() {
    chooseNiceScroll("#tableBox");
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
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

        loadFiles();
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

        discoverKnowledgeList_port();
    };
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
                browse_button: 'addPicBtn',         // 上传选择的点选按钮，必需
                uptoken: user.upToken1, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: httpUrl.path_img,     // bucket域名，下载资源时用到，必需
                max_file_size: '1024mb',             // 最大文件体积限制
                multi_selection: true,              // 多选上传
                max_retries: 3,                     // 上传失败最大重试次数
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                filters : {
                    max_file_size : '1024mb',
                    prevent_duplicates: false,
                    mime_types: [
                        {title : "Image files", extensions : "jpg,jpeg,bmp,gif,png"} // 限定jpg,gif,png后缀上传
                    ]
                },
                init: {
                    'FileUploaded': function(up, file, info) {
                        var data={
                                md5:JSON.parse(info.response).key,
                                path_img:httpUrl.path_img
                        };
                        var imgUrl=data.path_img+data.md5+"-scale200";
                        $("#addPicBtn").css({
                            "background":"transparent url("+imgUrl+") center center no-repeat",
                            "background-size":"contain"
                        });

                        $("#addPicBtn").removeClass("empty").empty().attr('data-pic',data.md5).parent().addClass('pic');
                        $('.qiniuBar').remove();
                        
                    },
                    'BeforeUpload': function(up, file) {// 每个文件上传前，处理相关的事情
                        $("body").append("<span class='qiniuBar'></span>");
                    },
                    'UploadProgress': function(up, file) {// 进度条
                        $(".qiniuBar").width(file.percent + "%");
                    },
                    'Error': function(up, err, errTip) {
                        console.log(errTip);
                    }
                }
            });
    };
};
