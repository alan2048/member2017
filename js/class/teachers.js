$(function () {
    init();
});
function init() {
    menu();
   
    teacherAllType_port();// 获得所有教职工类型
    // 查询条件改变执行函数
    $("#teacherType,#teacherClass").change(function () {
        teacherStaffInfo_port();
    });

    // 点击查询按钮
    $("#searchBtn").click(function () {
        teacherStaffInfo_port();
    });

    // 搜索教师事件
    $("#teacherName").keyup(function (e) {
        if(e.which ==13){
            teacherStaffInfo_port();
        };
    });

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
    }).on('show',function (ev) {
        $(this).datepicker("update",$(ev.target).val());
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
    }).on('show',function (ev) {
        $(this).datepicker("update",$(ev.target).val());
    });

    // 图层折叠
    $("#buttonBox").on("click","#newBtn",function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-useruuid","");
        $("#content01").find("input[type=text]").val("");
        $("#content01").find("input[type=checkbox]:checked").prop("checked",false);
    });

    // 新增图层返回主界面
    $(".closeBtn").click(function () {
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });

    // 删除老师按钮
    $("#buttonBox").on("click","#deleteBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择删除项。。");   
        }else{
            if($(".fa-check-square-o").attr("data-id") == $("#user").attr("data-uuid")){
                swal({
                    title: "不可删除当前登录人账号",
                    text: "",
                    type: "warning",
                    timer:2000,
                    showCancelButton: false,
                    confirmButtonColor: "#e15d5d",
                    confirmButtonText: "确定",
                    closeOnConfirm: false
                });
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
                            teacherDelete_port();
                        };
                });
            };
        };
    });

    // 编辑老师按钮
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");
        }else{
            teacherSingleStaffInfo_port();
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
    
    $("#phoneNum").keyup(function () {
        var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/; //验证规则
        var phone=$("#phoneNum").val();
        if(!reg.test(phone) && phone.length >=11){
            $("#phoneNum").addClass("empty").next("span").removeClass("hide");
        }else{
            $("#phoneNum").removeClass("empty").next("span").addClass("hide");
        };
    });

    // 新增老师按钮
    $("#new").click(function () {
        ValidateInput();
        if($(".newBox .empty").length ==0){
            var text=$("#content01 >.pageTitle >small").text();
            if(text =="新增"){
                teacherAdd_port();
            }else{
                teacherUpdate_port($("#content01 >.pageTitle >small").attr("data-useruuid"));
            };
        }else{
            if($(this).attr("data-time")){
                var time=new Date().getTime() -$(this).attr("data-time");
                if(time >2000){
                    toastTip("提示","请先填写完整。。"); 
                };
                $(this).attr("data-time",new Date().getTime());
            }else{
                toastTip("提示","请先填写完整。。"); 
                $(this).attr("data-time",new Date().getTime());
            };
        };
    });

    importfn(); // 导入函数
    chooseRow();
};

// 导入函数
function importfn() {
    // 导入老师按钮
    $("#buttonBox").on("click","#importBtn",function () {
        $(".content").addClass("hide");
        $("#content02").removeClass("hide");
        $(".importFile >input").val("");
        teacherGetImportUserInfo_port();
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
            teacherGetSingleImportUserInfo_port($("#tableBox01 .fa.fa-check-square-o").attr("data-id"));
        };
    });

    // 双击直接编辑
    $("#tableBox01").on("dblclick",".table tbody tr",function () {
        teacherGetSingleImportUserInfo_port($(this).find(".fa").attr("data-id"));
    });

    // 导入编辑
    $("#new01").click(function () {
        ValidateInput01();
        if($("#importEditBox .empty").length ==0){
            teacherUpdateImportUser_port();
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
                        teacherDeleteImportUser_port();
                    };
            });
        };
    });

    // 提交数据
    $("#buttonBox01").on("click",".importUpBtn",function () {
        teacherSubmitUserData_port();
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
                teacherGetImportUserInfo_port();
                console.log(data)
                if(data.code ==200){
                    toastTip("提示",data.data,3000);
                }else{
                    toastTip("提示",data.info,3000);
                }
                
            },
            error: function(data) {
                console.log(data);   
            }
    };
    $("#filesUpload").ajaxSubmit(option);
    return false; //最好返回false，因为如果按钮类型是submit,则表单自己又会提交一次;返回false阻止表单再次提交
};

// 获得用户导入表信息
function teacherGetImportUserInfo_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherGetImportUserInfo,param,teacherGetImportUserInfo_callback);
};
function teacherGetImportUserInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox01_script",data);
        $("#tableBox01").empty().append(html);
        $(".importEditBtn,.importDelBtn").addClass("disable");
    }else{
        toastTip("提示",res.info);
    };
};

// 用户导入表 提交数据
function teacherSubmitUserData_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherSubmitUserData,param,teacherSubmitUserData_callback);
};
function teacherSubmitUserData_callback(res) {
    if(res.code==200){
        toastTip("提示",res.data+" 详情："+res.info,2500);
        teacherGetImportUserInfo_port();
        teacherStaffInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 获得用户导入表单项导入信息
function teacherGetSingleImportUserInfo_port(UUID) {
    var data={
            UUID:UUID
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherGetSingleImportUserInfo,param,teacherGetSingleImportUserInfo_callback,UUID);
};
function teacherGetSingleImportUserInfo_callback(res,UUID) {
    if(res.code==200){
        $("#new01").attr("data-uuid",UUID);
        $("#importEditBox").find("input[type=text]").val("");
        $("#importEditBox").find("input[type=checkbox]:checked").prop("checked",false);

        var data=JSON.parse(res.data);
        $("#userName01").val(data.name);
        $("#sex01 >option[value="+data.sex+"]").prop("selected",true);
        $("#birthday01").val(data.birthday);
        $("#phoneNum01").val(data.phoneNumber);
        $("#teacherType01 >option[value="+data.type+"]").prop("selected",true);
        
        for(var i=0;i<data.classList.length;i++){
            $("#teacherClass02 input[value="+data.classList[i].classUUID+"]").prop("checked",true);
        };

        $("#modal-edit").modal("show");
    }else{
        toastTip("提示",res.info);
    };
};

// 导入修改教职工
function teacherUpdateImportUser_port(userUUID) {
    var classList=[];
    var AA=$("#importEditBox").find("input[type=checkbox]:checked");
    for(var i=0;i<AA.length;i++){
        classList.push(AA.eq(i).val())
    };
    var data={
            birthday:$("#birthday01").val(),
            classUUIDList:classList,
            typeName:$("#teacherType02 >option:selected").text(),
            phoneNumber:$("#phoneNum01").val(),
            sex:$("#sex01").val(),
            name:$("#userName01").val(),
            UUID:$("#new01").attr("data-uuid")      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherUpdateImportUser,param,teacherUpdateImportUser_callback);
};
function teacherUpdateImportUser_callback(res) {
    if(res.code==200){
        teacherGetImportUserInfo_port();
        $("#modal-edit").modal("hide");
    }else{
        toastTip("提示",res.info);
    };
};


// 用户导入表-删除
function teacherDeleteImportUser_port() {
    var userUUID=[];
    var AA=$("#tableBox01 .table tbody tr i.fa-check-square-o");
    for(var i=0;i<AA.length;i++){
        userUUID.push(AA.eq(i).attr("data-id"))
    };
    var param={
            params:JSON.stringify(userUUID),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherDeleteImportUser,param,teacherDeleteImportUser_callback);
};
function teacherDeleteImportUser_callback(res) {
    if(res.code==200){
        teacherGetImportUserInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};


// 新建教职工
function teacherAdd_port() {
    var classList=[];
    var AA=$("#content01").find("input[type=checkbox]:checked");
    for(var i=0;i<AA.length;i++){
        classList.push(AA.eq(i).val())
    };
    var data={
            birthday:$("#birthday").val(),
            classList:classList,
            typeID:$("#teacherType01").val(),
            phoneNum:$("#phoneNum").val(),
            sex:$("#sex").val(),
            userName:$("#userName").val()      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherAdd,param,teacherAdd_callback);
};
function teacherAdd_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        teacherStaffInfo_port();
    }else{
        toastTip("提示",res.info);
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

    var reg = /^1[3|4|5|6|7|8][0-9]{9}$/; //验证规则
    var phone=$("#phoneNum").val();
    if(!reg.test(phone)){
        $("#phoneNum").addClass("empty").next("span").removeClass("hide");
    }else{
        $("#phoneNum").removeClass("empty").next("span").addClass("hide");
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

    var reg = /^1[3|4|5|6|7|8][0-9]{9}$/; //验证规则
    var phone=$("#phoneNum01").val();
    if(!reg.test(phone)){
        $("#phoneNum01").addClass("empty").next("span").removeClass("hide");
    }else{
        $("#phoneNum01").removeClass("empty").next("span").addClass("hide");
    };
};

// 获得单项教职工条目
function teacherSingleStaffInfo_port() {
    var data={
            userUUID: $(".table tbody tr i.fa-check-square-o").attr("data-id")  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherSingleStaffInfo,param,teacherSingleStaffInfo_callback,data.userUUID);
};
function teacherSingleStaffInfo_callback(res,userUUID) {
    if(res.code==200){
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("编辑").attr("data-useruuid",userUUID);
        $("#content01").find("input[type=text]").val("");
        $("#content01").find("input[type=checkbox]:checked").prop("checked",false);

        var data=JSON.parse(res.data);
        console.log(data);
        $("#birthday").val(data.birthday);
        $("#phoneNum").val(data.phoneNum);
        $("#userName").val(data.name);
        $("#teacherType01 >option[value="+data.typeID+"]").prop("selected",true);
        $("#sex >option[value="+data.sex+"]").prop("selected",true);
        for(var i=0;i<data.classInfo.length;i++){
            $("#teacherClass01 input[value="+data.classInfo[i].classUUID+"]").prop("checked",true);
        };
    }else{
        toastTip("提示",res.info);
    };
};

// 修改教职工
function teacherUpdate_port(userUUID) {
    var classList=[];
    var AA=$("#content01").find("input[type=checkbox]:checked");
    for(var i=0;i<AA.length;i++){
        classList.push(AA.eq(i).val())
    };
    var data={
            birthday:$("#birthday").val(),
            classList:classList,
            typeID:$("#teacherType01").val(),
            phoneNum:$("#phoneNum").val(),
            sex:$("#sex").val(),
            userName:$("#userName").val(),
            userUUID:userUUID      
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherUpdate,param,teacherUpdate_callback);
};
function teacherUpdate_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        teacherStaffInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 删除教职工
function teacherDelete_port() {
    var userUUID=[];
    var AA=$("#tableBox .table tbody tr i.fa-check-square-o");
    for(var i=0;i<AA.length;i++){
        userUUID.push(AA.eq(i).attr("data-id"))
    };
    var param={
            params:JSON.stringify(userUUID),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherDelete,param,teacherDelete_callback);
};
function teacherDelete_callback(res) {
    if(res.code==200){
        $(".closeBtn").click();
        teacherStaffInfo_port();
    }else{
        toastTip("提示",res.info);
    };
};

// 获得所有教职工类型
function teacherAllType_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherAllType,param,teacherAllType_callback);
};
function teacherAllType_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherType_script",data);
        $("#teacherType,#teacherType01,#teacherType02").append(html);
        teacherMyClassInfo_port();// 获得教职工所在班级列表
    };
};

// 获得教职工所在班级列表
function teacherMyClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherMyClassInfo,param,teacherMyClassInfo_callback);
};
function teacherMyClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").empty().append(html);
        basicAllClassInfo_port();
        teacherStaffInfo_port();
    };
};

// 获得登录人所在学校所有班级列表
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
        var html01=template("teacherClass01_script",data);
        $("#teacherClass01,#teacherClass02").empty().append(html01);
    };
};

// 获得教职工列表
function teacherStaffInfo_port(pageNum) {
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
    initAjax(httpUrl.teacherStaffInfo,param,teacherStaffInfo_callback);
};
function teacherStaffInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("tableBox_script",data);
        $("#tableBox").empty().append(html);
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏

        if(data.resultList.length ==0){
            toastTip("提示",$("#teacherClass >option:selected").text()+" 该教师不存在");
        };

        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRecord,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNum,
            cssStyle: '',
            onPageClick: function (pageNumber, event) {
                teacherStaffInfo_port(pageNumber);
            }
        });
    };
};


// Row行选择函数
function chooseRow() {
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏

    $("#tableBox,#tableBox01").on("click",".table thead tr i",function () {
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
        }else{
            var aa=$("#tableBox .table thead tr i").hasClass('fa-check-square-o');
            if(aa){
                $("#tableBox .table tbody tr i").removeClass('fa-check-square-o').addClass('fa-square-o');
                $(this).removeClass('fa-check-square-o').addClass('fa-square-o');
            }else{
                $("#tableBox .table tbody tr i").removeClass('fa-square-o').addClass('fa-check-square-o');
                $(this).removeClass('fa-square-o').addClass('fa-check-square-o');
            };
            ValidateBtn();
        };
    });

    $("#tableBox,#tableBox01").on("click",".table tbody tr",function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
        };
        if($(this).hasClass("importIcon")){
            ValidateBtn01();
        }else{
            ValidateBtn();
        };
    });

};

// 验证编辑删除按钮
function ValidateBtn() {
    var num=$("#tableBox .table tbody tr i.fa-check-square-o").length;
    if(num ==0){
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    }else if( num ==1){
        $("#editBtn,#deleteBtn").removeClass("disable");
    }else{
        $("#editBtn").addClass("disable");
        $("#deleteBtn").removeClass("disable");
    };
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
        $("#user").attr("data-uuid",data.userUUID);
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