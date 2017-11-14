$(function () {
    init();
});
function init() {
    menu();
    buttonFn();// 按钮功能区
};

// 按钮功能区
function buttonFn() {
    // 选中文件
    $("#todolist").on("click",".todoName",function () {
        $(this).toggleClass("active"); 
    });

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
    $("#todolist").on("click",".pic",function () {
        if($(this).parent(".list").hasClass("folder")){
            var obj={
                    name:$(this).attr("data-name"),
                    id:$(this).attr("data-fileuuid")
            };
            fileGetChildFileInfo_port($(this).attr("data-fileuuid"),obj);
        }else{
            $(this).parent(".list").find(".todoName").toggleClass("active"); 
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
            var src=httpUrl.download+"md5="+$(this).attr("data-md5")+"&fileName="+$(this).attr("data-name"); 
            console.log(src);
            window.open("http://dcsapi.com/?k=106194529&url="+encodeURIComponent(src));
        }else if(num == "image"){
            $("#carousel_img").empty().append("<img src="+httpUrl.path_img+$(this).attr('data-md5')+"&minpic=0"+" />");
            $("#modal-dialog-img").modal("show");
        }else{
            toastTip("提示","此格式暂不支持预览。。");
        }
    });

    // 下载
    $("#buttonBox").on("click","#download",function () {
        $("iframe").remove();
        if($(".todoName.active.folder").length !=0){
            toastTip("提示","暂不支持下载文件夹。。",2000);
            $(".todoName.active.folder").removeClass("active");
        };
        
        var num=$(".todoName.active:not(.folder)").length;
        if(num ==0){
            toastTip("提示","请先选择下载项。。");
        }else{
            for(var i=0;i<num;i++){
                var elemIF = document.createElement("iframe");   
                elemIF.src = httpUrl.download+"md5="+$(".todoName.active").eq(i).attr("data-md5")+"&fileName="+encodeURI($(".todoName.active").eq(i).attr("data-name"),"utf-8"); 
                console.log(elemIF.src);
                elemIF.style.display = "none";   
                document.body.appendChild(elemIF);
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
            var num=$(".todoName.active").length;
            if(num ==0){
                toastTip("提示","请先选择预览项。。");
            }else if(num >1){
                toastTip("提示","预览时为单项。。");
                $(".todoName.active").removeClass("active");
            }else{
                if($(".todoName.active").hasClass("folder")){
                    toastTip("提示","暂不支持预览文件夹。。");
                    $(".todoName.active.folder").removeClass("active");
                }else{
                    var className=$(".todoName.active").attr("class");
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
                        var src=httpUrl.download+"md5="+$(".todoName.active").attr("data-md5")+"&fileName="+$(".todoName.active").attr("data-name"); 
                        window.open("http://dcsapi.com/?k=106194529&url="+encodeURIComponent(src));
                    }else if(num == "image"){
                        $("#carousel_img").empty().append("<img src="+httpUrl.path_img+$(".todoName.active").attr('data-md5')+"&minpic=0"+" />");
                        $("#modal-dialog-img").modal("show");
                    }else{
                        toastTip("提示","此格式暂不支持预览。。");
                    }; 
                };
            };
        }
    },"#preview");

    // 删除
    $("#buttonBox").on("click","#deleteBtn",function () {
        var num=$(".todoName.active").length;
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
                        for(var i=0;i<$(".todoName.active").length;i++){
                            fileDeleteFileInfo_port($(".todoName.active").eq(i).attr("data-fileuuid"),$(".todoName.active").eq(i).attr("data-parentuuid"));
                        };
                    };
            });
        };
    });

    // 重命名
    $("#buttonBox").on("click","#rename",function () {
        if($(".todoName.active").length==0){
            toastTip("提示","请先选择重命名项。。");
        }else if($(".todoName.active").length >1){
            toastTip("提示","重命名项时为单选。。");
            $(".todoName.active").removeClass("active");
        }else{
            fileGetSingleFileInfo_port($(".todoName.active").attr("data-fileuuid"));
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
                path_img:httpUrl.path_img
        };
        console.log(data);
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

        // 排序函数
        /*var el = document.getElementById('todolistBox');
        var sortable = new Sortable(el, {
                sort:false,
                onEnd:function (evt) {
                    console.log(evt);
                }
        });*/
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



// 上传
function loadFiles() {
    Dropzone.options.myAwesomeDropzone=false;
    Dropzone.autoDiscover=false;
    var myDropzone=new Dropzone('#filesUpload >span',{
        url: httpUrl.picUrl,
        paramName: "mbFile",
        maxFilesize: 50, // MB
        addRemoveLinks: true,
        dictFileTooBig:"文件过大({{filesize}}MB). 上传文件最大支持: {{maxFilesize}}MB.",
        previewTemplate: "<div style='display:none'></div>",
        init:function(){
            this.on("addedfile", function(file) { 
                $(".progress .progress-bar").css("width",0);
                $(".progress").show();//显示进度条
            });
            this.on("queuecomplete",function(file) {
                $(".progress").hide(); //隐藏进度条
                $(".progress .progress-bar").css("width",0);
            });
            this.on("removedfile",function(file){
                //删除文件时触发的方法
            });
        }
    });
    myDropzone.on('success',function(file,responseText){
        var md5=JSON.parse(responseText).result;
        var parentuuid = $(".breadBox >span:last").attr("data-fileuuid");
        var data={
                fileMD5:md5,
                fileName:file.name,
                fileType:"2",
                parentUUID:parentuuid
        };
        var param={
                params:JSON.stringify(data),
                loginId:httpUrl.loginId
        };
        initAjax(httpUrl.fileAddFileInfo,param,fileAddFileInfo_callback,parentuuid); 
    });
    myDropzone.on('error',function(file,errorMessage,httpRequest){
        alert('没有上传成功,请重试:'+errorMessage);
        this.removeFile(file);
    });
    myDropzone.on('totaluploadprogress',function(x,y,z){
        $(".progress .progress-bar").css("width",x+"%");
    });
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
        basicButton_port();
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
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
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
        loadFiles();
        fileGetRoot_port();
    };
};