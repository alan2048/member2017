$(function () {
    init();
});
function init() {
    menuList_port();
};

// 左侧 菜单接口
function menuList_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuList,param,menuList_callback);
};
function menuList_callback(res) {
    if(res.code==200){
    	var data=JSON.parse(res.data);
        console.log(data);
    };
};