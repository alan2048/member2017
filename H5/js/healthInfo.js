// 成长档案
httpUrl.classList=path+"/app/basic/myClassInfo"; // 获取当前人所在班级
httpUrl.getExamDateList=path+"/app/healthInfo/getExamDateList"; // 根据班级获得检查日期列表
httpUrl.healthInfoH5=path+"/app/healthInfo/healthInfoH5"; // 获得健康信息H5列表

winResize();
$(function () {
	init();
    $("#page-loader").addClass("hide");
}); 
function init() {
    loginUserInfo_port();
    $("#children,#year").change(function () {
         healthInfoH5_port();
    });
	
    $("#recordBody").on("click",".month img",function () {
        var data=JSON.parse($(this).attr("data-pic"));
        var openPhotoSwipe = function() {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var items = [];
            for(var i=0;i<data.length;i++){
                var obj={
                        src:httpUrl.path_img+data[i]+"&minpic=0",
                        w:650,
                        h:910
                };
                items.push(obj);
            };
            var options = {    
                    history: false,
                    focus: false,
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
            };
            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };
        openPhotoSwipe();
    });  
};

// 获得登录人员信息
function loginUserInfo_port() {
    var data={
            userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.loginUserInfo,param,loginUserInfo_callback);
};
function loginUserInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        user.typeID=data.typeID;
        if(user.typeID !=20){
            $(".nav").removeClass("hide");
        };
        classList_port();
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 获取当前人所在班级
function classList_port() {
    var data={
    		userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.classList,param,classList_callback);
};
function classList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("class_script",data);
        $("#class").empty().append(html);
        if(user.typeID !=20){
            getExamDateList_port();// 获取班级的幼儿列表
        }else{
            healthInfoH5_port();
        };
        $("#class").change(function () {
            getExamDateList_port(); 
        });
    }else{
    	// alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 根据班级获得检查日期列表
function getExamDateList_port() {
    var data={
            classUUID:$("#class").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getExamDateList,param,getExamDateList_callback);
};
function getExamDateList_callback(res) {
    if(res.code==200 && res.data){
        var data={arr:JSON.parse(res.data)};
        if(data.arr.length ==0){
            $("#children").empty().append("<option value=''>无信息</option>");
            $("#recordBody > ul").empty().append("<li class='nobody'></li>");
        }else{
            var html=template("children_script",data);
            $("#children").empty().append(html);
            healthInfoH5_port(); // 获取幼儿的档案列表
        };
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 获取幼儿的档案列表
function healthInfoH5_port() {
    if(user.typeID !=20){
        var data={
            classUUID:$("#class").val(),
            loginUserUUID:user.useruuid,
            examDate:$("#children").val()
        };
    }else{
        var data={
            classUUID:$("#class").val(),
            loginUserUUID:user.useruuid
        };
    };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.healthInfoH5,param,healthInfoH5_callback);
};
function healthInfoH5_callback(res) {
    if(res.code==200 && res.data){
        var data={arr:JSON.parse(res.data)};
        if(data.arr.length ==0){
            $("#children").empty().append("<option value=''>无信息</option>");
            $("#recordBody > ul").empty().append("<li class='nobody'></li>");
        }else{
            var html=template("recordBody_script",data);
            $("#recordBody > ul").empty().append(html);
        };
    }else{
        $("#recordBody > ul").empty();
        console.log(res);
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

function winResize() {
    var fs=$(window).width()/750*100;
    $("html").css("font-size",fs);
    $(window).resize(function () {
        var fs01=$(window).width()/750*100;
        $("html").css("font-size",fs01);
    });
}; 