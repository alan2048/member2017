$(function () {
    init();
});
function init() {
    menu();
    yearInit();// 年份选择初始化
    editTable();// 编辑表格

    // 查看当月详情
    $("#member").on("click",".monthBox",function () {
        $("#content01 .pageTitle >i").text($("#month").val()+"月").attr("data-id","");
        $("#tableBox").empty();
        $(".content").addClass("hide");
        $("#content01").removeClass("hide");

        var data={
                id:$(this).attr("data-id"),
                childUserUuid:$(this).attr("data-userid"),
                name:$(this).attr("data-name")
        };
        watchConfigDetail_port(data);
    });
};

// 年份选择初始化
function yearInit() {
    var d=new Date();
    var year={arr:[d.getFullYear()+1]};
    for(var i=d.getFullYear();i>2015;i--){
        year.arr.push(i)
    };
    year.arr.reverse();
    var yearMonth=template("year_script",year);
    $(".year").append(yearMonth).find("option[value="+d.getFullYear()+"]").prop("selected",true);

    var month={month:[1,2,3,4,5,6,7,8,9,10,11,12]};
    var htmlMonth=template("month_script",month);
    $("#month").append(htmlMonth).find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);

    watchClassList_port();// 获得教职工所在班级列表
    $("#year,#month,#teacherClass").change(function () {
        watchStudentInfo_port();// 获得教职工所在班级列表
    });

    $("#searchBtn").click(function () {
        watchStudentInfo_port();// 获得教职工所在班级列表
    });
};

// 编辑表格
function editTable() {
    $("#tableBox").on("click",".table tbody >tr >td",function () {
        $(this).addClass("active").siblings().removeClass("active").parent().addClass("active");
    });

    $("#tableBox").on("click","#save",function () {
        var n=0;
        for(var i=0;i<$(".table >tbody >tr").length;i++){
            if(!$(".table >tbody >tr").eq(i).hasClass("active")){
                n++;
                break;
            };
        };

        if(n==0){
            watchStudentAddOrUpdate_port();
        }else{
            toastTip("提示","每个领域至少选中一项。。");
        };
    });

    // 返回上级
    $(".backBtn").click(function () {
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });

    $("#tableBox").on("click","#quit",function () {
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    });
};

// 获得教职工所在班级列表
function watchClassList_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchClassList,param,watchClassList_callback);
};
function watchClassList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").empty().append(html); 
        watchStudentInfo_port();       
    };
};

// 月度评价学生列表
function watchStudentInfo_port() {
    var data={
            year:$("#year").val(),
            month:$("#month").val(),
            classId:$("#teacherClass").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchStudentInfo,param,watchStudentInfo_callback);
};
function watchStudentInfo_callback(res) {
    if(res.code==200){
        var arr=JSON.parse(res.data);
        var html=template("member_script",{arr:arr,path_img:httpUrl.path_img});
        $("#member").empty().append(html);
    };
};

// 获取月度评价配置详情
function watchConfigDetail_port(user) {
    var data={
            year:$("#year").val(),
            month:$("#month").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchConfigDetail,param,watchConfigDetail_callback,user);
};
function watchConfigDetail_callback(res,user) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        console.log(data);
        // 过滤 领域至少选择一项
        var firstDim=[];
        for(var i=0;i<data.length;i++){
            firstDim.push(data[i].id);
        };
        
        // 树结构转arr平行
        var arr=[];
        for(var i=0;i<data.length;i++){
            for(var j=0;j<data[i].childDimList.length;j++){
                for(var n=0;n<data[i].childDimList[j].childDimList.length;n++){
                    if(data[i].childDimList[j].childDimList[n].childDimList.length==0){
                        var obj={id:"",name:data[i].childDimList[j].childDimList[n].name};
                        obj.father=data[i].childDimList[j].childDimList[n];
                        obj.grandfather=data[i].childDimList[j];
                        obj.grandgrandfather=data[i];
                        obj.levelVOList=data[i].childDimList[j].childDimList[n].levelVOList.slice(0,3);
                        arr.push(obj);
                    }else{
                        for(var m=0;m<data[i].childDimList[j].childDimList[n].childDimList.length;m++){
                            var obj=data[i].childDimList[j].childDimList[n].childDimList[m];
                            obj.father=data[i].childDimList[j].childDimList[n];
                            obj.grandfather=data[i].childDimList[j];
                            obj.grandgrandfather=data[i];
                            obj.levelVOList=obj.levelVOList.slice(0,3);
                            arr.push(obj);
                        };
                    };
                };
            };
        };

        json={arr:arr,firstDim:JSON.stringify(firstDim),user:user};
        var html=template("tableBox_script",json);
        $("#tableBox").empty().append(html);
        $(".table").removeClass("current");

        var arr01=[];
        for(var i=0;i<arr.length;i++){
            arr01.push(arr[i].father.id);
            arr01.push(arr[i].grandfather.id);
            arr01.push(arr[i].grandgrandfather.id);
        };
        var newArr=distinct(arr01);

        for(var i=0;i<newArr.length;i++){
            $("td[data-id="+newArr[i]+"]").eq(0).attr("rowspan",$("td[data-id="+newArr[i]+"]").length);
            $("td[data-id="+newArr[i]+"]:not(:first)").addClass("hide");
        };

        watchStudentDetail_port(user);
    }else{
        toastTip("提示",res.info);
    };
};

// 学生月度评价详情
function watchStudentDetail_port(user) {
    var data={
            childUserUuid:user.childUserUuid,
            id:user.id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchStudentDetail,param,watchStudentDetail_callback);
};
function watchStudentDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            $("td[data-vid="+data[i]+"]").addClass("active").parent().addClass("active");
        };
    };
};

// 新增或编辑学生月度评价
function watchStudentAddOrUpdate_port() {
    var levelList=[];
    for(var i=0;i<$("td.edit.active").length;i++){
        var obj={
                dimId:$("td.edit.active").eq(i).attr("data-dimid"),
                id:$("td.edit.active").eq(i).attr("data-vid"),
                level:$("td.edit.active").eq(i).attr("data-level")
        };
        levelList.push(obj)
    };

    html2canvas($("#tableCanvas"),{
        allowTaint: true,
        useCORS:true,
        taintTest: false,
        height:$("#tableCanvas").outerHeight(),
        width:$("#tableCanvas").outerWidth(),
        onrendered:function (canvas01) {
            var data={
                    month:$("#month").val(),
                    year:$("#year").val(),
                    childUserUuid:$(".tableTitle").attr("data-child"),
                    id:$(".tableTitle").attr("data-evaluateid"),
                    imgData:canvas01.toDataURL('png'),
                    levelList:JSON.stringify(levelList)
            };
            var param={
                    params:JSON.stringify(data),
                    loginId:httpUrl.loginId
            };
            initAjax(httpUrl.watchStudentAddOrUpdate,param,watchStudentAddOrUpdate_callback);
        }
    });
    
    
};
function watchStudentAddOrUpdate_callback(res) {
    if(res.code==200){
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
        watchStudentInfo_port();
    };
};

// 数组去重
function distinct(arr) {
    var obj = {},
        i = 0,
        len = 0;
    if (Array.isArray(arr) && arr.length > 0) {
        len = arr.length;
        for (i = 0; i < len; i += 1) {
            obj[arr[i]] = arr[i];
        }
        return Object.keys(obj);
    }
    return [];
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
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
    };
};