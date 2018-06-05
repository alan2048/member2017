// 成长档案
httpUrl.classList=path+"/app/mbtrack/search/user/classList"; // 获取当前人所在班级
httpUrl.studentList=path+"/app/mbtrack/search/class/studentList"; // 获取班级的幼儿列表
httpUrl.bookList=path+"/app/mbtrack/child/bookList"; // 获取档案册列表

winResize();
$(function () {
	init();
    $("#page-loader").addClass("hide");
}); 
function init() {
	classList_port();
    $("#children").change(function () {
         bookList_port();
    });
	
    $("body").on("click",".month img",function () {
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
            bookList_port();
        };
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 获取档案册列表
function bookList_port() {
    var data={
            childUserUuid:$("#children").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.bookList,param,bookList_callback);
};
function bookList_callback(res) {
    if(res.code==200 && res.data){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img
        };

        for(var i=0;i<data.arr.length;i++){
            for(var j=0;j<data.arr[i].monthDanVOList.length;j++){
                data.arr[i].monthDanVOList[j].picMd5List=JSON.stringify(data.arr[i].monthDanVOList[j].picMd5List);
            }
        };

        var html=template("swiper_script",data);
        $(".swiper-container").remove();
        $("body").append(html);

        var mySwiper = new Swiper('.swiper-container', {
                slidesPerView: 'auto',
                centeredSlides: !0,
                watchSlidesProgress: !0,
                onProgress: function (a) {
                    var b,c,d;
                    for (b = 0; b < a.slides.length; b++) c = a.slides[b],
                    d = c.progress,
                    scale = 1 - Math.min(Math.abs(0.2 * d), 1),
                    es = c.style,
                    es.opacity = 1 - Math.min(Math.abs(d / 2), 1),
                    es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0px,0,' + - Math.abs(150 * d) + 'px)'
                },
                onSetTransition: function (a, b) {
                    for (var c = 0; c < a.slides.length; c++) es = a.slides[c].style,
                    es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = b + 'ms'
                }
        });
    }else{
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


//进入全屏  
function requestFullScreen() {  
    var de = document.documentElement;  
    if (de.requestFullscreen) {  
        de.requestFullscreen();  
    } else if (de.mozRequestFullScreen) {  
        de.mozRequestFullScreen();  
    } else if (de.webkitRequestFullScreen) {  
        de.webkitRequestFullScreen();  
    }  
} 
//退出全屏  
function exitFullscreen() {  
    var de = document;  
    if (de.exitFullscreen) {  
        de.exitFullscreen();  
    } else if (de.mozCancelFullScreen) {  
        de.mozCancelFullScreen();  
    } else if (de.webkitCancelFullScreen) {  
        de.webkitCancelFullScreen();  
    }  
}