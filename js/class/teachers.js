$(function () {
    init();
});
function init() {
    menuChildList_port("309657696842416129");
    menu();
};

// 菜单
function menu() {
    $("#switch").click(function () {
        var aa=$(this);
        $(this).prev("#sidebarBox").fadeToggle(function () {
            aa.toggleClass("active");
            $("#content").toggleClass("active");
        });
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
    initAjax(httpUrl.menuChildList,param,menuChildList_callback);
};
function menuChildList_callback(res) {
    if(res.code==200){
    	var data=JSON.parse(res.data);
        var data01={
                arr:[{
                    name:"教师信息",
                    id:"1",
                    url:"teachers.html",
                    icon:"1eff1a1fd5d0f2587e2d54aa66ded19a"
                },{
                    name:"幼儿信息",
                    id:"2",
                    url:"children.html",
                    icon:"ed8b3dcebd44ebfc41ac697f09346fb1"
                },{
                    name:"班级管理",
                    id:"3",
                    url:"classManage.html",
                    icon:"1337c7d316df12cbaa67f2bed9803066"
                }],
                path_img:httpUrl.path_img
        };
        var html=template("menu_script",data01);
        $("#subMenu").empty().append(html);
        chooseNiceScroll("#sidebarBox","transparent");
    };
};

// niceScroll滚动条
function chooseNiceScroll(AA,color) {
    $(AA).niceScroll({ 
        cursorcolor: color || "#ccc",//#CC0071 光标颜色 
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
        touchbehavior: true, //使光标拖动滚动像在台式电脑触摸设备 
        cursorwidth: "5px", //像素光标的宽度 
        cursorborder: "0", //     游标边框css定义 
        cursorborderradius: "5px",//以像素为光标边界半径 
        autohidemode: true //是否隐藏滚动条 
    });
};