$(function () {
    init();
});
function init() {
    menu();
    watchPlanList_port();
    
    // 删除观察计划
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
                        watchPlanDelete_port();
                    };
            });
        };
    });

    // 新增按钮
    $("#buttonBox").on("click","#newBtn",function () {
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-id","0");
        $("#planName,#planTarget,#planDiffpoint,#planBegintime,#planEndtime,#planKeypoint,#planPrepare").val("");
        $("#jsmind_container jmnode").removeClass("activeselected");
        $(".aboutTeacher span").removeClass("active");
        $(".aboutTeacher span[data-useruuid="+$(".userName").attr("data-useruuid")+"]").addClass("active");
        jsMind.current.collapse_all();// 恢复默认折叠效果
    });

    // 编辑按钮
    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示",'请先选择编辑项。。');
        }else{
            $(".content").addClass("hide");
            $("#content01").removeClass("hide").find(".pageTitle >small").text("编辑").attr("data-id",$(".table tbody tr i.fa-check-square-o").attr("data-id"));
            courseDetail_port($(".table tbody tr i.fa-check-square-o").attr("data-id"));
        }
    });

    $('#planBegintime').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        if($("#planBegintime").val()){
            $("#planBegintime").removeClass("textbox-invalid");
        }else{
            $("#planBegintime").addClass("textbox-invalid");
        };
        $('#planBegintime').datepicker("hide");
    });

    $('#planEndtime').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        if($("#planEndtime").val()){
            $("#planEndtime").removeClass("textbox-invalid");
        }else{
            $("#planEndtime").addClass("textbox-invalid");
        };
        $('#planEndtime').datepicker("hide");
    });

    // 选择关联教师
    $(".aboutTeacher").on("click","span",function () {
        $(this).toggleClass("active"); 
    });


    onValid();
    // 点击完成按钮，先执行验证再执行保存接口
    $("#finalBtn").click(function () {
        isValid();
        var aa=$(".textbox-invalid").length;
        if(aa==0){
            var num=$(".aboutTeacher span.active").length;
            if(num==0){
                toastTip("提示",'关联老师至少选择一位。。');
            }else{
                if($("#jsmind_container jmnode.activeselected").length ==0){
                    toastTip("提示",'至少选择一项维度能力');
                }else{
                    courseSave_port($("#content01").find(".pageTitle >small").attr("data-id"));// 0为新增，1为编辑
                }
            };
        }else{
            toastTip("提示",'请先将红色区域的必填项补充完成。。');
        }
    });

    // 取消点击  弹回上一级
    $("#cancel").click(function () {
        $("#content01").addClass("hide");
        $("#content").removeClass("hide");
    });
};

// 获取观察计划列表
function watchPlanList_port(pageNumber) {
    var data={
            pageNumber:pageNumber || 1,
            pageSize:12
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchPlanList,param,watchPlanList_callback);
};
function watchPlanList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
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
                watchPlanList_port(pageNumber);
            }
        });
    };
};

// 删除观察计划
function watchPlanDelete_port() {
    var data={
            id:$(".table tbody tr i.fa-check-square-o").attr("data-id")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchPlanDelete,param,watchPlanDelete_callback);
};
function watchPlanDelete_callback(res) {
    if(res.code==200){
        var currentNum=$("#pagination span.current:not(.next,.prev)").text()
        watchPlanList_port(currentNum);
    }else{
        toastTip("提示",res.info);
    };
};

// Row行选择函数
function chooseRow() {
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    $(".table thead tr i").click(function () {
        var aa=$(".table thead tr i").hasClass('fa-check-square-o');
        if(aa){
            $(".table tbody tr i").removeClass('fa-check-square-o').addClass('fa-square-o');
            $(this).removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(".table tbody tr i").removeClass('fa-square-o').addClass('fa-check-square-o');
            $(this).removeClass('fa-square-o').addClass('fa-check-square-o');
        };
        ValidateBtn();
    });
    $(".table tbody tr").click(function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
            $(this).siblings().find("i").removeClass("fa-check-square-o").addClass('fa-square-o'); 
        };
        ValidateBtn();
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






















// 维度能力接口函数
function getTeacherList_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchPlanTeacherList,param,getTeacherList_callback);
};
function getTeacherList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("aboutTeacher_script",data);
        $(".aboutTeacher").empty().append(html).find("span[data-useruuid="+$(".userName").attr("data-useruuid")+"]").addClass("active");
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 维度能力接口函数
function watchDimensions_port(dimList) {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.dimList,param,watchDimensions_callback,dimList);
};
function watchDimensions_callback(res,dimList) {
    if(res.code==200){
        loadingOut();//关闭loading
        var data=JSON.parse(res.data);
        $("#jsmind_container").empty();
        var newdata=res.data.replace(/name/g,'topic').replace(/childDimList/g,'children');
        
        var mind={
                "meta":{
                    "name":"jsMind remote",
                    "author":"hizzgdev@163.com",
                    "version":"0.2"
                },
                "format":"node_tree",
                "data":{"id":"root","topic":"维度能力","children":JSON.parse(newdata)}
        };
        var options={
                container:'jsmind_container',
                editable:false,
                theme:'primary',
                view:{
                    hmargin:0
                },
                layout:{
                    hspace:45,
                    vspace:10,
                    pspace:15
                }

        }
        jsMind.show(options,mind);

        $("#jsmind_container jmnode").click(function () {
            var jm=jsMind.current;
            var curId=jm.get_selected_node().id;
            var parent=jm.get_selected_node().parent;
            var parent2;
            if(parent.parent){
                parent2=parent.parent;
            };
            var children=jm.get_selected_node().children;
            var isChild=function () {
                    var num=0;
                    for(var i=0;i<children.length;i++){
                        var aa=$("#jsmind_container jmnode[nodeid="+children[i].id+"]").hasClass("activeselected");
                        if(aa){
                            num++;
                        }
                    }
                    if(num==0){
                        return false;
                    }else{
                        return true;
                    }
            }

            if($(this).hasClass("activeselected")){
                $(this).removeClass("activeselected");
            }else{
                $(this).addClass("activeselected");
                $("#jsmind_container jmnode[nodeid="+parent.id+"]").removeClass("activeselected");
                if(parent.parent){
                    $("#jsmind_container jmnode[nodeid="+parent2.id+"]").removeClass("activeselected");
                };
                if(isChild()){
                    $(this).removeClass("activeselected");
                }
            }
        });

        
        if(!dimList){
            $("#content01").addClass("hide");//解决jmind适配问题
        }


    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 编辑观察计划详情
function courseDetail_port(id) {
    var data={
            id:id
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchPlanDetail,param,courseDetail_callback);
}
function courseDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.begintime01=new Date(data.begintime*1000).Format("yyyy-MM-dd");
        data.endtime01=new Date(data.endtime*1000).Format("yyyy-MM-dd");

        $("#planName").val(data.name);
        $("#planTarget").val(data.target);
        $("#planDiffpoint").val(data.diffpoint);
        $("#planKeypoint").val(data.keypoint);
        $("#planPrepare").val(data.prepare);
        $("#planBegintime").val(data.begintime01);
        $("#planEndtime").val(data.endtime01);

        // 观察维度接口
        $("#jsmind_container").empty();
        var newdata=JSON.stringify(data.companyDimList).replace(/name/g,'topic').replace(/childDimList/g,'children');
        var mind={
                "meta":{
                    "name":"jsMind remote",
                    "author":"hizzgdev@163.com",
                    "version":"0.2"
                },
                "format":"node_tree",
                "data":{"id":"root","topic":"维度能力","children":JSON.parse(newdata)}
        };
        var options={
                container:'jsmind_container',
                editable:false,
                theme:'primary',
                view:{
                    hmargin:0
                },
                layout:{
                    hspace:45,
                    vspace:10,
                    pspace:15
                }

        }
        jsMind.show(options,mind);

        $("#jsmind_container jmnode").click(function () {
            var jm=jsMind.current;
            var curId=jm.get_selected_node().id;
            var parent=jm.get_selected_node().parent;
            var parent2;
            if(parent.parent){
                parent2=parent.parent;
            };
            var children=jm.get_selected_node().children;
            var isChild=function () {
                    var num=0;
                    for(var i=0;i<children.length;i++){
                        var aa=$("#jsmind_container jmnode[nodeid="+children[i].id+"]").hasClass("activeselected");
                        if(aa){
                            num++;
                        }
                    }
                    if(num==0){
                        return false;
                    }else{
                        return true;
                    }
            }

            if($(this).hasClass("activeselected")){
                $(this).removeClass("activeselected");
            }else{
                $(this).addClass("activeselected");
                $("#jsmind_container jmnode[nodeid="+parent.id+"]").removeClass("activeselected");
                if(parent.parent){
                    $("#jsmind_container jmnode[nodeid="+parent2.id+"]").removeClass("activeselected");
                };
                if(isChild()){
                    $(this).removeClass("activeselected");
                }
            }
        });

        var dimList=data.dimList;
        if(dimList && dimList.length>0){
            for(var i=0;i<dimList.length;i++){
                $("#jsmind_container jmnode").each(function (index,value) {
                   if($(value).attr("nodeid")==dimList[i]){
                        $(value).addClass("activeselected"); 
                   }
                });
            }
        }

        // 关联教师
        if(data.teacherList){
            $(".aboutTeacher span[data-useruuid="+$(".userName").attr("data-useruuid")+"]").removeClass("active");
            for(var i=0;i<data.teacherList.length;i++){
                $(".aboutTeacher >span").each(function (index,value) {
                   if($(value).attr("data-useruuid")==data.teacherList[i]){
                        $(value).addClass("active"); 
                   }
                });
            }
        };
    }
}

// 新增观察计划函数
function courseSave_port(id) {
    var teacherList=[];
    var teachers=$(".aboutTeacher span.active");
    for(var i=0;i<teachers.length;i++){
        teacherList.push(teachers.eq(i).attr("data-useruuid"));
    };
    var dimList=[];
    var dims=$("#jsmind_container jmnode.activeselected");
    for(var i=0;i<dims.length;i++){
        dimList.push(dims.eq(i).attr("nodeid"));
    };
    var data={
                courseDTOStr:{
                    name:$("#planName").val(),
                    target:$("#planTarget").val(),
                    diffpoint:$("#planDiffpoint").val(),
                    begintime:$("#planBegintime").val(),
                    endtime:$("#planEndtime").val(),
                    keypoint:$("#planKeypoint").val(),
                    prepare:$("#planPrepare").val(),
                    teacherList:teacherList,
                    dimList:dimList,
                    id:id // id(0为新增，非0为更新)
                }
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchPlanAddOrUpdate,param,courseSave_callback);
};
function courseSave_callback(res) {
    var currentNum=$("#pagination span.current:not(.next,.prev)").text()
    watchPlanList_port(currentNum);
    $("#cancel").click();
    toastTip("提示","添加成功。。")
};

function isValid() {
    if(!$("#planName").val()){
        $("#planName").addClass('textbox-invalid');
    };
    if(!$("#planTarget").val()){
        $("#planTarget").addClass('textbox-invalid');
    };
    if(!$("#planDiffpoint").val()){
        $("#planDiffpoint").addClass('textbox-invalid');
    };
    if(!$("#planBegintime").val()){
        $("#planBegintime").addClass('textbox-invalid');
    };
    if(!$("#planEndtime").val()){
        $("#planEndtime").addClass('textbox-invalid');
    };
    if(!$("#planKeypoint").val()){
        $("#planKeypoint").addClass('textbox-invalid');
    };
    if(!$("#planPrepare").val()){
        $("#planPrepare").addClass('textbox-invalid');
    };
};
// 开启验证
function onValid() {
    $("#planName,#planTarget,#planDiffpoint,#planBegintime,#planEndtime,#planKeypoint,#planPrepare").keyup(function () {
        if(!$(this).val()){
            $(this).addClass("textbox-invalid");
        }else{
            $(this).removeClass("textbox-invalid");
        }
    });
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
    }else if(res.coed =404){
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
        $("#user >.userName").text(data.name).attr("data-useruuid",data.userUUID);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });

        watchDimensions_port(); // 观察维度接口
        getTeacherList_port(); // 获取学校教师信息接口
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

