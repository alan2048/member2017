$(function () {
    init();
});
function init() {
    menu();

    // 年份选择初始化
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
    $("#month01").append(htmlMonth);

    watchConfigMonthList_port();

    // 新增
    $("#buttonBox").on("click","#newBtn",function () {
        $("#modal-month").modal("show");
    });

    // 新增月份
    $("#new").click(function () {
        $("#modal-month").modal("hide");
        $("#content01 .pageTitle >i").text($("#month01 >option:selected").text()).attr("data-id",$("#month01").val());
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-id","");
        $("#tableBox").empty();
        watchConfigAllDim_port();
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

    // 查看当月详情
    $("#member").on("click",".monthBox",function () {
        $("#content01").find(".pageTitle >small").text("").attr("data-id","");
        $("#content01 .pageTitle >i").text($(this).attr("data-id")+"月").attr("data-id","");
        $("#tableBox").empty();
        $(".content").addClass("hide");
        $("#content01").removeClass("hide");
        watchConfigDetail_port($(this).attr("data-id"));
    });

    editTable();// 编辑表格
};

// 编辑表格
function editTable() {
    $("#tableBox").on("click",".table.current tbody >tr >td",function () {
        if($(this).hasClass("active")){
            $("#tableBox tbody >tr >td[data-fatherid="+$(this).attr("data-fatherid")+"]").removeClass("active").parent("tr").removeClass("active");
        }else{
            $("#tableBox tbody >tr >td[data-fatherid="+$(this).attr("data-fatherid")+"]").removeClass("active").parent("tr").removeClass("active");
            $(this).toggleClass("active").siblings().toggleClass("active").parent("tr").toggleClass("active");
        };
    });

    $("#tableBox").on("click","#save",function () {
        var arr=[];
        for(var i=0;i<$("#tableBox tr.active").length;i++){
            if($("#tableBox tr.active").eq(i).attr("data-id")){
                arr.push($("#tableBox tr.active").eq(i).attr("data-id"));
            };
            arr.push($("#tableBox tr.active").eq(i).attr("data-fatherid"),$("#tableBox tr.active").eq(i).attr("data-grandfatherid"),$("#tableBox tr.active").eq(i).attr("data-grandgrandfatherid"));
        };
        var newArr=distinct(arr);


        var firstArr=[];
        for(var i=0;i<$("#tableBox tr").length;i++){
            if($("#tableBox tr").eq(i).attr("data-grandgrandfatherid")){
                firstArr.push($("#tableBox tr").eq(i).attr("data-grandgrandfatherid"));
            };
        };
        var firstArr01=distinct(firstArr);

        var n=0;
        for(var i=0;i<firstArr.length;i++){
            if(!isInArray(newArr,firstArr[i])){
                n++;
                break;
            };
        };

        if(n==0){
            watchConfigAdd_port(newArr);
        }else{
            toastTip("提示","每个领域至少选中一项。。");
        };
    });
};

function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}


// 获取所有月份配置列表
function watchConfigMonthList_port() {
    var data={
            year:$("#year").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchConfigMonthList,param,watchConfigMonthList_callback);
};
function watchConfigMonthList_callback(res) {
    if(res.code==200){
        var arr=JSON.parse(res.data);
        var newArr=[];
        for(var i=0;i<arr.length;i++){
            if(arr[i]<10){
                var obj={
                        first:0,
                        second:arr[i],
                        name:arr[i]
                };
                newArr.push(obj);
            }else{
                var obj={
                        first:1,
                        second:arr[i].toString().slice(1),
                        name:arr[i]
                };
                newArr.push(obj);
            }
        };
        var html=template("member_script",{arr:newArr});
        $("#member").empty().append(html);
    };
};

// 新增月度评价配置
function watchConfigAdd_port(arr) {
    var data={
            month:$("#month02").attr("data-id"),
            year:$("#year").val(),
            dimIds:arr.join()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchConfigAdd,param,watchConfigAdd_callback);
};
function watchConfigAdd_callback(res) {
    if(res.code==200){
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
        watchConfigMonthList_port();
    };
};

// 获取学校配置所有维度
function watchConfigAllDim_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchConfigAllDim,param,watchConfigAllDim_callback);
};
function watchConfigAllDim_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
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

        json={arr:arr,firstDim:JSON.stringify(firstDim)};
        var html=template("tableBox_script",json);
        $("#tableBox").empty().append(html);
        $(".table").addClass("current");
        $(".newBtnBox").show();

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
    }else{
        toastTip("提示",res.info);
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

// 获取月度评价配置详情
function watchConfigDetail_port(monthid) {
    var data={
            year:$("#year").val(),
            month:monthid
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchConfigDetail,param,watchConfigDetail_callback);
};
function watchConfigDetail_callback(res) {
    if(res.code==200){

        var data=JSON.parse(res.data);
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

        json={arr:arr,firstDim:JSON.stringify(firstDim)};
        var html=template("tableBox_script",json);
        $("#tableBox").empty().append(html);
        $(".table").removeClass("current");
        $(".newBtnBox").hide();

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