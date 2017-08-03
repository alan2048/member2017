$(function () {
    init();
});
function init() {
    menu();
    editTable();//编辑表格
    chooseNiceScroll("#menu");

    $("#menu").on("click","li",function () {
        var data=JSON.parse($(this).attr("data-json"));
        healthGetTable_port(data); //获得整张表的内容
    });

    $("#menuList >.hideBtn").click(function () {
        $(this).next("#menu").fadeToggle(200,"linear");
        $("#main >.panel").toggleClass("long");
    });
    menuGetTitleList_port(); //获得菜谱日期列表
};

function editTable() {
    $("#menuMain").on("dblclick","td",function () {
        var text=$(this).text();
        $(this).empty().append("<textarea></textarea>");
        $(this).find("textarea").focus().val(text);
    }).on("focusout","td > textarea",function () {
        var text=$(this).val();
        $(this).parent("td").text(text);
    });

    $("#menuMain").on("dblclick","th",function () {
        var text=$(this).text();
        $(this).empty().append("<textarea></textarea>");
        $(this).find("textarea").focus().val(text);
    }).on("focusout","th > textarea",function () {
        var text=$(this).val();
        $(this).parent("th").text(text);
    });

    // 单击选中行
    $("#menuMain").on("click","tbody >tr",function () {
        $(this).toggleClass("active").siblings().removeClass("active");
    });

    // 新增菜谱
    $("#buttonBox").on("click","#newMenu",function () {
        $("#myModal").modal("show");
    });

    // 新增菜谱
    $("#finalBtn").click(function () {
        for(var i=0;i<$("input.fill").length;i++){
            if(!$("input.fill").eq(i).val()){
                $("input.fill").eq(i).addClass("empty");
            }
        }

        if($("input.fill").hasClass("empty")){
            $("input.fill").focus();
        }else{
            var json={
                    title:$("#healthTitle").val(),
                    startTime:$("#planBegintime").val(),
                    endTime:$("#planEndtime").val()
            };
        
            var arr=[];
            for(var i=0;i<$("#healthLine").val();i++){
                arr.push([]);
            };
            for(var i=0;i<arr.length;i++){
                for(var j=0;j<$("#healthCol").val();j++){
                    arr[i].push("")
                }
            };
            var res={
                    code:200,
                    data:JSON.stringify(arr)
            };
            healthGetTable_callback(res,json);
            $("#myModal").modal("hide");
        };
    });

    // 修改表格标题
    $("#menuMain").on("dblclick",".conTitle",function () {
        var json=JSON.parse($(this).attr("data-json"));
        $(this).text("").append("<input type=\"text\" >").children("input").focus().val(json.title);
    });

    $("#menuMain").on("focusout",".conTitle >input",function () {
        var json=JSON.parse($(this).parent(".conTitle").attr("data-json"));
        json.title=$(this).val();
        $(this).parent(".conTitle").attr("data-json",JSON.stringify(json)).empty().text(json.title);
    });

    // 验证必填项
    $("input.fill").keyup(function () {
        if($(this).val()){
            $(this).removeClass("empty")
        }else{
            $(this).addClass("empty")
        }
    });

    $(".btn-quit").click(function () {
        $("#menuMain").empty();
    });

    // 新增行
    $("#buttonBox").on("click","#newLine",function () {
        console.log(111);
        if($("#menuMain > table").length !=0){
            var aa="<td></td>";
            var html="";
            for(var i=0;i<$("#menuMain > table > thead > tr >th").length;i++){
                html +=aa;
            };
            $("#menuMain >table >tbody").append("<tr>"+html+"</tr>");
        }else{
            toastTip("提示","请先新建或选择菜谱列表。。。")
        }
    });

    // 删除行
    $("#buttonBox").on("click","#deleteLine",function () {
        if($("#menuMain >table >tbody >tr").hasClass("active")){
            $("#menuMain >table >tbody >tr.active").remove();
        }else{
            toastTip("提示","请先选择行。。")
        }
    });

    // 增加列
    $("#buttonBox").on("click","#newCol",function () {
        if($("#menuMain > table").length !=0){
            $("#menuMain >table >thead >tr").append("<th></th>");
            $("#menuMain >table >tbody >tr").append("<td></td>");

            var num=$("#menuMain >table >thead >tr >th").length;
            $("#menuMain").find("th").css("width",(1/num)*100+"%");
        }else{
            toastTip("提示","请先新建或选择菜谱列表。。。")
        }
    });

    // 删除列
    $("#buttonBox").on("click","#deleteCol",function () {
        if($("#menuMain >table >thead >tr >th").hasClass("current")){
            $("#menuMain >table >thead >tr >th.current").remove();
            $("#menuMain >table >tbody >tr >td.current").remove();
        }else{
            toastTip("提示","请先选择列。。")
        }
    });

    // 删除表格
    $("#buttonBox").on("click","#deleteMenu",function () {
        if($("#menuMain").children().length !=0){
            var r=confirm("确定删除吗？");
            if(r == true){
                healthDeleteTable_port(JSON.parse($("#menuMain >.conTitle").attr("data-json")));
            };
        }else{
            toastTip("提示","请先选择表格。。。")
        }
        
    });

    // 删除列
    $("#buttonBox").on({
        mouseover:function () {
            $(this).find("span").addClass("current");
        },
        mouseout:function () {
            $(this).find("span").removeClass("current")
        }
    },"#editMenu");

    // 单击选中列
    $("#menuMain").on("click","thead >tr >th",function () {
        $(this).toggleClass("current").siblings().removeClass("current");
        var index=$(this).index()+1;
        $("#menuMain > table > tbody > tr").find("td:nth-of-type("+index+")").toggleClass("current").siblings().removeClass("current");
    });

    // 保存表格
    $("#saveBtn").click(function () {
        if($("#menuMain").children().length ==0){
            toastTip("提示","请先新建或选择菜谱列表。。。")
        }else{
            var arr=[];

            var thArr=[];
            for(var i=0;i<$("#menuMain > table > thead > tr > th").length;i++){
                var th=$("#menuMain > table > thead > tr > th");
                thArr.push(th.eq(i).text());
            }
            arr.push(thArr);

            var tb=$("#menuMain > table > tbody > tr");
            for(var i=0;i<tb.length;i++){
                var tbArr=[];
                for(var j=0;j<tb.eq(i).children().length;j++){
                    var aa=[];
                    tbArr.push(tb.eq(i).children().eq(j).text());
                };
                arr.push(tbArr);
            };

            var json=JSON.parse($("#menuMain >.conTitle").attr("data-json"));
            json.remark=arr;
            healthSaveTable_port(json);
        };
    });

    // 体检日期输入函数
    $('#planBegintime,#planEndtime').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        if($('#planBegintime,#planEndtime').val()){
            $('#planBegintime,#planEndtime').removeClass("empty");
        };
        $('#planBegintime,#planEndtime').datepicker("hide");
    });

};

// 获得菜谱日期列表
function menuGetTitleList_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuGetTitleList,param,menuGetTitleList_callback);
};
function menuGetTitleList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].json=JSON.stringify(data[i]);
        };
        var data01={data:data};
        var html=template("menu_script01",data01);
        $("#menu").empty().append(html);

        if(1){
            $("#menuMain").empty();
            // $("#menu > li:first").click();
        };
    }else{
        console.log('请求错误，返回code非200');
    }
};

// 获得整张表的内容
function healthGetTable_port(json) {
    var data={
            startDate:json.startDate
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuStructuringTableCell,param,healthGetTable_callback,json);
};
function healthGetTable_callback(res,json) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        json.json=JSON.stringify(json);
        json.data=data;
        console.log(json);
        var html=template("menuMain_script",json);
        $("#menuMain").empty().append(html).find("th").css("width",(1/data[0].length)*100+"%");
    }else{
        console.log('请求错误，返回code非200');
    }
};

// 新增编辑表格
function healthSaveTable_port(json) {
    var data={
            startDate:json.startDate,
            endDate:json.endDate,
            title:json.title,
            remark:json.remark
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    toastTip("提示","正在保存，请稍候。。。");
    initAjax(httpUrl.menuSaveTable,param,healthSaveTable_callback,json);
};
function healthSaveTable_callback(res,json) {
    if(res.code==200){
        toastTip("提示","保存成功。。。")
        menuGetTitleList_port();
    }else{
        toastTip("提示","保存失败，请重试。。。")
        console.log('请求错误，返回code非200');
    }
};

// 删除表格
function healthDeleteTable_port(json) {
    var data={
            startDate:json.startDate
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.menuDeleteTable,param,healthDeleteTable_callback,json);
};
function healthDeleteTable_callback(res,json) {
    if(res.code==200){
        menuGetTitleList_port();
    }else{
        console.log('请求错误，返回code非200');
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
                data.arr[i].current=true;
            }else{
                data.arr[i].current=false;
            };
        };
        
        var html=template("menu_script",data);
        $("#subMenu").empty().append(html);
        chooseNiceScroll("#sidebarBox","transparent");

        loginUserInfo_port();
        basicButton_port();
    }else if(res.coed =404){
        window.location.href="../../index.html";
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
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
    };
};

// 获取菜单功能按钮列表
function basicButton_port() {
    var data={
            menuId:user.sid
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicButton,param,basicButton_callback);
};
function basicButton_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("buttonBox_script",data);
        $("#buttonBox").append(html);
        $("#editBtn,#deleteBtn").addClass("disable"); // 控制编辑和删除按钮的显示隐藏
    };
};