$(function () {
    init();
});
function init() {
    menu();
    buttonFn();// 按钮功能区
    menuFn();// 右键快捷键
};

// 按钮功能区
function buttonFn() {
    // 面包屑
    $(".breadBox").on("click","span",function () {
        var length=$(".breadBox >span").length;
        var cur=$(this).index();
        if(cur+1 !=length){
            var obj={
                    name:$(this).text(),
                    id:$(this).attr("data-fileuuid")
            };
            fileGetChildFileInfo_port($(this).attr("data-fileuuid"),obj);
        };
    });

    // 返回上级
    $("#breadBack").click(function () {
        $(".breadBox >span").eq($(".breadBox >span").length-2).click(); 
    });

    // 选中文件
    $("#todolist").on("click",".todoName,.col01",function (e) {
        $("span.todoName[data-fileuuid="+$(this).attr("data-fileuuid")+"]").toggleClass("active");
        e.stopPropagation();
    });

    // 单选选中文件
    $("#todolist").on("click",".pic,.todolistBox01 > li.list",function () {
        if($('#tab >span.current').hasClass('tab01')){
            // 列表模式
            if($(this).hasClass("folder")){
                var obj={
                        name:$(this).find('.todoName').attr("data-name"),
                        id:$(this).find('.todoName').attr("data-fileuuid")
                };
                fileGetChildFileInfo_port($(this).find('.todoName').attr("data-fileuuid"),obj);
            }else{
                $("span.todoName[data-fileuuid="+$(this).find(".todoName").attr("data-fileuuid")+"]").toggleClass("active");
            };
        }else{
            // 图标模式
            if($(this).parent(".list").hasClass("folder")){
                var obj={
                        name:$(this).attr("data-name"),
                        id:$(this).attr("data-fileuuid")
                };
                fileGetChildFileInfo_port($(this).attr("data-fileuuid"),obj);
            }else{
                $("span.todoName[data-fileuuid="+$(this).parent(".list").find(".todoName").attr("data-fileuuid")+"]").toggleClass("active");
            };
        };
    });

    // 双击
    $("#todolist").on("dblclick",".pic:not(.folder)",function () {
        var className=$(this).attr("class");
        var num="";
        var arr=["pdf","txt","doc","docx","xls","xlsx","ppt","pptx","zip","rar"];
        for(var i=0;i<arr.length;i++){
            if(className.indexOf(arr[i]) >= 0){
                num="text";
            }
        };

        var arr01=["jpg","jpeg","png","gif","bmp"];
        for(var i=0;i<arr01.length;i++){
            if(className.indexOf(arr01[i]) >= 0){
                num="image";
            }
        };
    
        if(num == "text"){
            downloadUrl1_port($(this).attr('data-md5'),"text");
        }else if(num == "image"){
            downloadUrl1_port($(this).attr('data-md5'),"image");
        }else{
            toastTip("提示","此格式暂不支持预览。。");
        }
    });

    $("#todolist").on("dblclick","#todolistBox01 >.list:not(.folder)",function () {
        var className=$(this).find(".pic").attr("class");
        var num="";
        var arr=["pdf","txt","doc","docx","xls","xlsx","ppt","pptx","zip","rar"];
        for(var i=0;i<arr.length;i++){
            if(className.indexOf(arr[i]) >= 0){
                num="text";
            }
        };

        var arr01=["jpg","jpeg","png","gif","bmp"];
        for(var i=0;i<arr01.length;i++){
            if(className.indexOf(arr01[i]) >= 0){
                num="image";
            }
        };
    
        if(num == "text"){
            downloadUrl1_port($(this).find(".pic").attr('data-md5'),"text");
        }else if(num == "image"){
            downloadUrl1_port($(this).find(".pic").attr('data-md5'),"image");
        }else{
            toastTip("提示","此格式暂不支持预览。。");
        }
    });

    // 下载
    $("#buttonBox").on("click","#download",function () {
        $("iframe").remove();
        var folderLen=$("#todolistBox .todoName.active.folder").length;
        if($("#todolistBox .todoName.active.folder").length !=0){
            toastTip("提示","暂不支持下载文件夹。。",2000);
            $(".todoName.active.folder").removeClass("active");
        };
        
        var num=$("#todolistBox .todoName.active:not(.folder)").length;
        if(num ==0){
            if( folderLen==0){
                toastTip("提示","请先选择下载项。。");
            };
        }else{
            for(var i=0;i<num;i++){
                streamUrl_port($("#todolistBox .todoName.active").eq(i).attr("data-md5"),$("#todolistBox .todoName.active").eq(i).attr("data-name"));
            };
        };
    });

    // 预览
    $("#buttonBox").on({
        mouseover:function () {
            if($(this).find(".hoverBtn").length ==0){
                $(this).find("span").append("<span class=\"hoverBtn\">双击可直接预览</span>")
            };
            $(this).find("span").addClass("current");
        },
        mouseout:function () {
            $(this).find("span").removeClass("current");
        },
        click:function () {
            var num=$("#todolistBox .todoName.active").length;
            if(num ==0){
                toastTip("提示","请先选择预览项。。");
            }else if(num >1){
                toastTip("提示","预览时为单项。。");
                $("#todolistBox .todoName.active").removeClass("active");
            }else{
                if($("#todolistBox .todoName.active").hasClass("folder")){
                    toastTip("提示","暂不支持预览文件夹。。");
                    $("#todolistBox .todoName.active.folder").removeClass("active");
                }else{
                    var className=$("#todolistBox .todoName.active").attr("class");
                    var num="";
                    var arr=["pdf","txt","doc","docx","xls","xlsx","ppt","pptx","zip","rar"];
                    for(var i=0;i<arr.length;i++){
                        if(className.indexOf(arr[i]) >= 0){
                            num="text";
                        }
                    };

                    var arr01=["jpg","jpeg","png","gif","bmp"];
                    for(var i=0;i<arr01.length;i++){
                        if(className.indexOf(arr01[i]) >= 0){
                            num="image";
                        }
                    };
    
                    if(num == "text"){
                        downloadUrl1_port($("#todolistBox .todoName.active").attr('data-md5'),"text");
                    }else if(num == "image"){
                        downloadUrl1_port($("#todolistBox .todoName.active").attr('data-md5'),"image");
                    }else{
                        toastTip("提示","此格式暂不支持预览。。");
                    };            
                };
            };
        }
    },"#preview");

    // 删除
    $("#buttonBox").on("click","#deleteBtn",function () {
        var num=$("#todolistBox .todoName.active").length;
        if(num ==0){
            toastTip("提示","请先选择删除项。。");
        }else{
            swal({
                title: "是否确认删除？",
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
                        for(var i=0;i<$("#todolistBox .todoName.active").length;i++){
                            fileDeleteFileInfo_port($("#todolistBox .todoName.active").eq(i).attr("data-fileuuid"),$("#todolistBox .todoName.active").eq(i).attr("data-parentuuid"));
                        };
                    };
            });
        };
    });

    // 重命名
    $("#buttonBox").on("click","#rename",function () {
        if($("#todolistBox .todoName.active").length==0){
            toastTip("提示","请先选择重命名项。。");
        }else if($("#todolistBox .todoName.active").length >1){
            toastTip("提示","重命名项时为单选。。");
            $("#todolistBox .todoName.active").removeClass("active");
        }else{
            fileGetSingleFileInfo_port($("#todolistBox .todoName.active").attr("data-fileuuid"));
        };
    });

    // 重命名确定
    $("#renameBtn").click(function () {
        if($("#renameInput").val()){
            fileUpdateFileName_port($(this).attr("data-parentuuid"));
        }else{
            toastTip("提示","请先填写文件夹名");
        }
    });

    // 重命名input enter键
    $("#renameInput").keyup(function (e) {
        if(e.which ==13){
            $("#renameBtn").click();
        };
    });


    // 新建文件夹
    $("#buttonBox").on("click","#newFiles",function () {
        $("#newFolderInput").val("");
        $("#modal-newFolder").modal("show");
    });

    // 新建文件夹确定
    $("#newFolderBtn").click(function () {
        if($("#newFolderInput").val()){
            var parentuuid = $(".breadBox >span:last").attr("data-fileuuid");
            var data={
                fileMD5:"91cad243103e3cc6785ee6bcd2a25b01",
                fileName:$("#newFolderInput").val(),
                fileType:"3",
                parentUUID:parentuuid
            };
            var param={
                params:JSON.stringify(data),
                loginId:httpUrl.loginId
            };
            initAjax(httpUrl.fileAddFileInfo,param,fileAddFileInfo_callback,parentuuid);
        }else{
            toastTip("提示","请先填写文件夹名");
        }
    });

    // 新建文件夹input enter键
    $("#newFolderInput").keyup(function (e) {
        if(e.which ==13){
            $("#newFolderBtn").click();
        };
    });

    // 全选
    $("#buttonBox").on("click","#allSelect",function () {
        if($(".todoName.active").length==$(".todoName").length){
            $(".todoName").removeClass("active");
        }else{
            $(".todoName").addClass("active");
        };
    });
    
    // 列表 图标 切换
    $("#tab >span").click(function () {
        $(this).addClass('current').siblings().removeClass('current');
        if($(this).hasClass('tab01')){
            $('.todolistBox').removeClass('current');
            $('.todolistBox01').addClass('current');
        }else{
            $('.todolistBox01').removeClass('current');
            $('.todolistBox').addClass('current');
        }; 
    });
};

// 右键快捷键
function menuFn() {
    document.oncontextmenu=function (e) {return false;};
    document.onclick=function (e) {
        $("#menu").hide();
    };
    $('#content').on('contextmenu',function (e) {
        var menu = document.getElementById("menu");
        var e = e ||window.event;//兼容
        e.cancelBubble = true;
        //判断鼠标坐标是否大于视口宽度-块本身宽度
        var cakLeft = (e.clientX > document.documentElement.clientWidth - menu.offsetWidth)?(document.documentElement.clientWidth - menu.offsetWidth):e.clientX;
        var cakTop = (e.clientY > document.documentElement.clientHeight - menu.offsetHeight)?(document.documentElement.clientHeight - menu.offsetHeight):e.clientY;
        menu.style.left = cakLeft + "px";
        menu.style.top = cakTop + "px";

        $('#copy,#cut').removeClass('active').addClass('default');
        if($('#copy').attr('data-fileuuid') || $('#cut').attr('data-fileuuid')){
            $('#paste').removeClass('default').addClass('active');
        }else{
            $('#paste').removeClass('active').addClass('default');
        };
        $("#menu").attr('data-fileuuid','').show();
    });

    $('#todolist').on('contextmenu','.pic,#todolistBox01 >li.list',function (e) {
        e.stopPropagation();
        var menu = document.getElementById("menu");
        var e = e ||window.event;//兼容
        e.cancelBubble = true;
        //判断鼠标坐标是否大于视口宽度-块本身宽度
        var cakLeft = (e.clientX > document.documentElement.clientWidth - menu.offsetWidth)?(document.documentElement.clientWidth - menu.offsetWidth):e.clientX;
        var cakTop = (e.clientY > document.documentElement.clientHeight - menu.offsetHeight)?(document.documentElement.clientHeight - menu.offsetHeight):e.clientY;
        menu.style.left = cakLeft + "px";
        menu.style.top = cakTop + "px";

        $("#menu").attr('data-fileuuid',$(this).attr('data-fileuuid')).show();
        if($('#copy').attr('data-fileuuid') || $('#cut').attr('data-fileuuid')){
            $('#paste').removeClass('default').addClass('active');
        }else{
            $('#paste').removeClass('active').addClass('default');
        };
        $('#copy,#cut').removeClass('default').addClass('active');
        return false;
    });

    // 复制
    $("#menu").on('click','#copy.active',function () {
        var uuid=$(this).parent().attr('data-fileuuid');
        $(this).attr('data-fileuuid',uuid).siblings().attr('data-fileuuid','').attr('');
        $('li.list').removeClass('opacity');// 复制时去除剪切虚化
    });

    // 剪切
    $("#menu").on('click','#cut.active',function () {
        var uuid=$(this).parent().attr('data-fileuuid');
        $('li.list').removeClass('opacity').filter('[data-fileuuid='+uuid+']').addClass('opacity');// 剪切虚化
        $(this).attr('data-fileuuid',uuid).siblings().attr('data-fileuuid','').attr('');
    });

    // 粘贴
    $("#menu").on('click','#paste.active',function () {
        // 复制粘贴
        if($('#copy').attr('data-fileuuid')){
            if($("#menu").attr('data-fileuuid')){
                if($('#todolistBox .pic[data-fileuuid='+$("#menu").attr('data-fileuuid')+']').hasClass('folder') && $("#menu").attr('data-fileuuid')!=$('#copy').attr('data-fileuuid')){
                    fileCopy_port($('#copy').attr('data-fileuuid'),$("#menu").attr('data-fileuuid'));
                }else{
                    fileCopy_port($('#copy').attr('data-fileuuid'));
                }
            }else{
                fileCopy_port($('#copy').attr('data-fileuuid'));
            };
        };

        // 剪切粘贴
        if($('#cut').attr('data-fileuuid')){
            if($("#menu").attr('data-fileuuid')){
                if($('#todolistBox .pic[data-fileuuid='+$("#menu").attr('data-fileuuid')+']').hasClass('folder') && $("#menu").attr('data-fileuuid')!=$('#copy').attr('data-fileuuid')){
                    fileCut_port($('#cut').attr('data-fileuuid'),$("#menu").attr('data-fileuuid'));
                }else{
                    fileCut_port($('#cut').attr('data-fileuuid'));
                }
            }else{
                fileCut_port($('#cut').attr('data-fileuuid'));
            };
            
        };
    });
};

// 复制文件(夹)
function fileCopy_port(uuid,parent) {
    var data={
            fileList:[uuid],
            newParentUUID: parent || $('.breadBox >span:last').attr('data-fileuuid')
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.fileCopy,param,fileCopy_callback,parent);
};
function fileCopy_callback(res,parent) {
    if(res.code==200){
        fileGetChildFileInfo_port($('.breadBox >span:last').attr('data-fileuuid'));
        if(parent){
            toastTip('提示','已成功复制至目标文件夹');
        };
    }else{
        toastTip("提示",res.info);
    };
};

// 剪切文件(夹)
function fileCut_port(uuid,parent) {
    var data={
            fileList:[uuid],
            newParentUUID: parent || $('.breadBox >span:last').attr('data-fileuuid')
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.fileCut,param,fileCut_callback,parent);
};
function fileCut_callback(res,parent) {
    if(res.code==200){
        $('#cut').attr('data-fileuuid','');
        fileGetChildFileInfo_port($('.breadBox >span:last').attr('data-fileuuid'));
        if(parent){
            toastTip('提示','已成功剪切至目标文件夹');
        };
    }else{
        toastTip("提示",res.info);
    };
};

// 获取根目录
function fileGetRoot_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.fileGetRoot,param,fileGetRoot_callback);
};
function fileGetRoot_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $(".root").attr("data-fileuuid",data.fileUUID);
        fileGetChildFileInfo_port(data.fileUUID);
    };
};

// 获取文件的所有子级文件
function fileGetChildFileInfo_port(fileUUID,obj) {
    var data={
            fileUUID:fileUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.fileGetChildFileInfo,param,fileGetChildFileInfo_callback,obj);
};
function fileGetChildFileInfo_callback(res,obj) {
    if(res.code==200){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img,
                isList:function () {
                        var isList=false;
                        if($("#tab >span.current").hasClass("tab01")){
                            isList=true;
                        };
                        return isList;
                }()
        };
        for(var i=0;i<data.arr.length;i++){
            if(data.arr[i].fileExt=='folder'){
                data.arr[i].fileExt01='文件夹';
            }else{
                data.arr[i].fileExt01=data.arr[i].fileExt;
            };
            data.arr[i].modificationTime01=data.arr[i].modificationTime.slice(0,16);
        };
        var html=template("todolist_script",data);
        $("#todolist").empty().append(html);

        if(obj){
            $(".breadBox >span[data-fileuuid="+obj.id+"]").nextAll().remove();
            $(".breadBox >span[data-fileuuid="+obj.id+"]").remove();
            var html="<span data-fileuuid="+obj.id+">"+obj.name+"</span>";
            $(".breadBox").append(html);
            if($(".breadBox >span").length>1){
                $(".breadBack").addClass("active");
            }else{
                $(".breadBack").removeClass("active");
            };
        };

        // 移动插件
        var el = document.getElementById('todolistBox');
        var sortable = new Sortable(el, {
                sort:false,
                onEnd:function (event) {
                    var current=event.item;
                    var target=event.explicitOriginalTarget;
                    if($(target).hasClass('folder')){
                        fileCut_port($(current).attr('data-fileuuid'),$(target).attr('data-fileuuid'));
                    };
                }
        });

        var el01 = document.getElementById('todolistBox01');
        var sortable01 = new Sortable(el01, {
                sort:false,
                onEnd:function (event) {
                    var current=event.item;
                    var target=event.explicitOriginalTarget;
                    if($(target).parents('.list').hasClass('folder')){
                        fileCut_port($(current).attr('data-fileuuid'),$(target).parents('.list').attr('data-fileuuid'));
                    };
                }
        });
    };
};

// 删除文件信息
function fileDeleteFileInfo_port(fileUUID,parentuuid) {
    var data={
            fileUUID:fileUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.fileDeleteFileInfo,param,fileDeleteFileInfo_callback,parentuuid);
};
function fileDeleteFileInfo_callback(res,parentuuid) {
    if(res.code==200){
        fileGetChildFileInfo_port(parentuuid);
    }else{
        toastTip("提示",res.info);
    };
};

// 获取单项文件信息
function fileGetSingleFileInfo_port(fileUUID,parentuuid) {
    var data={
            fileUUID:fileUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.fileGetSingleFileInfo,param,fileGetSingleFileInfo_callback,parentuuid);
};
function fileGetSingleFileInfo_callback(res,parentuuid) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#renameInput").attr("placeholder",data.fileName).val("");
        $("#renameBtn").attr("data-fileuuid",data.fileUUID).attr("data-parentuuid",data.parentUUID);
        $("#modal-rename").modal("show");
    };
};

// 更新文件名
function fileUpdateFileName_port(parentuuid) {
    var data={
            fileName:$("#renameInput").val(),
            fileUUID:$("#renameBtn").attr("data-fileuuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.fileUpdateFileName,param,fileUpdateFileName_callback,parentuuid);
};
function fileUpdateFileName_callback(res,parentuuid) {
    if(res.code==200){
        fileGetChildFileInfo_port(parentuuid);
        $("#modal-rename").modal("hide");
    };
};

// 获取公有文件上传token
function upToken1_port() {
    var data={
            comUUID:user.companyUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.upToken2,param,upToken1_callback);
};
function upToken1_callback(res) {
    if(res.code==200){
        user.upToken1=res.data;
        loadFiles01();// 七牛公有文件上传
    };
};

// 七牛公有文件上传
function loadFiles01() {
  var uploader = Qiniu.uploader({
      runtimes: 'html5,html4,flash',      // 上传模式，依次退化
      browse_button: 'filesUpload',         // 上传选择的点选按钮，必需
      uptoken: user.upToken1, // uptoken是上传凭证，由其他程序生成
      get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
      save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
      domain: httpUrl.path_img,     // bucket域名，下载资源时用到，必需
      max_file_size: '1024mb',             // 最大文件体积限制
      max_retries: 3,                     // 上传失败最大重试次数
      chunk_size: '4mb',                  // 分块上传时，每块的体积
      auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
      init: {
          'FileUploaded': function(up, file, info) {
                var parentuuid = $(".breadBox >span:last").attr("data-fileuuid");
                var data={
                        fileMD5:JSON.parse(info.response).key,
                        fileName:JSON.parse(info.response).fname,
                        fileType:"2",
                        fileSize:JSON.parse(info.response).fsize,
                        parentUUID:parentuuid
                };
                var param={
                        params:JSON.stringify(data),
                        loginId:httpUrl.loginId
                };
                initAjax(httpUrl.fileAddFileInfo,param,fileAddFileInfo_callback,parentuuid); 
          },
          'Error': function(up, err, errTip) {
                 //上传出错时，处理相关的事情
          }
      }
  });
};

// 获取私有资源下载URL
function downloadUrl1_port(key,kind) {
    var data={
            key:key,
            type:1 // "1"为原图，"2"为瘦身图片，默认为"1"
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.downloadUrl1,param,downloadUrl1_callback,kind);
};
function downloadUrl1_callback(res,kind) {
    if(res.code==200){
        switch (kind){
            case "image":
                    $("#carousel_img").empty().append("<img src="+res.data+" />");
                    $("#modal-dialog-img").modal("show");
                break;
            case "text":
                var src=res.data; 
                window.open("http://dcsapi.com/?k=106194529&url="+encodeURIComponent(src));
                break;
            default:
        };
    };
};

// 获取私有资源的URL（文件流）
function streamUrl_port(key,fileName) {
    var data={
            key:key,
            fileName:fileName 
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.streamUrl,param,streamUrl_callback);
};
function streamUrl_callback(res) {
    if(res.code==200){
        var elemIF = document.createElement("iframe");   
        elemIF.src = res.data; 
        elemIF.style.display = "none";   
        document.body.appendChild(elemIF);
    };
};

function fileAddFileInfo_callback(res,parentuuid) {
    if(res.code==200){
        fileGetChildFileInfo_port(parentuuid);
        $(".modal").modal("hide");
    }else{
        toastTip("提示",res.info);
    };
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
        $("#user >.userName").text(data.name);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        user.companyUUID=data.companyUUID;
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
        fileGetRoot_port();
        upToken1_port();
    };
};