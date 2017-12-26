$(function () {
    menu();
    init();
});
function init() {
    childrenMyClassInfo_port();// 获得幼儿所在班级列表

    // 查询条件改变执行函数
    $("#teacherType,#teacherClass").change(function () {
        childrenInfo_port();
    });

    // 点击查询按钮
    $("#searchBtn").click(function () {
        childrenInfo_port();
    });

    // 搜索教师事件
    $("#teacherName").keyup(function (e) {
        if(e.which ==13){
            childrenInfo_port();
        };
    });

    // 图层折叠
    $("#buttonBox").on("click","#newBtn",function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-useruuid","");
        $("#content01").find("input[type=text]").val("");
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
            childrenSingleChildInfo_port();
        };
    });

    // 新增老师按钮
    $("#new").click(function () {
        ValidateInput();
        if($(".newBox .empty").length ==0){
            var text=$("#content01 >.pageTitle >small").text();
            if(text =="新增"){
                childrenAdd_port();
            }else{
                childrenUpdate_port($("#content01 >.pageTitle >small").attr("data-useruuid"));
            };
        }else{
            toastTip("提示","请先填写完整。。");   
        };
    });

    // 日历
    $('#birthday').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        if($("#birthday").val()){
            $("#birthday").removeClass("empty");
        }else{
            $("#birthday").addClass("empty");
        };
        $('#birthday').datepicker("hide");
    });

    $('#birthday01').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        if($("#birthday01").val()){
            $("#birthday01").removeClass("empty");
        }else{
            $("#birthday01").addClass("empty");
        };
        $('#birthday01').datepicker("hide");
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
                        childrenDelete_port();
                    };
            });
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

    importfn(); // 导入函数
    chooseRow01();

    editParent();// 编辑家长信息
};

// 编辑家长信息
function editParent() {
    // 删除家长信息
    $("#tableBox02").on("click",".parentDelete",function () {
        var aa=$(this).attr("data-parentid");
        swal({
                title: "是否删除此家长信息？",
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
                        childrenParentDelete_port(aa);
                    };
        });
    });

    // 编辑家长信息
    $("#tableBox02").on("click",".parentEdit",function () {
        childrenSingleParentInfo_port($(this).attr("data-parentid"));
    });

    // 更新家长信息
    $("#newParent").on("click",function () {
        if($("#parentName").val()){
            $("#parentName").removeClass("empty");
        }else{
            $("#parentName").addClass("empty");
        };
        if($("#parentPhone").val()){
            $("#parentPhone").removeClass("empty");
        }else{
            $("#parentPhone").addClass("empty");
        };
        if($("#parentName").hasClass("empty") || $("#parentPhone").hasClass("empty")){
            toastTip("提示","请先填写完整。。");
        }else{
            var reg=/^1(3|4|5|6|7|8|9)\d{9}$/;// 验证手机号码
            if(reg.test($("#parentPhone").val())){
                $("#parentPhone").removeClass("empty");
                childrenParentUpdate_port();
            }else{
                toastTip("提示","手机号码格式不正确");
                $("#parentPhone").addClass("empty");
            };
        };
    });

    $("#parentPhone").keyup(function (e) {
        if($(this).val().length >=11){
            var reg=/^1(3|4|5|6|7|8|9)\d{9}$/;// 验证手机号码
            if(reg.test($(this).val())){
                $(this).removeClass("empty");
            }else{
                toastTip("提示","手机号码格式不正确");
                $(this).addClass("empty");
            };
        }else if(e.keyCode == 13){
            toastTip("提示","手机号码为11位");
            $(this).addClass("empty");
        };
    });

    $("#parentName").keyup(function (e) {
        if($("#parentName").val()){
            $("#parentName").removeClass("empty");
        }else{
            $("#parentName").addClass("empty");
        };
    });
};
// 导入函数
function importfn() {
    // 导入老师按钮
    $("#buttonBox").on("click","#importBtn",function () {
        $(".content").addClass("hide");
        $("#content02").removeClass("hide");
        $(".importFile >input").val("");
        childrenGetImportUserInfo_port();
    });

    // 返回上级
    $("#buttonBox01").on("click",".backBtn",function () {
        var num=$("#tableBox01 tbody >tr").length;
        if(num !=0){
            swal({
                title: "您还有数据未全部提交，是否确认退出？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e15d5d",
                confirmButtonText: "退出",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        $(".content").addClass("hide");
                        $("#content").removeClass("hide");
                    };
            });
        }else{
            $(".content").addClass("hide");
            $("#content").removeClass("hide");
        };
    });

    // 导入编辑
    $("#buttonBox01").on("click",".importEditBtn",function () {
        if($(this).hasClass("disable")){
            var num=$("#tableBox01 .fa.fa-check-square-o").length;
            if(num ==0){
                toastTip("提示","请先选择编辑项。。"); 
            }else{
                toastTip("提示","编辑时为单选。。"); 
            };
        }else{
            childrenGetSingleImportUserInfo_port($("#tableBox01 .fa.fa-check-square-o").attr("data-id"));
        };
    });

    // 双击直接编辑
    $("#tableBox01").on("dblclick",".table tbody tr",function () {
        childrenGetSingleImportUserInfo_port($(this).find(".fa").attr("data-id"));
    });

    // 导入编辑
    $("#new01").click(function () {
        ValidateInput01();
        if($("#importEditBox .empty").length ==0){
            childrenUpdateImportUser_port();
        }else{
            toastTip("提示","请先填写完整。。");   
        };
    });

    // 删除老师按钮
    $("#buttonBox01").on("click",".importDelBtn",function () {
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
                        childrenDeleteImportUser_port();
                    };
            });
        };
    });

    // 提交数据
    $("#buttonBox01").on("click",".importUpBtn",function () {
        childrenSubmitUserData_port();
    });

    // 选择文件点击
    $(".importFile span,.importFile input").click(function () {
        $("#filesUpload >input[name=file]").click(); 
    });

    // xlsx上传
    $("#filesUpload input[type=file]").change(function () {
        $("#filesUpload >input[name=loginId]").val(httpUrl.loginId);
        var data={
                extName:$(this).val().substring($(this).val().lastIndexOf(".")+1)
        };
        $("#filesUpload >input[name=params]").val(JSON.stringify(data));
        $(".importFile >input").val($(this).val().substring($(this).val().lastIndexOf("\\")+1));
        ajaxSubmitForm();
    });
};

function ajaxSubmitForm() {
    var option = {
            url : httpUrl.basicFileUpload,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                childrenGetImportUserInfo_port();
                toastTip("提示",data.data,3000);
            },
            error: function(data) {
                console.log(data);   
            }
    };
    $("#filesUpload").ajaxSubmit(option);
    return false; //最好返回false，因为如果按钮类型是submit,则表单自己又会提交一次;返回false阻止表单再次提交
};

// 获得用户导入表信息
function childrenGetImportUserInfo_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenGetImportUserInfo,param,childrenGetImportUserInfo_callback);
};
function childrenGetImportUserInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        console.log(data.arr);
        var html=template("tableBox01_script",data);
        $("#tableBox01").empty().append(html);
        $(".importEditBtn,.importDelBtn").addClass("disable");
    }else{
        toastTip("提示",res.info);
    };
};

// 用户导入表 提交数据
function childrenSubmitUserData_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenSubmitUserData,param,childrenSubmitUserData_callback);
};
function childrenSubmitUserData_callback(res) {
    if(res.code==200){
        toastTip("提示",res.data+" 详情："+res.info,2500);
        childrenGetImportUserInfo_port();
        childrenInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 获得用户导入表单项导入信息
function childrenGetSingleImportUserInfo_port(UUID) {
    var data={
            UUID:UUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenGetSingleImportUserInfo,param,childrenGetSingleImportUserInfo_callback,UUID);
};
function childrenGetSingleImportUserInfo_callback(res,UUID) {
    if(res.code==200){
        $("#new01").attr("data-uuid",UUID);
        $("#importEditBox").find("input[type=text]").val("");
        $(".empty").removeClass("empty");

        var data=JSON.parse(res.data);
        $("#userName01").val(data.name);
        $("#sex01 >option[value="+data.sex+"]").prop("selected",true);
        $("#birthday01").val(data.birthday);
        $("#teacherClass02 >option[data-name="+data.classInfo.className+"]").prop("selected",true);

        $("#modal-edit").modal("show");
    }else{
        toastTip("提示",res.info);
    };
};

// 导入修改教职工
function childrenUpdateImportUser_port(userUUID) {
    var classList=[];
    var AA=$("#importEditBox").find("input[type=checkbox]:checked");
    for(var i=0;i<AA.length;i++){
        classList.push(AA.eq(i).val())
    };
    var data={
            birthday:$("#birthday01").val(),
            classUUID:$("#teacherClass02").val(),
            sex:$("#sex01").val(),
            name:$("#userName01").val(),
            UUID:$("#new01").attr("data-uuid")      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenUpdateImportUser,param,childrenUpdateImportUser_callback);
};
function childrenUpdateImportUser_callback(res) {
    if(res.code==200){
        childrenGetImportUserInfo_port();
        $("#modal-edit").modal("hide");
    }else{
        toastTip("提示",res.info);
    };
};


// 用户导入表-删除
function childrenDeleteImportUser_port() {
    var userUUID=[];
    var AA=$("#tableBox01 .table tbody tr i.fa-check-square-o");
    for(var i=0;i<AA.length;i++){
        userUUID.push(AA.eq(i).attr("data-id"))
    };
    var param={
            params:JSON.stringify(userUUID),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenDeleteImportUser,param,childrenDeleteImportUser_callback);
};
function childrenDeleteImportUser_callback(res) {
    if(res.code==200){
        childrenGetImportUserInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};










// 获得幼儿所在班级列表
function basicAllClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicAllClassInfo,param,basicAllClassInfo_callback);
};
function basicAllClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass01,#teacherClass02").empty().append(html);
    };
};

// 获得幼儿所在班级列表
function childrenMyClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenMyClassInfo,param,childrenMyClassInfo_callback);
};
function childrenMyClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").append(html);
        childrenInfo_port();
        basicAllClassInfo_port();
    };
};

// 获得幼儿列表
function childrenInfo_port(pageNum) {
    var data={
            classUUID:$("#teacherClass").val(),
            typeID:$("#teacherType").val(),
            pageNum:pageNum || 1,
            pageSize:12,
            searchName:$("#teacherName").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenInfo,param,childrenInfo_callback);
};
function childrenInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        chooseRow();

        // 空信息时清空家长信息
        if($(".table.table-email tbody tr").length ==0){
            $(".table:not(.table-email) tbody").empty();
        }else{
            $(".table.table-email tbody tr:first >td.email-sender:first").click();
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",70);
        };
        
        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRecord,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNum,
            cssStyle: '',
            onPageClick: function (pageNumber, event) {
                childrenInfo_port(pageNumber);
            }
        });
    };
};


//  获得幼儿家长列表
function childrenParentInfo_port(userUUID) {
    var data={
            userUUID: userUUID  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenParentInfo,param,childrenParentInfo_callback,data.userUUID);
};
function childrenParentInfo_callback(res,userUUID) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox02_script",data);
        $("#tableBox02").attr("data-userid","").attr("data-userid",userUUID);
        $("#tableBox02").empty().append(html);
    }else{
        toastTip("提示",res.info);
    };
};

//  幼儿家长删除
function childrenParentDelete_port(userUUID) {
    var data={
            userUUID: userUUID  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenParentDelete,param,childrenParentDelete_callback,data.userUUID);
};
function childrenParentDelete_callback(res,userUUID) {
    if(res.code==200){
        childrenParentInfo_port($("#tableBox02").attr("data-userid"));
        toastTip("提示","删除成功");
    }else{
        toastTip("提示",res.info);
    };
};

//  获得单项家长条目
function childrenSingleParentInfo_port(userUUID) {
    var data={
            userUUID: userUUID  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenSingleParentInfo,param,childrenSingleParentInfo_callback,data.userUUID);
};
function childrenSingleParentInfo_callback(res,userUUID) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $(".content").addClass("hide");
        $("#content03").removeClass("hide");
        $("#parentName,#parentPhone").removeClass("empty");

        if($("#appellation").children().length == 0){
            var html=template("appellation_script",{arr:["妈妈","爸爸","奶奶","爷爷","外公","外婆","姐姐","哥哥","姑母","姑父","舅舅","舅妈","叔叔","婶婶","姨父","姨妈","伯父","伯母","家人"]});
            $("#appellation").empty().append(html);
        };
        $("#parentName").val(data.name);
        $("#parentPhone").val(data.phoneNum);
        $("#appellation >option[value="+data.appellation+"]").prop("selected",true);
        console.log(data);
        $("#newParent").attr("data-parentid",data.parentUUID);
    }else{
        toastTip("提示",res.info);
    };
};

//  更新家长条目
function childrenParentUpdate_port() {
    var data={
            appellation:$("#appellation").val(),
            userName:$("#parentName").val(),
            phoneNum:$("#parentPhone").val(),
            userUUID: $("#newParent").attr("data-parentid")  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenParentUpdate,param,childrenParentUpdate_callback,data.userUUID);
};
function childrenParentUpdate_callback(res,userUUID) {
    if(res.code==200){
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
        childrenParentInfo_port($("#tableBox02").attr("data-userid"));
        toastTip("提示","修改成功");
    }else{
        toastTip("提示",res.info);
    };
};


// 新建幼儿
function childrenAdd_port() {
    var data={
            birthday:$("#birthday").val(),
            classUUID:$("#teacherClass01").val(),
            sex:$("#sex").val(),
            userName:$("#userName").val()      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenAdd,param,childrenAdd_callback);
};
function childrenAdd_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        childrenInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};


// 获得单项幼儿条目
function childrenSingleChildInfo_port() {
    var data={
            userUUID: $(".table tbody tr i.fa-check-square-o").attr("data-id")  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenSingleChildInfo,param,childrenSingleChildInfo_callback,data.userUUID);
};
function childrenSingleChildInfo_callback(res,userUUID) {
    if(res.code==200){
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("编辑").attr("data-useruuid",userUUID);
        $("#content01").find("input[type=text]").val("");

        var data=JSON.parse(res.data);
        $("#birthday").val(data.birthday);
        $("#userName").val(data.name);
        $("#teacherClass01 >option[value="+data.classUUID+"]").prop("selected",true);
        $("#sex >option[value="+data.sex+"]").prop("selected",true);
    }else{
        toastTip("提示",res.info);
    };
};

// 修改幼儿
function childrenUpdate_port(userUUID) {
    var data={
            birthday:$("#birthday").val(),
            classUUID:$("#teacherClass01").val(),
            sex:$("#sex").val(),
            userName:$("#userName").val(),
            userUUID:userUUID      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenUpdate,param,childrenUpdate_callback);
};
function childrenUpdate_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        childrenInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 删除幼儿
function childrenDelete_port() {
    var userUUID=[];
    var AA=$("#tableBox .table tbody tr i.fa-check-square-o");
    for(var i=0;i<AA.length;i++){
        userUUID.push(AA.eq(i).attr("data-id"))
    };
    var param={
            params:JSON.stringify(userUUID),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.childrenDelete,param,childrenDelete_callback);
};
function childrenDelete_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        childrenInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};




// Row行选择函数
function chooseRow() {
    chooseNiceScroll("#tableBox");
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    $("#tableBox .table.table-email thead tr i").click(function () {
        var aa=$(".table thead tr i").hasClass('fa-check-square-o');
        if(aa){
            $("#tableBox .table tbody tr i").removeClass('fa-check-square-o').addClass('fa-square-o');
            $(this).removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $("#tableBox .table tbody tr i").removeClass('fa-square-o').addClass('fa-check-square-o');
            $(this).removeClass('fa-square-o').addClass('fa-check-square-o');
        };
        ValidateBtn();
    });
    $("#tableBox .table.table-email tbody tr >td.email-select").click(function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
        };
        ValidateBtn();
    });

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
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-290);
            childrenParentInfo_port($(this).prevAll("td.email-select").find("i").attr("data-id"));   
        }
    });
};

function chooseRow01() {
    $("#tableBox01").on("click",".table thead tr i",function () {
        if($(this).hasClass("importIcon")){
            var aa=$("#tableBox01 .table thead tr i").hasClass('fa-check-square-o');
            if(aa){
                $("#tableBox01 .table tbody tr i").removeClass('fa-check-square-o').addClass('fa-square-o');
                $(this).removeClass('fa-check-square-o').addClass('fa-square-o');
            }else{
                $("#tableBox01 .table tbody tr i").removeClass('fa-square-o').addClass('fa-check-square-o');
                $(this).removeClass('fa-square-o').addClass('fa-check-square-o');
            };
            ValidateBtn01();
        }
    });

    $("#tableBox01").on("click",".table tbody tr",function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
        };
        ValidateBtn01();
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

// 验证导入部分 编辑删除按钮
function ValidateBtn01() {
    var num=$("#tableBox01 .table tbody tr i.fa-check-square-o").length;
    if(num ==0){
        $(".importEditBtn,.importDelBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    }else if( num ==1){
        $(".importEditBtn,.importDelBtn").removeClass("disable");
    }else{
        $(".importEditBtn").addClass("disable");
        $(".importDelBtn").removeClass("disable");
    };
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
};

// 导入验证input输入
function ValidateInput01() {
    if(!$("#userName01").val()){
        $("#userName01").addClass("empty");
    }else{
        if($("#userName01").val().length >20){
            $("#userName01").addClass("empty");
            toastTip("提示","姓名最长为20字。。");
        }else{
            $("#userName01").removeClass("empty");
        };
    };

    if(!$("#birthday01").val()){
        $("#birthday01").addClass("empty");
    }else{
        $("#birthday01").removeClass("empty");
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

        console.log(data);
        
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
    };
};
