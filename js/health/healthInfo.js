$(function () {
    init();
});
function init() {
    menu();
    chooseRow();

    teacherMyClassInfo_port();

    // 导入
    $("#buttonBox").on("click","#importBtn",function () {
        $("#filesUpload >input[name=file]").click();
    });

    // xlsx上传
    $("#filesUpload input[type=file]").change(function () {
        $("#filesUpload >input[name=loginId]").val(httpUrl.loginId);
        var data={
                classUUID:$("#teacherClass").val(),
                extName:$(this).val().substring($(this).val().lastIndexOf(".")+1)
        };
        $("#filesUpload >input[name=params]").val(JSON.stringify(data));
        ajaxSubmitForm();

        $("#modal-edit").modal("show");
    });

    // 删除
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
                        for(var i=0;i<$("#tableBox .table tbody tr.active").length;i++){
                            healthDeleteHealthInfo_port($("#tableBox .table tbody tr.active").eq(i).attr("data-id"));
                        };
                    };
            });
        };
    });

    $("#buttonBox").on("click","#export",function () {
        var data={
                classUUID:$("#teacherClass").val(),
                className:$("#teacherClass >option:selected").text(),
                examDate:$("#examDate").val()
        };
        if($("#examDate").val()){
            window.open(httpUrl.basicZip+"?loginId="+httpUrl.loginId+"&url="+httpUrl.healthExport+"&params="+JSON.stringify(data));
        }else{
            toastTip("提示","此班级暂无体检信息");
        };
    });

    loginSuccess();
    importPreview();  
};

// 导入预览模块函数
function importPreview() {
    // 预览导入上传
    $("#previewSave").click(function () {
        var arr=[];
        for(var i=0;i<$("#importTable .table01 tbody >tr").length;i++){
            arr.push($("#importTable .table01 tbody >tr").eq(i).attr("data-id"))
        };
        if($("#importTable .red").length ==0){
            importHealthSubmit_port(arr);
        }else{
            toastTip("提示","身高和体重为必填项，请先填写完整");
        };
    });

    // 取消预览导入上传
    $("#previewQuit").click(function () {
        var arr=[];
        for(var i=0;i<$("#importTable .table01 tbody >tr").length;i++){
            arr.push($("#importTable .table01 tbody >tr").eq(i).attr("data-id"))
        };
        importHealthDelete_port(arr);
    });

    $("#importTable").on("change","td.heightHi >input,td.weightHi >input",function (e) {
        var value=$(this).val();
        if(value){
            $(this).parent().removeClass("red");
            var reg=new RegExp("^[0-9]+(.[0-9]{1,2})?$");
            if(!reg.test(value)){
                $(this).val("");
                $(this).parent().addClass("red");
                toastTip("提示","输入值需为数字");
            }else{
                var _self=$(this).parents("tr");
                importHealthUpdate_port(_self);
            };
        }else{
            $(this).parent().addClass("red");
            toastTip("提示","身高和体重为必填项");
        };
    });

    $("#importTable").on("change","td.inputIcon.hemachromeHi >input,td.inputIcon.toothdecayHi >input",function (e) {
        var value=$(this).val();
        if(value){
            var reg=new RegExp("^(0|[1-9][0-9]*)$");
            if(!reg.test(value)){
                $(this).val("");
                toastTip("提示","输入值需为数字");
            }else{
                var _self=$(this).parents("tr");
                importHealthUpdate_port(_self);
            };
        };
    });

    $("#importTable").on("change","td.hearingHi >select,td.uroscopyHi >select",function () {
        if($(this).val() == "可疑，需复查"){
            $(this).parent().addClass("redIcon");
        }else{
            $(this).parent().removeClass("redIcon");
        };
        var _self=$(this).parents("tr");
        importHealthUpdate_port(_self);
    });

    $("#importTable").on("change","td.vision >input",function (e) {
        var value=$(this).val();
        if(value){
            var reg=new RegExp("^[0-9]+(.[0-9]{1,2})?$");
            if(!reg.test(value)){
                $(this).val("");
                toastTip("提示","输入值需为数字");
            };
        };
        var _self=$(this).parents("tr");
        importHealthUpdate_port(_self);
    });
};

// 预览导入上传
function ajaxSubmitForm() {
    var option = {
            url : httpUrl.basicFileUpload,
            type : 'POST',
            dataType : 'json',
            success : function(res) {
                if(res.code==200){
                    var data=JSON.parse(res.data);
                    var json={arr:data.data};
                    var html=template("importTable_script",json);
                    chooseNiceScroll("#importTable");
                    $("#importTable").empty().append(html);
                    toastTip("提示",data.importInfo,5000);
                }else{
                    toastTip("提示",res.info,3000);
                };
            },
            error: function(data) {
                console.log(data);   
            }
    };
    $("#filesUpload").ajaxSubmit(option);
    return false; //最好返回false，因为如果按钮类型是submit,则表单自己又会提交一次;返回false阻止表单再次提交
};

// 提交导入数据
function importHealthSubmit_port(arr) {
    var data={
            hiUUIDList:arr
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.importHealthSubmit,param,importHealthSubmit_callback);
};
function importHealthSubmit_callback(res) {
    if(res.code==200){
        $("#modal-edit").modal("hide");
        var examDate=$("#importTable .table01 tbody >tr:first").attr("data-examdate");
        healthGetExamDateList_port(examDate);
        toastTip("提示","上传"+res.info,3000);
    }else{
        toastTip("提示",res.info,3000);
    };
};

// 修改重算导入数据
function importHealthUpdate_port(_self) {
    var data={
            hiUUID:$(_self).attr("data-id"),
            height:$(_self).find(".heightHi >input").val(),
            weight:$(_self).find(".weightHi >input").val(),
            hemachrome:$(_self).find(".hemachromeHi >input").val(),
            visionL:$(_self).find(".visionL").val(),
            visionR:$(_self).find(".visionR").val(),
            hearing:$(_self).find(".hearingHi >select").val(),
            uroscopy:$(_self).find(".uroscopyHi >select").val(),
            toothdecay:$(_self).find(".toothdecayHi >input").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.importHealthUpdate,param,importHealthUpdate_callback);
};
function importHealthUpdate_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("importSingle_script",data);
        for(var i=0;i<6;i++){
            $("#importTable tr[data-id="+data.hiUUID+"] >td:last-of-type").remove();
        };
        $("#importTable tr[data-id="+data.hiUUID+"]").append(html);
    }else{
        toastTip("提示",res.info,3000);
    };
};

// 删除导入数据
function importHealthDelete_port(arr) {
    var data={
            hiUUIDList:arr
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.importHealthDelete,param,importHealthDelete_callback);
};
function importHealthDelete_callback(res) {
    if(res.code==200){
        // console.log(res);
    };
};

// 获得教职工所在班级列表
function teacherMyClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherMyClassInfo2,param,teacherMyClassInfo_callback);
};
function teacherMyClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").empty().append(html);
        healthGetExamDateList_port();
        $("#teacherClass").change(function () {
            healthGetExamDateList_port();
        });
    };
};

// 根据班级获得检查日期列表
function healthGetExamDateList_port(examDate) {
    var data={
            classUUID:$("#teacherClass").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthGetExamDateList,param,healthGetExamDateList_callback,examDate);
};
function healthGetExamDateList_callback(res,examDate) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("examDate_script",data);
        $("#examDate").empty().append(html);

        if(examDate){
            $("#examDate >option[value="+examDate+"]").attr('selected',true);
        };
        
        $("#examDate").change(function () {
            healthGetClassHealthInfo_port();
        });
        if(data.arr.length !=0){
            healthGetClassHealthInfo_port();
        }else{
            $("#tableBox").empty();
            $("#editBtn,#deleteBtn").addClass("disable");
        }
    };
};

// 获得班级健康信息
function healthGetClassHealthInfo_port() {
    var data={
            classUUID:$("#teacherClass").val(),
            examDate:$("#examDate").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthGetClassHealthInfo,param,healthGetClassHealthInfo_callback);
};
function healthGetClassHealthInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);

        $("#editBtn,#deleteBtn").addClass("disable");
    };
};

// 删除健康信息
function healthDeleteHealthInfo_port(hiUUID) {
    var data={
            hiUUID:hiUUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthDeleteHealthInfo,param,healthDeleteHealthInfo_callback);
};
function healthDeleteHealthInfo_callback(res) {
    if(res.code==200){
        healthGetExamDateList_port();
    }else{
        toastTip("提示",res.info);
    };
};




// Row行选择函数
function chooseRow() {
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏

    $("#tableBox").on("click",".table tbody tr",function () {
        $(this).toggleClass("active")

        ValidateBtn();
    });
};

// 验证编辑删除按钮
function ValidateBtn() {
    var num=$("#tableBox .table tbody tr.active").length;
    if(num ==0){
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    }else if( num ==1){
        $("#editBtn,#deleteBtn").removeClass("disable");
    }else{
        $("#editBtn").addClass("disable");
        $("#deleteBtn").removeClass("disable");
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
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
        $("#template").attr("href","healthInfo_template.xls");
    };
};