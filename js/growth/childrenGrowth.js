$(function () {
    init();
});
function init() {
    growthLabel_port();

    // 点击标签 切换list内容
    $("#label").on("click","span",function () {
        $(this).addClass("active").siblings().removeClass("active");
        growthList_port(user.classId,0,$("#label >span.active").attr("data-id"),0);
    });

    // 切换班级
    $("#logo .curClass").click(function () {
        growthStudent_port(user.classId);
    });  
};

// 获取学校所有的标签
function growthLabel_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthLabel,param,growthLabel_callback);
};
function growthLabel_callback(res) {
    if(res.code=200){
        var data={arr:JSON.parse(res.data)};
        var html=template("lable_script",data);
        $("#label").empty().append(html);
        growthList_port(user.classId,0,$("#label >span.active").attr("data-id"),0);
    };
};



// 获取班级内容列表
function growthList_port(classId,idMax,labelId,type) {
    var data={
            classId:classId,
            idMax:idMax,
            labelId:labelId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthList,param,growthList_callback,type);
};
function growthList_callback(res,type) {
    if(res.code=200){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img
            };
        var html=template("list_script",data);
        if(type ==0){
            $("#list").empty().append(html);
        }else{
            $("#list").append(html);
        };
        console.log(data);
    };
};

// 获取当前班级学生列表
function growthStudent_port(classId) {
    var data={
            classId:classId
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.growthStudent,param,growthStudent_callback);
};
function growthStudent_callback(res) {
    if(res.code=200){
        console.log(111222);
    };
};