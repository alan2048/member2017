$(function () {
    menu();
    init();
});
function init() {
    basicCompanyList_port();
    classInfo_port();
};

//  获得班级列表及人员数量
function basicCompanyList_port(pageNum) {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicCompanyList,param,basicCompanyList_callback);
};
function basicCompanyList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        console.log(data);
    };
};


//  获得班级列表及人员数量
function classInfo_port(pageNum) {
    var data={
            pageNum:pageNum || 1,
            pageSize:12,
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classInfo,param,classInfo_callback);
};
function classInfo_callback(res) {
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
    };
};


//   获得班级教职工列表
function classOfStaff_port(classUUID) {
    var data={
            classUUID: classUUID  
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.classOfStaff,param,classOfStaff_callback,data.userUUID);
};
function classOfStaff_callback(res,userUUID) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("tableBox01_script",data);
        $("#tableBox01").empty().append(html);
    }else{
        toastTip("提示",res.info);
    };
};




// Row行选择函数
function chooseRow() {
    chooseNiceScroll("#tableBox");
    $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    $(".table.table-email thead tr i").click(function () {
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
    $(".table.table-email tbody tr >td.email-select").click(function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
        };
        ValidateBtn();
    });

    $(".table.table-email tbody tr >td.email-sender").on({
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
            $(".ui-dialog-arrow-a, .ui-dialog-arrow-b").css("top",e.pageY-140);
            classOfStaff_port($(this).prevAll("td.email-select").find("i").attr("data-classuuid"));   
        }
    });
};

