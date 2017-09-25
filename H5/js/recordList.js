winResize();
$(function () {
	init();
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
	
    $('.full').swipeSlide({
        continuousScroll : true,
        axisX : true,
        autoSwipe : false,
        lazyLoad : true
    });

    $("#recordBody").on("click",".month img",function () {
        var data={
                arr:JSON.parse($(this).attr("data-pic")),
                path_img:httpUrl.path_img
        };
        console.log(data);
        var html=template("slide_script",data);
        $(".slide").empty().append(html);
        $(".slide_box").show();

        // swipeSlide
        $('.slide').swipeSlide({
            index : 0,
            continuousScroll : true,
            autoSwipe : false,
            lazyLoad : true,
            firstCallback : function(i,sum){
                $('.num_box .num').text(i+1);
                $('.num_box .sum').text(sum);
            },
            callback : function(i,sum){
                $('.num_box .num').text(i+1);
                $('.num_box .sum').text(sum);
            }
        });
    });  

    // 关闭按钮
    $('.btn_close').on('click',function(){
        $('.slide').empty();
        $('.slide_box').hide();
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
        
        console.log(data);
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

        
        console.log(data);
    }else{
        $("#recordBody > ul").empty();
        console.log(res);
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};