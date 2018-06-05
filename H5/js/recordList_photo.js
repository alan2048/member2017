// 成长档案
httpUrl.danList=path+"/app/mbtrack/book/danList"; // 获取档案册档案页列表
user.bookId=GetQueryString("bookId");

winResize();
$(function () {
	init();
}); 
function init() {
	danList_port();
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

        /*scaleW=window.innerWidth/320;
          scaleH=window.innerHeight/480;
          var resizes = document.querySelectorAll('.resize');
          for (var j=0; j<resizes.length; j++) {
               resizes[j].style.width=parseInt(resizes[j].style.width)*scaleW+'px';
             resizes[j].style.height=parseInt(resizes[j].style.height)*scaleH+'px';
             resizes[j].style.top=parseInt(resizes[j].style.top)*scaleH+'px';
             resizes[j].style.left=parseInt(resizes[j].style.left)*scaleW+'px'; 
          }
          var scales = document.querySelectorAll('.txt');
          for (var i=0; i<scales.length; i++) {
             ss=scales[i].style;
             ss.webkitTransform = ss.MsTransform = ss.msTransform = ss.MozTransform = ss.OTransform =ss.transform='translateX('+scales[i].offsetWidth*(scaleW-1)/2+'px) translateY('+scales[i].offsetHeight*(scaleH-1)/2+'px)scaleX('+scaleW+') scaleY('+scaleH+') ';
          }*/


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