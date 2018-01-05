// 成长档案
httpUrl.classList=path+"/app/mbtrack/search/user/classList"; // 获取当前人所在班级
httpUrl.studentList=path+"/app/mbtrack/search/class/studentList"; // 获取班级的幼儿列表
httpUrl.danList=path+"/app/mbtrack/child/danList"; // 获取幼儿的档案列表

winResize();
$(function () {
    // 年份选择初始化
    var d=new Date();
    var year={arr:[]};
    for(var i=d.getFullYear();i>2015;i--){
        year.arr.push(i)
    };
    var yearMonth=template("year_script",year);
    $("#year").append(yearMonth);

	init();
    $("#page-loader").addClass("hide");
}); 
function winResize() {
    var fs=$(window).width()/750*100;
    $("html").css("font-size",fs);
    $(window).resize(function () {
        var fs01=$(window).width()/750*100;
        $("html").css("font-size",fs01);
    });
}; 
function init() {
	classList_port();
    $("#children,#year").change(function () {
         danList_port();
    });
	
    $("#recordBody").on("click",".month img",function () {
        var data=JSON.parse($(this).attr("data-pic"));
        var openPhotoSwipe = function() {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var items = [];
            for(var i=0;i<data.length;i++){
                var obj={
                        src:httpUrl.path_img+data[i],
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

// 获取当前人所在班级
function classList_port() {
    var data={
    		useruuid:user.useruuid
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
        studentList_port();// 获取班级的幼儿列表
        $("#class").change(function () {
            studentList_port(); 
        });
    }else{
    	// alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 获取班级的幼儿列表
function studentList_port() {
    var data={
            classId:$("#class").val(),
            useruuid:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.studentList,param,studentList_callback);
};
function studentList_callback(res) {
    if(res.code==200 && res.data){
        var data={arr:JSON.parse(res.data)};
        if(data.arr.length ==0){
            $("#children").empty();
            $("#recordBody > ul").empty();
        }else{
            var html=template("children_script",data);
            $("#children").empty().append(html);
            danList_port(); // 获取幼儿的档案列表
        };
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 获取幼儿的档案列表
function danList_port() {
    var data={
            childUserUuid:$("#children").val(),
            year:$("#year").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.danList,param,danList_callback);
};
function danList_callback(res) {
    if(res.code==200 && res.data){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img
            };
        for(var i=0;i<data.arr.length;i++){
            data.arr[i].picMd5List=JSON.stringify(data.arr[i].picMd5List);
        };
        var html=template("recordBody_script",data);
        $("#recordBody > ul").empty().append(html);
    }else{
        $("#recordBody > ul").empty();
        console.log(res);
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};