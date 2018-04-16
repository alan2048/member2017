$(function () {
    init();
});
function init() {
    menu();

    baseFn();// 列表函数

    newQuestion();// 新增问卷

    // 阅读详情 标签页
    $("#detailRead").on("click",".detailNav li",function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".detailBody >li").removeClass("active").eq($(this).index()).addClass("active"); 
    });
    // 阅读详情 展开此班级学生数量
    $("#detailRead").on("click","li.class",function () {
        $(this).toggleClass("active");
    });
    
    // 网络问卷新增
    $("#linkBtn").on("click",function () {
        if(!$(".newQuestionBox.link .need").val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"")){
            $(".newQuestionBox.link .need").addClass("empty");
        };

        if($("#newUrl01").val()){
            var aa=isURL($("#newUrl01").val());
            if(aa){
                $("#newUrl01").removeClass('empty');
            }else{
                $("#newUrl01").addClass('empty');
            };
        }else{
            $("#newUrl01").addClass('empty');
        };

        if($(".newQuestionBox.link .need.empty").length !=0){
            toastTip("提示","红色框为必填项。。");
        }else if($("#newUrl01").hasClass("empty")){
            toastTip("提示",'链接格式不正确,请重新输入');
        }else{
            questionAdd_port(2);
        };
    });

    // 验证标题字数
    $(".newBox #newTitle,#newTitle01").keyup(function () {
        $(this).next(".newNumBtn").find("span").text($(this).val().length);
        if ($(this).val().length > 30) {
            $(this).addClass("more");
        } else {
            $(this).removeClass("more");
        };
        if($(this).val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"").length ==0){
            $(this).addClass("empty");
        }else{
            $(this).removeClass("empty");
        };
    });

    // 验证内容字数
    $(".newBox textarea").keyup(function () {
        $(this).next(".newNumBtn").find("span").text($(this).val().length);
        if ($(this).val().length > 1000) {
            $(this).addClass("more");
        } else {
            $(this).removeClass("more");
        };
    });
    
    $("#person,#person01").click(function () {
        $(".person").removeClass("current");
        $(this).addClass("current");
        if($("#classBox").children().length ==0){
            getMyClassInfo_port();
        };
        $("#modal-class").modal("show"); 
    });

    // 选择新增学生
    $("#classBox").on("click",".child >div",function () {
        $(this).toggleClass("active");

        var num=$(this).parents(".children").find(".childPic.active").length;
        var allNum=$(this).parents(".children").find(".childPic").length;
        if(num ==0){
            $(this).parents(".children").prev(".classTitle").find(".right").addClass("empty").text("");
        }else if(num ==allNum){
            $(this).parents(".children").prev(".classTitle").find(".right").addClass("all active").text("");
        }else{
            $(this).parents(".children").prev(".classTitle").find(".right").addClass("num active").removeClass("empty all").text(num);
        };
        
        $(this).parents(".children").prev(".classTitle").find(".right").text();
    });
};

// 基础操作
function baseFn() {
    // 分页切换
    $("#tabs >ul >li").click(function () {
        $(this).addClass("current").siblings().removeClass("current"); 
        $("#main >ul >li").eq($(this).index()).addClass("current").siblings().removeClass("current");

        switch($(this).index()){
            case 0:
                if($("#tableBox").children().length ==0){
                    questionList_port(1,$(this).index()+1);
                };
                break;
            case 1:
                if($("#tableBox02").children().length ==0){
                    questionList_port(1,$(this).index()+1);
                };
                break;
            default:
                if($("#tableBox").children().length ==0){
                    questionList_port(1,$(this).index()+1);
                };
        };
    });

    // 查询通知人、班级
    /*$(".tableBox").on('mouseover',"td.email-date",function () {
        if($(this).find("div").text() =="" && !$(this).hasClass("fill")){
            $(this).addClass("fill");
            questionPeople_port($(this).attr("data-id"));
        };
    });*/

    // 公告删除 选中
    $(".tableBox").on("click","tbody >tr >td.num",function () {
        $(this).toggleClass("active").parents("tr").toggleClass("active").find("i").toggleClass("fa-check-square-o fa-square-o");
        if($(this).parents("tbody").find("tr.active").length !=0){
            $("#deleteBtn,#editBtn").removeClass("disable");
        }else{
            $("#deleteBtn,#editBtn").addClass("disable");
        }
    });

    // 删除公告
    $("#buttonBox").on("click","#deleteBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择删除项。。");   
        }else{
            swal({
                title: "是否删除此调查问卷？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e15d5d",
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        var type=$("#tabs >ul >li.current").index()+1;
                        for(var i=0;i<$("#main >ul >li.current tbody >tr.active").length;i++){
                            questionRemove_port($("#main >ul >li.current tbody >tr.active").eq(i).attr("data-id"),type);
                        };
                    };
            });
        };
    });

    // 阅读人详情
    $("#tableBox").on("click","tbody >tr >td.email-sender.playerNumber",function (event) {
        questionReadUser_port($(this).attr("data-id"));
    });

    // 弹框 参与人数详情
    $("#detailRead,#detailOption").on('click','.class01 >div',function () {
        $(this).addClass("active").siblings().removeClass("active"); 
        $(this).parents("li.active").find(".children01 li").eq($(this).index()).addClass('active').siblings().removeClass("active");
    });

    // 网络问卷
    $("#tableBox02").on("click",".email-sender:not(.email-date)",function () {
        var url=$(this).parent().attr("data-url");
        if(url.search(/http/) <0){
            window.open("http://"+$(this).parent().attr("data-url"));
        }else{
            window.open($(this).parent().attr("data-url"));
        };
    });

    // 公告详情
    $("#tableBox").on("click","tbody >tr >td.email-sender:not(.read)",function () {
        questionDetail_port($(this).parent().attr("data-id"));
    });
};

// 新增问卷
function newQuestion() {
    // 新增页
    $("#buttonBox").on("click","#newBtn",function () {
        $("#modal-new").modal("show");
    });


    // 调查问卷新增
    $("#newWhich >div:first-of-type").click(function () {
        $("#modal-new").modal("hide");

        $(".newBox >div:first-of-type").addClass("active").siblings().removeClass("active");
        $(".content").addClass("hide");
        $("#content01 .pageTitle").html("调查问卷<small>新增问卷</small>");

        $("#person").attr("data-toclasses","").attr("data-topersons","").attr("disabled",false);
        $("#content01").removeClass("hide").find("input[type=text]").val("")
        $(".newQuestion").removeClass("active").empty()
        $("#allInput").prop("checked",false);
        $("#anonymity").prop("checked",false);
        $("#statVisible").prop("checked",false);
        $(".opTitle textarea").val("");
        $(".right").removeClass("active all num empty").text("");
        $(".childPic").removeClass("active");
        $(".need").removeClass("empty");
        $(".newNumBtn > span").text("0");

        $(".questionTool >ul >li:nth-of-type(4)").removeClass('unique');
    });

    // 网络问卷新增
    $("#newWhich >div:last-of-type").click(function () {
        $("#modal-new").modal("hide");

        $(".newBox >div:last-of-type").addClass("active").siblings().removeClass("active");
        $(".content").addClass("hide");
        $("#content01 .pageTitle").html("网络问卷<small>新增问卷</small>");


        $("#person").attr("data-toclasses","").attr("data-topersons","").attr("disabled",false);
        $("#content01").removeClass("hide").find("input[type=text]").val("");
        $("#content01").find("textarea").val("");
        $("#allInput").prop("checked",false);
        $(".right").removeClass("active all num empty").text("");
        $(".childPic").removeClass("active");
        $(".need").removeClass("empty");
        $(".newNumBtn > span").text("0");
    });

    $("#detail").on('click',"li.anonymityIcon >i",function () {
        questionOption_port($(this).parent().attr("data-optionid"));
    });

    // 返回上一级
    $(".backBtn").on("click",function () {
        if($(this).hasClass("detailBox")){
            $(".content").addClass("hide");
            $("#content").removeClass("hide");
        }else{
            swal({
                title: "您还未发布，确认退出吗？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e15d5d",
                confirmButtonText: "退出",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        $(".content").addClass("hide");
                        $("#content").removeClass("hide");
                    };
            });
        };
    });

    $('#beginTime01').datepicker({
            todayHighlight:true,
            startDate:'today',
            language:'zh-CN'
        }).on("changeDate",function (ev) {
            $('#beginTime01').datepicker("hide");
    }).on('show',function (ev) {
        $(this).datepicker("update",$(ev.target).val());
    });

    dateInit();// 时钟分钟 初始化
    newOptionFn();
};

// 时钟分钟 初始化
function dateInit() {
    var hour={hour:[]};
    for(var i=0;i<24;i++){
        hour.hour.push(i);
    };
    var htmlhour=template("hour_script",hour);
    $("#hour").append(htmlhour);

    var minute={minute:[]};
    for(var i=0;i<60;i++){
        minute.minute.push(i);
    };
    var htmlminute=template("minute_script",minute);
    $("#minute").append(htmlminute);
};

// 问卷选项新增
function newOptionFn() {
    chooseNiceScroll("#optionBody");
    // 单选
    $(".questionTool >ul >li:nth-of-type(1)").click(function () {
        if($(".newQuestion >li").length <15){
            $("#optionHeader >span >i").text("单选");
            $("#optionHeader >span >span >i").text("多选");
            $("#optionFloor >div:first-of-type").removeClass("active");
            $("#optionHeader >i").text($(".newQuestion >li").length+1);

            if($(".opBody").children().length ==0){
                $(".opBody").append(template("option_script",{arr:[0,1]}));
            };

            // 多选设置
            var arr=[];
            for(var i=2;i<=$(".opBody >li").length;i++){
                arr.push(i)
            };
            var html=template("answerNumer_script",{arr:arr});
            var value=$("#answerNumer >option:checked").text() || "不限";
            $("#answerNumer").empty().append(html).find("option:contains("+value+")").prop("selected",true);

            $("#modal-option").modal("show"); 
        }else{
            swal({
                title: "最多可添加15个问题",
                timer:2000
            });
        };
    });

    // 多选
    $(".questionTool >ul >li:nth-of-type(2)").click(function () {
        if($(".newQuestion >li").length <15){
            $("#optionHeader >span >i").text("多选");
            $("#optionHeader >span >span >i").text("单选");
            $("#optionFloor >div:first-of-type").addClass("active");
            $("#optionHeader >i").text($(".newQuestion >li").length+1);

            if($(".opBody").children().length ==0){
                $(".opBody").append(template("option_script",{arr:[0,1]}));
            };

            // 多选设置
            var arr=[];
            for(var i=2;i<=$(".opBody >li").length;i++){
                arr.push(i)
            };
            var html=template("answerNumer_script",{arr:arr});
            var value=$("#answerNumer >option:checked").text() || "不限";
            $("#answerNumer").empty().append(html).find("option:contains("+value+")").prop("selected",true);

            $("#modal-option").modal("show");  
        }else{
            swal({
                title: "最多可添加15个问题",
                timer:2000
            });
        };
    });

    // 预览问卷
    $(".questionTool >ul >li:nth-of-type(3)").click(function () {
        if($("#person").val()){
            $("#person").removeClass("empty")
        }else{
            $("#person").addClass("empty");
        };
        if($("#newTitle").val()){
            $("#newTitle").removeClass("empty")
        }else{
            $("#newTitle").addClass("empty");
        };
        
        if($(".newBox >div:first-of-type .empty").length !=0){
            toastTip("提示","红色框为必填项。。")
        }else if($(".newQuestion >li").length ==0){
            toastTip("提示","至少添加一个问题")
        }else{
            var questiones=[];
            for(var i=0;i<$(".newQuestion >li").length;i++){
                questiones.push(JSON.parse($(".newQuestion >li").eq(i).attr("data-json")))
            };
            var data={
                    anonymity:function () {if($("#anonymity").is(":checked")){return 1;}else{return 0;}}(),
                    endTime:function () {
                        var time='';
                        if($("#beginTime01").val()){
                            time=$("#beginTime01").val()+" "+$("#hour option:checked").text()+":"+$("#minute option:checked").text()
                        };
                        return time;
                    }(),
                    questiones:questiones,
                    title:$("#newTitle").val()
            };

            var html=template("previewBox_script",data);
            $("#previewBox").empty().append(html);
            $("#modal-preview").modal("show"); 
        };
    });

    // 滚动到顶
    $(".closeBtn03").click(function(e){
        e.preventDefault();
        $("#modal-preview").animate({scrollTop:-$("#modal-preview").height()},500);
    });
    // 滚动 显示隐藏
    $("#modal-preview").scroll(function(){
        var e=$("#modal-preview").scrollTop();
        if(e>=200){
            $(".closeBtn03").removeClass("hide");
        }else{
            $(".closeBtn03").addClass("hide");
        };
    });


    $(".scrollTopBtn").click(function(e){
        e.preventDefault();
        $("html, body").animate({scrollTop:$("body").offset().top},500)
    });
    // 详情滚动 显示隐藏
    $(document).scroll(function(){
        if(!$("#content02").hasClass("hide")){
            var e=$(document).scrollTop();
            if(e>=200){
                $(".scrollTopBtn").removeClass("hide");
            }else{
                $(".scrollTopBtn").addClass("hide");
            };
        };
    });

    // 提交问卷
    $(".questionTool >ul >li:nth-of-type(4)").click(function () {
        if($("#person").val()){
            $("#person").removeClass("empty")
        }else{
            $("#person").addClass("empty");
        };

        if($("#newTitle").val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"").length !=0){
            $("#newTitle").removeClass("empty")
        }else{
            $("#newTitle").addClass("empty");
        };
        
        if($(".newBox >div:first-of-type .empty").length !=0){
            toastTip("提示","红色框为必填项。。")
        }else if($(".newQuestion >li").length ==0){
            toastTip("提示","至少添加一个问题")
        }else{
            // 防止重复提交
            if(!$(this).hasClass('unique')){
                questionAdd_port(1);
            };
            $(this).addClass('unique')
        };
    });

    // 多选最多选择数
    $("#optionFloor >div:first-of-type >span").click(function () {
        $(this).toggleClass("active").siblings().toggleClass("active"); 
    });



    // 单选多选切换
    $("#optionHeader >span").click(function () {
        var text=$(this).children("i").text();
        if(text=="单选"){
            $(this).children("i").text("多选").siblings("span").find("i").text("单选");
            $("#optionFloor >div:first-of-type").addClass("active");
        }else{
            $(this).children("i").text("单选").siblings("span").find("i").text("多选");
            $("#optionFloor >div:first-of-type").removeClass("active");
        }
    });   

    // 字数监控
    $("#optionBody").on("keyup","textarea",function () {
        $(this).siblings("span.newNumBtn").find('span').text($(this).val().length);
        if($(this).val().length ==0){
            $(this).addClass("empty");
        }else{
            $(this).removeClass("empty");
        };
    });

    // 新增选项
    $(".opBody").on("click",".opTool >span:nth-of-type(1)",function () {
        var num=$(".opBody >li").length;
        if(num <15){
            $(this).parents("li").after(template("option_script",{arr:[0]}));
            // 序列重置
            for(var i=0;i<$(".opBody >li").length;i++){
                $(".opBody >li").eq(i).find(".col03").children("i").text(i+1);
            };

            // 多选设置
            var arr=[];
            for(var i=2;i<=$(".opBody >li").length;i++){
                arr.push(i)
            };
            var html=template("answerNumer_script",{arr:arr});
            var value=$("#answerNumer >option:checked").text() || "不限";
            $("#answerNumer").empty().append(html).find("option:contains("+value+")").prop("selected",true);
        }else{
            swal({
                title: "最多可添加15个问题选项",
                timer:2000
            });
        };
    });

    // 删除选项
    $(".opBody").on("click",".opTool >span:nth-of-type(2)",function () {
        var num=$(".opBody >li").length;
        if(num >2){
            $(this).parents("li").remove();
            // 序列重置
            for(var i=0;i<$(".opBody >li").length;i++){
                $(".opBody >li").eq(i).find(".col03").children("i").text(i+1);
            };

            // 多选设置
            var arr=[];
            for(var i=2;i<=$(".opBody >li").length;i++){
                arr.push(i)
            };
            var html=template("answerNumer_script",{arr:arr});
            var value=$("#answerNumer >option:checked").text() || "不限";
            $("#answerNumer").empty().append(html).find("option:contains("+value+")").prop("selected",true);
        }else{
            swal({
                title: "至少两个选项，不可再删除",
                timer:2000
            });
        };
    });

    // 上移
    $(".opBody").on("click",".opTool >span:nth-of-type(3)",function () {
        $(this).parents("li").prev().before($(this).parents("li"));
        // 序列重置
        for(var i=0;i<$(".opBody >li").length;i++){
            $(".opBody >li").eq(i).find(".col03").children("i").text(i+1);
        };
    });

    // 下移
    $(".opBody").on("click",".opTool >span:nth-of-type(4)",function () {
        $(this).parents("li").next().after($(this).parents("li"));
        // 序列重置
        for(var i=0;i<$(".opBody >li").length;i++){
            $(".opBody >li").eq(i).find(".col03").children("i").text(i+1);
        };
    });

    // 选项添加图片
    $("#optionBody").on("click",".col04",function () {
        $(".opBody .col04").removeClass("currentPic");
        $(this).addClass("currentPic");
        if($(this).hasClass('fillImg')){
            $("#carousel_img >img").attr('src','').attr('src',httpUrl.path_img+$(this).attr('data-pic'));
            $("#modal-dialog-img").modal('show');
        }else{
            $("#addPicBtn").click();
        };
    });

    // 删除图片
    $("#optionBody").on("click",".col04.fillImg >i",function (e) {
        $(this).parent().attr('data-pic','').removeClass('fillImg').find('img').attr('src','');
        e.stopPropagation();
    });

    // 确认新增
    $("#opSave").click(function () {
        if($(".opTitle textarea").val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"").length ==0){
            $(".opTitle textarea").addClass('empty');
        }else{
            $(".opTitle textarea").removeClass('empty');
        };
        for(var i=0;i<$(".opBody >li").length;i++){
            var text01=$(".opBody >li").eq(i).find("img").attr("src");

            if($(".opBody >li").eq(i).find("textarea").val().replace(/^[\s　]+|[\s　]+$/g, "").replace(/[\r\n]/g,"").length ==0){
                var text02=false;
            }else{
                var text02=true;
            };
            
            if(!text01 && !text02){
                $(".opBody >li").eq(i).addClass("empty");
            }else{
                $(".opBody >li").eq(i).removeClass("empty");
            }
        };

        if($(".opTitle textarea").hasClass("empty")){
            toastTip("提示","问题标题不可为空。。");
        }else if($(".opBody >li.empty").length >0){
            toastTip("提示","选项之图片和文字描述 必填一项");
        }else{
            var obj={};
            obj.questionTitle=$(".opTitle textarea").val();
            if($("#optionHeader >span >i").text() =="单选"){
                obj.answerNumer=1;
            }else{
                obj.answerNumer=$("#answerNumer").val();
            };
            obj.questionOptionList=[];
            for(var i=0;i<$(".opBody >li").length;i++){
                var sonObj={};
                sonObj.picture=$(".opBody >li").eq(i).find(".col04").attr("data-pic");
                sonObj.pic=httpUrl.path_img+sonObj.picture;
                sonObj.content=$(".opBody >li").eq(i).find("textarea").val();
                obj.questionOptionList.push(sonObj);
            };
            obj.index=$(".newQuestion >li").length+1;
            obj.json=JSON.stringify(obj);
            obj.time=new Date().getTime();

            var html=template("newQuestion_script",obj);

            if($(this).attr("data-time")){
                $(".newQuestion >li[data-time="+$(this).attr("data-time")+"]").before(html).addClass("active");
                $(".newQuestion").addClass("active").find("li[data-time="+$(this).attr("data-time")+"]").remove();
                // 序列重置
                for(var i=0;i<$(".newQuestion >li").length;i++){
                    $(".newQuestion >li").eq(i).find("i.rank").text(i+1);
                };
            }else{
                $(".newQuestion").append(html).addClass("active");
            };
            

            $('#modal-option').modal("hide");

            // 新增之后初始化
            $(".opBody").empty().append(template("option_script",{arr:[0,1]}));
            $(".opTitle textarea").removeClass('empty').val("");
            $(".opTitle .newNumBtn >span").text("0");
            $("#opSave").attr("data-time","");
            $("#answerNumer").empty().append(template("answerNumer_script",{arr:[2]}));
        };
    });

    // 预览 编辑
    $(".newQuestion").on("click","div.quesTool >span:nth-of-type(1)",function () {
        var json=JSON.parse($(this).parents("li").attr("data-json"));
        var time=$(this).parents("li").attr("data-time");

        $("#opSave").attr("data-time",time);
        $(".opTitle textarea").val(json.questionTitle);
        $(".opTitle .newNumBtn >span").text(json.questionTitle.length);

        var html=template("optionEdit_script",json);
        $(".opBody").empty().append(html);
        
        if(json.answerNumer ==1){
            $(".questionTool >ul >li:nth-of-type(1)").click();
        }else{
            $("#optionHeader >span >i").text("多选");
            $("#optionHeader >span >span >i").text("单选");
            $("#optionFloor >div:first-of-type").addClass("active");
            
            // 多选设置
            var arr=[];
            for(var i=2;i<=$(".opBody >li").length;i++){
                arr.push(i)
            };
            var html=template("answerNumer_script",{arr:arr});
            $("#answerNumer").empty().append(html).find("option:contains("+(json.answerNumer || "不限")+")").prop("selected",true);
            
            $("#modal-option").modal("show"); 
        };
        $("#optionHeader >i").text($(this).parents('li').index()+1);// 编辑index初始化
    });

    // 预览 删除
    $(".newQuestion").on("click","div.quesTool >span:nth-of-type(2)",function () {
        var parent=$(this).parents("li");
        swal({
            title: "是否删除此问题？",
            showCancelButton: true,
            confirmButtonColor: "#e15d5d",
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            closeOnConfirm: true,
            closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    $(parent).remove();
                    if($(".newQuestion >li").length ==0){
                        $(".newQuestion").removeClass("active");
                    };
                };
        });
    });

    // 预览 上移
    $(".newQuestion").on("click","div.quesTool >span:nth-of-type(3)",function () {
        $(this).parents("li").prev().before($(this).parents("li"));
        // 序列重置
        for(var i=0;i<$(".newQuestion >li").length;i++){
            $(".newQuestion >li").eq(i).find("i.rank").text(i+1);
        };
    });

    // 预览 下移
    $(".newQuestion").on("click","div.quesTool >span:nth-of-type(4)",function () {
        $(this).parents("li").next().after($(this).parents("li"));
        // 序列重置
        for(var i=0;i<$(".newQuestion >li").length;i++){
            $(".newQuestion >li").eq(i).find("i.rank").text(i+1);
        };
    });
};

function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
};

// 获取某个公告内容列表
function questionList_port(pageNum,type) {
    var data={
            pageNumber:pageNum || 1,
            pageSize:20,
            type:type || 1
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionList,param,questionList_callback,data.type);
};
function questionList_callback(res,type) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        if(data.list.length ==0 && data.pageNumber >1){// 解决删除之后数据为零
            questionList_port(data.pageNumber-1,type)
        }else{
            if(type == 1){
                for(var i=0;i<data.list.length;i++){
                    data.list[i].createDate01=new Date(data.list[i].createDate*1000).Format("yyyy-MM-dd hh:mm");
                    data.list[i].endTime01=new Date(data.list[i].endTime*1000).Format("yyyy-MM-dd hh:mm");
                };
        
                var html=template("tableBox_script",data);
                $("#tableBox").empty().append(html);

                $("#pagination").pagination({// 渲染分页
                    items: data.totalRow,
                    itemsOnPage: data.pageSize,
                    currentPage: data.pageNumber,
                    cssStyle: '',
                    onPageClick: function (pageNumber, event) {
                        questionList_port(pageNumber,1);
                    }
                });
            }else{
                for(var i=0;i<data.list.length;i++){
                    data.list[i].createDate01=new Date(data.list[i].createDate*1000).Format("yyyy-MM-dd hh:mm");
                    data.list[i].endTime01=new Date(data.list[i].endTime*1000).Format("yyyy-MM-dd hh:mm");
                };
        
                var html=template("tableBox02_script",data);
                $("#tableBox02").empty().append(html);

                $("#pagination02").pagination({// 渲染分页
                    items: data.totalRow,
                    itemsOnPage: data.pageSize,
                    currentPage: data.pageNumber,
                    cssStyle: '',
                    onPageClick: function (pageNumber, event) {
                        questionList_port(pageNumber,2);
                    }
                });
            };

            $("#deleteBtn").addClass("disable");
        };
    };
};

// 删除公告
function questionRemove_port(id,type) {
    var data={
            id:id,
            userUuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionRemove,param,questionRemove_callback,type);
};
function questionRemove_callback(res,type) {
    if(res.code==200){
        if(type==1){
            questionList_port($("#pagination").pagination('getCurrentPage'),type);
        }else{
            questionList_port($("#pagination02").pagination('getCurrentPage'),type);
        };
    }else{
        toastTip("提示",res.info);
    };
};

// 查看通知人和班级
function questionPeople_port(id,type) {
    var data={
            pageNumber:1,
            pageSize:20,
            type:type || 1
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionList,param,questionPeople_callback,id);
};
function questionPeople_callback(res,id) {
    if(res.code==200){
        var arr=[];
        $("td.email-date[data-id="+id+"]").find("div").empty().append(arr.join(","));
    }else{
        toastTip("提示",res.info);
    };
};

// 参与人数
function questionReadUser_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionReadUser,param,questionReadUser_callback);
};
function questionReadUser_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;
        var html=template("detailRead_script",data);
        $("#detailRead").empty().append(html);
        chooseNiceScroll("#modal-read .detailBody");
        $("#modal-read").modal("show");
    };
};

// 参与人数
function questionOption_port(id) {
    var data={
            optionId:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionOption,param,questionOption_callback);
};
function questionOption_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].path_img=httpUrl.path_img;
        }
        var html=template("detailOption_script",{arr:data});
        $("#detailOption").empty().append(html);
        chooseNiceScroll("#modal-Option .detailBody");
        $("#modal-Option").modal("show");
    };
};

// 查看问卷详情（已提交）
function questionDetail_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionDetail,param,questionDetail_callback);
};
function questionDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.endTime=new Date(data.createDate*1000).Format("yyyy年MM月dd日 hh:mm"); 
        data.path_img=httpUrl.path_img;


        var html=template("detail_script",data);
        $("#detail").empty().append(html);

        $(".content").addClass("hide");
        $("#content02").removeClass("hide");
    };
};

// 新增调查问卷
function questionAdd_port(type) {
    if(type ==1){
        var questiones=[];
        for(var i=0;i<$(".newQuestion >li").length;i++){
            questiones.push(JSON.parse($(".newQuestion >li").eq(i).attr("data-json")))
        };
        var data={
            anonymity:function () {if($("#anonymity").is(":checked")){return 1;}else{return 0;}}(),
            statVisible:function () {if($("#statVisible").is(":checked")){return 1;}else{return 0;}}(),
            endTime:function () {
                if($("#beginTime01").val()){
                    var time=$("#beginTime01").val()+" "+$("#hour").val()+":"+$("#minute").val();
                    return (new Date(time).getTime())/1000
                }else{
                    return '0';
                };
                
            }(),
            interlink:"",
            questiones:questiones,
            title:$("#newTitle").val(),
            toClasses:JSON.parse($("#person").attr("data-toclasses")),
            toPersons:JSON.parse($("#person").attr("data-topersons")),
            type:type
        };
    }else{
        var data={
            anonymity:"",
            statVisible:"",
            endTime:"",
            interlink:$("#newUrl01").val(),
            questiones:[],
            title:$("#newTitle01").val(),
            toClasses:JSON.parse($("#person01").attr("data-toclasses")),
            toPersons:JSON.parse($("#person01").attr("data-topersons")),
            type:type
        };
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.questionAdd,param,questionAdd_callback,type);
};
function questionAdd_callback(res,type) {
    if(res.code==200){
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
        if(type ==1){
            $("#tabs >ul >li:first-of-type").click();
            $(".questionTool >ul >li:nth-of-type(4)").removeClass('unique');
            questionList_port($("#pagination").pagination('getCurrentPage'),1);
        }else{
            $("#tabs >ul >li:last-of-type").click();
            questionList_port($("#pagination02").pagination('getCurrentPage'),2);
        };
    }else{
        toastTip('提示',res.info);
    };
};

// 获取我的班级信息
function getMyClassInfo_port() {
    var data={
            uuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getMyClassInfoIncludeTeacherGroup,param,getMyClassInfo_callback);
};
function getMyClassInfo_callback(res) {
    if(res.code==200){
        var data={arr:JSON.parse(res.data)};
        var html=template("classBox_script",data);
        $("#classBox").empty().append(html);
        chooseNiceScroll("#classBox");

        $(".classTitle").click(function () {
            if($(this).next(".children").children().length ==0){
                getClassStuAndTeachers_port($(this).attr("data-id"));
            };
            $(this).parent().toggleClass("active");
        });

        // 选择班级
        $(".right").click(function (e) {
            $(this).removeClass("num").toggleClass("active all").text("");
            if($(this).hasClass("active")){
                $(this).parents(".class").find(".childPic").addClass("active");
            }else{
                $(this).parents(".class").find(".childPic").removeClass("active");
            }
            e.stopPropagation();
        });

        // 全选班级
        $("#allInput").click(function () {
            if($(this).is(":checked")){
                $(".right").addClass("active all");
                $(".childPic").addClass("active");
            }else{
                $(".right").removeClass("active all num empty").text("");
                $(".childPic").removeClass("active");
            }
        });

        $("#cancel").click(function () {
            $("#modal-class").modal("hide"); 
        });

        $("#save").click(function () {
            if($(".right.all").length ==0 && $(".right.num").length ==0){
                toastTip("提示","请先选择班级、个人。。");
            }else{
                var toClasses=[];
                var name=[];
                var toPersons=[];
                for(var i=0;i<$(".right.all").length;i++){
                    var obj={};
                    obj.classId=$(".right.all").eq(i).attr("data-id");
                    obj.className=$(".right.all").eq(i).attr("data-classname");
                    toClasses.push(obj);
                    name.push($(".right.all").eq(i).attr("data-classname"));
                };

                for(var i=0;i<$(".right.num").length;i++){
                    for(var j=0;j<$(".right.num").eq(i).parents(".class").find(".childPic.active").length;j++){
                        var obj={};
                        obj.classId=$(".right.num").eq(i).parents(".class").find(".childPic.active").eq(j).attr("data-classid");
                        obj.className=$(".right.num").eq(i).parents(".class").find(".childPic.active").eq(j).parents(".class").find(".right").attr("data-classname");
                        obj.userName=$(".right.num").eq(i).parents(".class").find(".childPic.active").eq(j).attr("data-name");
                        obj.userPhoto=$(".right.num").eq(i).parents(".class").find(".childPic.active").eq(j).attr("data-photo");
                        obj.userUuid=$(".right.num").eq(i).parents(".class").find(".childPic.active").eq(j).attr("data-uuid");
                        toPersons.push(obj);
                        name.push($(".right.num").eq(i).parents(".class").find(".childPic.active").eq(j).attr("data-name"))
                    };
                };

                $(".person.current").val(name.join()).attr("data-toclasses",JSON.stringify(toClasses)).attr("data-topersons",JSON.stringify(toPersons));
                $(".person.current").removeClass("empty");
                $("#modal-class").modal("hide"); 
            };
        });
    };
};

// 获取班级所有学生和老师
function getClassStuAndTeachers_port(classId) {
    var data={
            classId:classId,
            useruuid:$(".userName").attr("data-useruuid")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.getClassStus,param,getClassStuAndTeachers_callback,classId);
};
function getClassStuAndTeachers_callback(res,classId) {
    if(res.code==200){
        var data={
                arr:JSON.parse(res.data),
                path_img:httpUrl.path_img,
                classId:classId
            };
        var html=template("children_script",data);
        $("#classBox li.class[data-id="+classId+"] >.children").append(html);

        if($("#classBox li.class[data-id="+classId+"] >.classTitle >.right").hasClass("active")){
            $("#classBox li.class[data-id="+classId+"] >.children .childPic").addClass("active");
        };
    };
};


// 上传图片
function loadFiles() {
    upToken1_port();
    // 获取公有文件上传token
    function upToken1_port() {
        var data={
                comUUID:user.companyUUID
        };
        var param={
                params:JSON.stringify(data),
                loginId:httpUrl.loginId
        };
        initAjax(httpUrl.upToken1,param,upToken1_callback);
    };
    function upToken1_callback(res) {
        if(res.code==200){
            user.upToken1=res.data;
            loadFiles01();// 七牛公有文件上传
        };
    };
    function loadFiles01() {
        var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'addPicBtn',         // 上传选择的点选按钮，必需
                uptoken: user.upToken1, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: httpUrl.path_img,     // bucket域名，下载资源时用到，必需
                max_file_size: '1024mb',             // 最大文件体积限制
                multi_selection: true,              // 多选上传
                max_retries: 3,                     // 上传失败最大重试次数
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                filters : {
                    max_file_size : '1024mb',
                    prevent_duplicates: false,
                    mime_types: [
                        {title : "Image files", extensions : "jpg,jpeg,bmp,gif,png"} // 限定jpg,gif,png后缀上传
                    ]
                },
                init: {
                    'FileUploaded': function(up, file, info) {
                        var data={
                                md5:JSON.parse(info.response).key,
                                path_img:httpUrl.path_img
                        };
                        var url=data.path_img+data.md5+"-scale200";
                        $(".opBody .col04.currentPic").attr("data-pic",data.md5).addClass('fillImg').find("img").attr("src",url);
                        $('.qiniuBar').remove();
                    },
                    'BeforeUpload': function(up, file) {// 每个文件上传前，处理相关的事情
                        $("body").append("<span class='qiniuBar'></span>");
                    },
                    'UploadProgress': function(up, file) {// 进度条
                        $(".qiniuBar").width(file.percent + "%");
                    },
                    'Error': function(up, err, errTip) {
                        toastTip(errTip);
                    }
                }
            });
    };
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

        var title="";
        for(var i=0;i<data.arr.length;i++){
            data.arr[i].iconArr=data.arr[i].icon.split(",");
            data.arr[i].pid=menuId;
            data.arr[i].url=data.arr[i].url.split("/")[2];
            if(data.arr[i].id == user.sid){
                data.arr[i].newId=function () {return data.arr[i].id+"&t="+(new Date().getTime())}();
                data.arr[i].current=true;
                title=data.arr[i].name;
            }else{
                data.arr[i].newId=function () {return data.arr[i].id+"&t="+(new Date().getTime())}();
                data.arr[i].current=false;
            };

            // 判断是否url自带参数
            if(data.arr[i].url.indexOf("?") >=0){
                data.arr[i].search=true;
            }else{
                data.arr[i].search=false;
            }
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
        $("#user >.userName").text(data.name).attr("data-useruuid",data.userUUID);
        $("#user >.userRole").text(data.jobTitle);
        $("#user >.userPic").css({
            background:"url("+data.path_img+data.portraitMD5+"-scale200) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading

        questionList_port();

        user.companyUUID=data.companyUUID;
        loadFiles();
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
(function($){
    $.fn.datepicker.dates['zh-CN'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            suffix: [],
            meridiem: ["上午", "下午"]
    };
}(jQuery));