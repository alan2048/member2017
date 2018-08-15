// 成长档案
httpUrl.danList=path+"/app/mbtrack/book/danList"; // 获取档案册档案页列表
user.bookId=GetQueryString("bookId");

winResize();
$(function () {
	init();
}); 
function init() {
	danList_port();

    var audio=document.getElementById("audio");
    if(audio.paused){
        $(audio).parent().removeClass("running").addClass("paused");
    }else{
        $(audio).parent().addClass("running").removeClass("paused");
    };
    $(".audio").click(function () {
        var audio=document.getElementById("audio");
        if(audio.paused){
            audio.play();
            $(audio).parent().addClass("running").removeClass("paused");
        }else{
            audio.pause();
            $(audio).parent().removeClass("running").addClass("paused");
        };
    });
};

// 获取档案册列表
function danList_port() {
    var data={
            bookId:user.bookId
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.danList,param,danList_callback);
};
function danList_callback(res) {
    if(res.code==200 && res.data){
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;
        data.nameArr=data.name.split("-");

        var html=template("swiper_script",data);
        $(".swiper-wrapper").append(html);

        var total=data.pictureList.length+1;// 总页码
        var mySwiper = new Swiper('.swiper-container', {
                direction:"vertical",
                loop:true,
                mousewheel:true,
                keyboard : true,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'progressbar',
                    progressbarOpposite:true,
                    renderProgressbar: function (progressbarFillClass) {
                        return '<span class="' + progressbarFillClass + '"></span>'+'<div class="customProgress"><span class="swiper-pagination-current">1</span>/<span class="swiper-pagination-total">'+total+'</span></div>';
                    }
                },
                on:{
                    init: function(){
                        swiperAnimateCache(this);
                        swiperAnimate(this);
                    },
                    slideChangeTransitionEnd: function(){
                        if(this.activeIndex > total){
                            $(".swiper-pagination-current").text(1);// 页码动态显示
                        }else if(this.activeIndex ==0){
                            $(".swiper-pagination-current").text(total);// 页码动态显示
                        }else{
                            $(".swiper-pagination-current").text(this.activeIndex);// 页码动态显示
                        };
                        
                        swiperAnimate(this);
                    }
                }
        });

    }else{
        console.log(res);
    };
};

function winResize() {
    var fs=$(window).width()/750*100;
    $("html").css("font-size",fs);
    $(window).resize(function () {
        var fs01=$(window).width()/750*100;
        $("html").css("font-size",fs01);
    });
}; 