$(function () {
    init();
});
function init() {
    menu();
    dateInit();// 年份 月份初始化
    mousehover();

    // 查询条件改变执行函数
    $("#year01,#month01,#teacherClass").change(function () {
        recordStudent_port(); // 获取学生列表（含档案信息）
    });
    $("#searchBtn").click(function () {
        recordStudent_port(); // 获取学生列表（含档案信息）
    });

};

// 年份 月份初始化 
function dateInit() {
    var d=new Date();
    var month={month:[1,2,3,4,5,6,7,8,9,10,11,12]};
    var htmlMonth=template("month_script",month);
    $("#month01").append(htmlMonth).find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);
    var year={year:[2016,2017,2018]};
    var htmlYear=template("year_script",year);
    $("#year01").append(htmlYear).find("option[value="+d.getFullYear()+"]").prop("selected",true);
    watchClassList_port();
};
// 获得教职工所在班级列表
function watchClassList_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.watchClassList,param,watchClassList_callback);
};
function watchClassList_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("teacherClass_script",data);
        $("#teacherClass").empty().append(html);        
        recordStudent_port(); // 获取学生列表（含档案信息）
    };
};
// 获得学生列表
function recordStudent_port() {
    var data={
            year:$("#year01").val(),
            month:$("#month01").val(),
            classId:$("#teacherClass").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId    
        };
    initAjax(httpUrl.recordStudent,param,recordStudent_callback);
};
function recordStudent_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        if(data.length !=0){
            for(var i=0;i<data.length;i++){
                data[i].userPic=httpUrl.path_img+data[i].userPhoto;
                data[i].year=$("#year01").val();
                data[i].month=$("#month01").val();
                data[i].classId=$("#teacherClass").val();
                data[i].value=JSON.stringify(data[i]);
            };
            var json={data:data};
            var html=template("members_script",json);
            $("#members").empty().append(html);
        }else{
            toastTip("提示","此班级下无学生。。");
            $("#members").empty();
        }
    }else{
        if(res.info =="登录信息过期" || res.code == 404){
            $.toast({
                heading: "提示",
                text: "登录信息过期,请重新登录。。",
                showHideTransition: 'slide',
                icon: 'success',
                hideAfter: 2500,
                loaderBg: '#13b5dd',
                position: 'bottom-right',
                afterHidden: function () {
                    window.location.href="../../index.html";
                }
            });
        }
        // console.log('请求错误，返回code非200');
    }
}



function mousehover() {
    // hover显示子图标
    $("#members").on({
        mouseover:function () {
          $(this).children(".firstArea").addClass("current");
        },
        mouseout:function () {
          $(this).children(".firstArea").removeClass("current");
        }
    }," >li >a");

    // 年度档案册hover效果
    $("#yearRecord").on({
        mouseover:function () {
          $(this).addClass("current");
        },
        mouseout:function () {
          $(this).removeClass("current");
        }
    }," >li >div.yearBg");

    // 月度档案册hover效果
    $("#monthRecord").on({
        mouseover:function () {
          $(this).addClass("current");
        },
        mouseout:function () {
          $(this).removeClass("current");
        }
    }," >li >div.monthBg");

    // 查看当前学生年度档案列表
    $("#members").on("click","span.recordList",function () {
        $("#content01 > h1 > small").text($(this).attr("data-username")).attr("data-useruuid",$(this).attr("data-useruuid"));
        $("#content02 > h1 > span,#content02 > h1 > small").text("");
        var data=$(this).attr("data-value");
        recordList_port($(this).attr("data-useruuid"),data);
    });

    // 查看当前学生年度档案列表
    $("#members").on("click","span.addBtn",function () {
        var bookId=$(this).attr("data-needcreate");
        var data=JSON.parse($(this).attr("data-value"));
        if(bookId==0){
            $("#finalBtn").attr("data-value",$(this).attr("data-value")).attr("data-useruuid",$(this).attr("data-useruuid"));
            $("#myModal").modal("show");
        }else{
          window.open("../../memberRecord/memberRecord.html?userUuid="+data.userUuid+"&userName="+data.userName+"&userPhoto="+data.userPhoto+"&bookId="+data.needCreate+"&classId="+data.classId+"&month="+data.month+"&year="+data.year+"&loginId="+getCookie("loginId"));  
        }
    });

    // 查看当前学生月份档案 编辑按钮 弹出函数
    $("#monthRecord").on("click","span.editBtn",function () {
        var data=JSON.parse($(this).attr("data-value"));
        var month=$(this).attr("data-month");
        window.open("../../memberRecord/memberRecord.html?userUuid="+data.userUuid+"&userName="+data.userName+"&userPhoto="+data.userPhoto+"&bookId="+data.needCreate+"&classId="+data.classId+"&month="+month+"&year="+data.year+"&loginId="+getCookie("loginId"));  
    });

    // 新建档案册函数
    $("#myModal").on("click","#finalBtn",function () {
        var name=$("#bookName").val();
        if($("#bookName").val()){
            // console.log(name);
          recordNewDanbook_port($(this).attr("data-useruuid"),$("#bookName").val());
        }else{
          $("#bookName").attr("placeholder","您输入为空，请重新输入");
        }
    });

    // 查看当前学生月度档案列表
    $("#yearRecord").on("click","span.lookBtn",function () {
        $("#content02 > h1 > span").text($(this).attr("data-name"));
        $("#content02 > h1 > small").text($("#content01 > h1 > small").text());

        recordMonthList_port($(this).attr("data-danbookid"));
    });

    // 查看当前学生月度档案列表
    $("#monthRecord").on("click","span.lookBtn",function () {
        var data=JSON.parse($(this).attr("data-picMd5List"));
        for(var i=0;i<data.length;i++){
          data[i]=httpUrl.path_img+data[i];
        };
        var json={data:data};
        var html=template("carousel_img_script",json);
        $("#carousel_img > .carousel-inner").empty().append(html);

        // 轮播插件功能函数
        $(".carousel-control").removeClass("hide");
        var num=$("#carousel_img > .carousel-inner >.item").length;
        if(num==1){
            $(".carousel-control").addClass("hide");
        }else if(num >1){
            $(".carousel-control.prev").addClass("hide");
        }

        // 弹出框显示
        $("#modal-dialog-img").modal("show");
    });
    // 轮播函数
    $("#carousel_img a.prev").click(function () {
        $("#carousel_img > .carousel-inner >.item.active").removeClass("active").prev(".item").addClass("active");
        var num=$("#carousel_img > .carousel-inner >.item").length;
        var index=$("#carousel_img > .carousel-inner >.item.active").index();
        $(".carousel-control.next").removeClass("hide");
        if(index == 0){
            $(".carousel-control.prev").addClass("hide");
        };

        // 解决横向图片显示不全的Bug
        var w=$(".carousel-inner >.item.active >img").width();
        var h=$(".carousel-inner >.item.active >img").height();
        if(w>h){
            $(".carousel-inner >.item.active >img").css({width:"100%",height:"auto",margin:"5% auto 0"});
        }else{
            $(".carousel-inner >.item.active >img").css({width:"auto",height:"100%"});
        };
    });
    $("#carousel_img a.next").click(function () {
        $("#carousel_img > .carousel-inner >.item.active").removeClass("active").next(".item").addClass("active");
        var num=$("#carousel_img > .carousel-inner >.item").length;
        var index=$("#carousel_img > .carousel-inner >.item.active").index();
        $(".carousel-control.prev").removeClass("hide");
        if(index == (num-1)){
            $(".carousel-control.next").addClass("hide");
        };

        var w=$(".carousel-inner >.item.active >img").width();
        var h=$(".carousel-inner >.item.active >img").height();
        if(w>h){
            $(".carousel-inner >.item.active >img").css({width:"100%",height:"auto",margin:"5% auto 0"});
        }else{
            $(".carousel-inner >.item.active >img").css({width:"auto",height:"100%"});
        };
    });
    $(document).keydown(function (e) {
      if($("#modal-dialog-img").hasClass("in")){
          if(e.keyCode ==39){
            if(! $("#carousel_img a.next").hasClass("hide")){
              $("#carousel_img a.next").click();
            }
          }else if(e.keyCode == 37){
            if(! $("#carousel_img a.prev").hasClass("hide")){
              $("#carousel_img a.prev").click();
            }
          }
      }
    });


    // 返回上一层级按钮执行函数
    $("#content01").on("click",".backBtn",function () {
         $(".content").addClass("hide01");
         $("#content").removeClass("hide01");
    });

    $("#content02").on("click",".backBtn",function () {
         $(".content").addClass("hide01");
         $("#content01").removeClass("hide01");
    });


    $("#monthRecord").on("click",".monthBg >span.downBtn",function () {
        $("#filesDown").attr("action",httpUrl.recordDownload);
        $("#filesDown >input[name=loginId]").val(httpUrl.loginId);
        var text=$("#content02 >h1 >small").text()+$("#content02 >h1 >span").text()+$(this).parent(".monthBg").prev(".monthTitle").find("div").text();
        $("#filesDown >input[name=fileName]").val(text);
        $("#filesDown >input[name=fileMd5List]").val($(this).attr("data-picMd5List"));
        $("#filesDown").submit();
    });
    $("#yearRecord").on("click",".yearBg >span.downBtn",function () {
        $("#filesDown").attr("action",httpUrl.recordDownload);
        $("#filesDown >input[name=loginId]").val(httpUrl.loginId);
        var text=$("#content01 >h1 >small").text()+$(this).attr("data-bookname");
        $("#filesDown >input[name=fileName]").val(text);
        if($(this).attr("data-picMd5List")){
            $("#filesDown >input[name=fileMd5List]").val($(this).attr("data-picMd5List"));
            $("#filesDown").submit();
        }else{
            $("#filesDown >input[name=fileMd5List]").val("");
            toastTip("提示","此档案册下无档案页");
        }
    });

    $("#yearRecord").on("dblclick",".yearTitle >span",function () {
        $(this).removeClass("current").next("input").addClass("current").focus();
    });

    $("#yearRecord").on("blur",".yearTitle >input",function () {
        $(this).removeClass("current").prev("span").addClass("current");
    });

    $("#yearRecord").on("keyup",".yearTitle >input",function (e) {
        if(e.keyCode ==13){$(this).blur();};
    });

    $("#yearRecord").on("change",".yearTitle >input",function () {
        recordDanbookUpdate_port($(this).attr("data-danbookid"),$(this).val());
        $(this).prev("span").text($(this).val());
        $(this).parent(".yearTitle").prev(".yearBg").find("span").attr("data-bookname",$(this).val()).attr("data-name",$(this).val());
    });

}


// 查看当前学生年度档案列表 接口
function recordList_port(childUserUuid,value) {
    var data={
            childUserUuid:childUserUuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId    
        };
    initAjax(httpUrl.recordList,param,recordList_callback,value);
};
function recordList_callback(res,value) {
    if(res.code==200 && res.data){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
                data[i].imgUrl=httpUrl.path_img+data[i].imgUrl;
                if(data[i].fileMd5List.length ==0){
                    data[i].picMd5List="";
                }else{
                    data[i].picMd5List=JSON.stringify(data[i].fileMd5List);
                }
                data[i].value=value;
          };
          // console.log(data);
        var json={data:data};
        var html=template("yearRecord_script",json);
        $("#yearRecord").empty().append(html);

        $("#content,#content01,#content02").addClass("hide01");
        $("#content01,#backBtn").removeClass("hide01");
        
    }else if(res.code ==200 && !res.data){
        toastTip("提示","档案册内容为空,请切换筛选条件","2500");
        // console.log('请求错误，返回code非200');
    }
}
// 查看当前学生月份档案列表 接口
function recordMonthList_port(bookId) {
    var data={
            bookId:bookId
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId    
        };
    initAjax(httpUrl.recordMonthList,param,recordMonthList_callback);
};
function recordMonthList_callback(res) {
    if(res.code==200 && res.data){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
                data[i].coverMd5=httpUrl.path_img+data[i].coverMd5;
                data[i].picMd5List=JSON.stringify(data[i].picMd5List);
                data[i].value=$("#yearRecord .lookBtn").attr("data-value");
          };
        var json={data:data};
        var html=template("monthRecord_script",json);
        $("#monthRecord").empty().append(html);

        // 月份档案成功之后的页面切换函数
        $("#content,#content01,#content02").addClass("hide01");
        $("#content02").removeClass("hide01");
        
    }else if(res.code ==200 && !res.data){
        toastTip("提示","此年度档案册内容为空,请切换筛选条件","2500");
        // console.log('请求错误，返回code非200');
    }
}
// 新建档案册 接口
function recordNewDanbook_port(childUserUuid,name) {
    var data={
            childUserUuid:childUserUuid,
            name:name
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId    
        };
    initAjax(httpUrl.recordNewDanbook,param,recordNewDanbook_callback);
};
function recordNewDanbook_callback(res) {
    if(res.code==200 && res.data){
        var data=JSON.parse($("#finalBtn").attr("data-value"));
        window.open("../../memberRecord/memberRecord.html?userUuid="+data.userUuid+"&userName="+data.userName+"&userPhoto="+data.userPhoto+"&bookId="+res.data+"&classId="+data.classId+"&month="+data.month+"&year="+data.year+"&loginId="+getCookie("loginId"));  

        $("#myModal").modal("hide");
        recordStudent_port();//重新刷新主学生列表
    }else if(res.code ==200 && !res.data){
        console.log('请求错误，返回code非200');
    }
}

// 修改档案册名称 接口
function recordDanbookUpdate_port(id,name) {
    var data={
            id:id,
            name:name
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId    
        };
        // console.log(param);
    initAjax(httpUrl.recordDanbookUpdate,param,recordDanbookUpdate_callback);
};
function recordDanbookUpdate_callback(res) {
    if(res.code==200){

    }
};

































// 菜单
function menu() {
    menuChildList_port(user.pid);
    $("#switch").click(function () {
        var aa=$(this);
        $(this).prev("#sidebarBox").fadeToggle(function () {
            aa.toggleClass("active");
            $(".content").toggleClass("active");
        });
    });
    $("#subMenu").on("click","a.hasTitle",function () {
        $(this).toggleClass("active");
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
    initAjax(httpUrl.menuChildList,param,menuChildList_callback,menuId);
};
function menuChildList_callback(res,menuId) {
    if(res.code==200){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img
        };
        for(var i=0;i<data.arr.length;i++){
            data.arr[i].iconArr=data.arr[i].icon.split(",");
            data.arr[i].pid=menuId;
            data.arr[i].url=data.arr[i].url.split("/")[2];
            if(data.arr[i].id == user.sid){
                data.arr[i].newId=function () {return data.arr[i].id+"&t="+(new Date().getTime())}();
                data.arr[i].current=true;
            }else{
                data.arr[i].newId=function () {return data.arr[i].id+"&t="+(new Date().getTime())}();
                data.arr[i].current=false;
            };
        };
        
        var html=template("menu_script",data);
        $("#subMenu").empty().append(html);
        chooseNiceScroll("#sidebarBox","transparent");

        loginUserInfo_port();
    }else if(res.coed =404){
        // window.location.href=path;
    };
};


// 获得登录人信息
function loginUserInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.loginUserInfo,param,loginUserInfo_callback);
};
function loginUserInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;
        $("#user >.userName").text(data.name);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
    };
};