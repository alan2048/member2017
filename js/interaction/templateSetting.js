$(function () {
    init();
});
function init() {
    menu();
    dateInit();// 年份 月份初始化

    // 查询条件改变执行函数
    $("#year01").change(function () {
        recordTemCompanyMonthPageList_port(); 
    });
    $("#searchBtn").click(function () {
        recordTemCompanyMonthPageList_port(); 
    });

    // 新增
    $("#content").on("click",".addBtn",function () {
        $(".templateBg").removeClass("active");
        $("#official").removeClass("active in");
        $("#company").addClass("active in").find(".templateBg").eq(0).addClass("active");
        $("#picTab >li").eq(0).addClass("active").siblings().removeClass("active");

        $("#picBtn").attr("data-id",$(this).attr("data-id")).attr("data-month",$(this).attr("data-month"));
        $("#modal-dialog-qunzu").modal("show");
    });

    // 编辑
    $("#content").on("click",".editBtn",function () {
        $(".templateBg").removeClass("active");
        $(".templateBg[data-pageid="+$(this).attr("data-pageid")+"]").addClass("active");

        if($(".templateBg[data-pageid="+$(this).attr("data-pageid")+"]").length !=0){
            $("#official,#company").removeClass("active in");
            $("#picTab >li").removeClass("active");

            var index=$(".templateBg[data-pageid="+$(this).attr("data-pageid")+"]").parents(".tab-pane").index();
            $("#picTab >li").eq(index).addClass("active");
            $("#picTabContent >div").eq(index).addClass("active in");
        };

        $("#picBtn").attr("data-id",$(this).attr("data-id")).attr("data-month",$(this).attr("data-month"));
        $("#modal-dialog-qunzu").modal("show");
    });

    // 切换tab
    $("#picTab >li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#picTabContent >div").eq($(this).index()).addClass("active in").siblings().removeClass("active in");
    });

    // 选中
    $("#picTabContent").on("click",".templateBg",function () {
        $(".templateBg").removeClass("active");
        $(this).addClass("active");
    });

    // 确定
    $("#modal-dialog-qunzu").on("click","#picBtn",function () {
        if($(".templateBg.active").length !=0){
            recordTemAddOrUpdate_port();
        }else{
            toastTip("提示","请先选择一项模板");
        }
    });
};

// 年份 月份初始化 
function dateInit() {
    var curYear=new Date().getFullYear();
    var year={year:[]};
    for(var i=2016;i<=curYear;i++){
        year.year.push(i)
    };
    var htmlYear=template("year_script",year);
    $("#year01").append(htmlYear).find("option[value="+curYear+"]").prop("selected",true);
};
// 获取学校每月相册模版列表
function recordTemCompanyMonthPageList_port() {
    var data={
            year:$("#year01").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordTemCompanyMonthPageList,param,recordTemCompanyMonthPageList_callback);
};
function recordTemCompanyMonthPageList_callback(res) {
    if(res.code==200){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img
        };
        console.log(data);
        var html=template("yearBox_script",data);
        $("#yearBox").empty().append(html);
    };
};

// 获取所有可选的模板库
function recordTemListOfAllPage_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordTemListOfAllPage,param,recordTemListOfAllPage_callback);
};
function recordTemListOfAllPage_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;
        var html01=template("picMain01_script",data);
        $("#company >.picMain").empty().append(html01);

        var html02=template("picMain02_script",data);
        $("#official >.picMain").empty().append(html02);
        chooseNiceScroll("#company");
        chooseNiceScroll("#official");
        console.log(data);
        
    };
};

// 新增或编辑某月的模板
function recordTemAddOrUpdate_port() {
    var data={
            id:$("#picBtn").attr("data-id"),
            month:$("#picBtn").attr("data-month"),
            pageId:$(".templateBg.active").attr("data-pageid"),
            year:$("#year01").val()
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordTemAddOrUpdate,param,recordTemAddOrUpdate_callback);
};
function recordTemAddOrUpdate_callback(res) {
    if(res.code==200){
        $("#modal-dialog-qunzu").modal("hide");
        toastTip("提示",res.info);
        recordTemCompanyMonthPageList_port()
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
    }else if(res.coed =404){
        // window.location.href=path;
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

        recordTemCompanyMonthPageList_port();
        recordTemListOfAllPage_port(); 
    };
};