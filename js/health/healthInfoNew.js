function loginSuccess() {
    getAllClassInfo_port(); //获取全部班级列表

    // 图层折叠
    $("#buttonBox").on("click","#newBtn",function () {
        $(".newBox input").val("");
        $(".reset01").empty();
        $("#allClass,#classMember").attr("disabled",false);
        $(".empty").removeClass("empty");
        getClassMemberInfo_port($("#allClass").val());
        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("新增").attr("data-id","");
    });

    $("#buttonBox").on("click","#editBtn",function () {
        if($(this).hasClass("disable")){
            toastTip("提示","请先选择编辑项。。");
        }else{
            healthGetSingleHI_port();
        };
    });

    // 切换班级时成员接口切换
    $("#allClass").change(function () {
        $(".reset01").val("").text("");// 数据初始化
        var orgid=$(this).val();
        getClassMemberInfo_port(orgid);
    });

    // 切换成员时获取学员年龄和生日
    $("#classMember").change(function () {
        $(".reset01").val("").text("");// 数据初始化
        var useruuid=$(this).val();
        getBirthdaySex(useruuid); //获取学员年龄和生日
    });

    // 体检日期输入函数
    $('#createDate').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        calculateAge_port($("#h-birthday").val(),$("#createDate").val());
        if($("#createDate").val()){
            $("#createDate").removeClass("empty");
        };
        $('#createDate').datepicker("hide");
    }).on('show',function (ev) {
        $(this).datepicker("update",$(ev.target).val());
    });

    //输入身高
    $("#h-height").change(function(){
        if($("#createDate").val()){
            if($(this).val()){
                getHeightPvalue();//取得身高P值
            }else{
                $("#h-heightValue").val("");
            };
            if($(this).val() && $("#h-weight").val()){
                getFatnessValue();//取得肥胖值
            }else{
                $("#h-fatValue").val("");
                $("#h-fat").val("");
            };
        }else{
            $("#createDate").addClass("empty").focus();
        };
        Diagnosis();
    });

    //输入体重
    $("#h-weight").change(function(){
        if($("#createDate").val()){
            if($(this).val()){
                getWeightPvalue();//取得体重
            }else{
                $("#h-weightValue").val("");
            };
            if($(this).val() && $("#h-height").val()){
                getFatnessValue();//取得肥胖值
            }else{
                $("#h-fatValue").val("");
                $("#h-fat").val("");
            };
        }else{
            $("#createDate").addClass("empty").focus();
        };
        Diagnosis();
    });

    // 正则
    //输入血色素
    $("#h-hemachrome").change(function(){
        if(!isInteger($("#h-hemachrome").val()) && $("#h-hemachrome").val()){
            $("#h-hemachrome").val("");
            toastTip("提示","血色素请输入整数。");
        }
        Diagnosis();
    });
    //输入视力（小数点后一位，俩位数）
    $("#h-visionl,#h-visionr").change(function(){
        var _value = $(this).val(); 
        var reg = /^([0-9]|10|[0-9]\.\d)$/;
        if (!reg.test(_value)) {
            toastTip("提示",'请输入正确的视力值。');
            $(this).val("");
        };  
        Diagnosis();
    });

    //保存
    $("#save").click(function(){
        insertHealthInfo();
    });

    // 退出
    $("#quit").click(function () {
        swal({
                title: "是否保存此页面后离开？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e15d5d",
                confirmButtonText: "保存",
                cancelButtonText: "离开",
                closeOnConfirm: true,
                closeOnCancel: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        $("#save").click();
                    }else{
                        $(".content").addClass("hide");
                        $("#content").removeClass("hide");
                    };
            });
    });
    
    $("#createDate,#h-height,#h-weight").keyup(function () {
        if($(this).val()){
            $(this).removeClass("empty");
        }else{
            $(this).addClass("empty");
            if($(this).context.id=="h-height"){
                $("#h-heightValue").val("");
                $("#h-fatValue").val("");
                $("#h-fat").val("");
            };
            if($(this).context.id=="h-weight"){
                $("#h-weightValue").val("");
                $("#h-fatValue").val("");
                $("#h-fat").val("");
            };
        }; 
    });
};



// 获取全部班级列表
function getAllClassInfo_port() {
    var data={};
    var param={
            // params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.teacherMyClassInfo,param,getAllClassInfo_callback);
};
function getAllClassInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var json={data:data};
        var html=template("allClass_script",json);
        $("#allClass").empty().append(html);

        if(data.length>0){
            getClassMemberInfo_port($("#allClass").val());
        }
    
    }else{
        console.log('请求错误，返回code非200');
    }
};

function getClassMemberInfo_port(classUUID) {
    var data={
            classUUID:classUUID
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthGetChildListOfClass,param,getClassStudentInfo_callback);
};
function getClassStudentInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var json={data:data};
        var html=template("classMember_script",json);
        $("#classMember").empty().append(html);
        if(data.length>0){
             getBirthdaySex(); //获取学员年龄和生日
        };
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 获取单条数据
function healthGetSingleHI_port() {
    var data={
            hiUUID:$(".table tbody >tr.active").attr("data-id")
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthGetSingleHI,param,healthGetSingleHI_callback);
};
function healthGetSingleHI_callback(res) {
    if(res.code==200){
        $(".newBox input").val("");
        $(".reset01").empty();

        var data=JSON.parse(res.data);
        $("#allClass").attr("disabled",true);
        $("#allClass >option[value="+$("#teacherClass").val()+"]").prop("selected",true);
        $("#classMember").empty().append("<option value="+data.userUUID+">"+data.userName+"</option>").attr("disabled",true);
        $("#h-age").val($(".table >tbody >tr.active").attr("data-age"));
        getBirthdaySex();

        $("#createDate").val(data.examDate);

        $("#h-height").val(data.height);
        $("#h-hemachrome").val(data.hemachrome);
        $("#h-visionl").val(data.visionL);
        $("#h-visionr").val(data.visionR);
        $("#h-weight").val(data.weight);

        getHeightPvalue();//取得身高P值
        getWeightPvalue();//取得体重
        getFatnessValue();//取得肥胖值

        $(".content").addClass("hide");
        $("#content01").removeClass("hide").find(".pageTitle >small").text("编辑").attr("data-id",data.hiUUID);
    }else{
        // console.log('请求错误，返回code非200');
    }
};




//获取学员生日和性别
function getBirthdaySex(){
    var data={
            childUUID:$("#classMember").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthGetBirthdaySex,param,getBirthdaySex_callback);

}
function getBirthdaySex_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-sex").val(data.sex)
        $("#h-birthday").val(data.birthday);
        if($("#createDate").val()){
            calculateAge_port($("#h-birthday").val(),$("#createDate").val());
        };
    }else{
        $("#h-birthday").val("");
        $("#h-age").val("");
        // console.log(res);
    }
};

// 根据导入日期计算年龄
function calculateAge_port(birthdayStr,examDateStr) {
    var data={
            birthday:birthdayStr,
            examDate:examDateStr
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthCalculateAge,param,calculateAge_callback);
};
function calculateAge_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-age").val(data);
        $("#createDate").removeClass("empty");
    }else{
        console.log('请求错误，返回code非200');
    }
};

function getHeightPvalue() {
    var data={
            sex:$("#h-sex").val(),
            age:$("#h-age").val(),
            height:$("#h-height").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthHPValue,param,getPValue_callback);
}
function getPValue_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-heightValue").val(data);
    }else{
        $("#h-heightValue").val("");
        toastTip("提示",res.info,2000);
        // console.log(res);
    }
};

function getWeightPvalue() {
    var weight = $("#h-weight").val();
    var sex = $("#h-sex").val();
    var age = $("#h-age").val();
    var data={
            sex:sex,
            age:age,
            weight:weight
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthWPValue,param,getPValue_callback1);
}
function getPValue_callback1(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-weightValue").val(data);
    }else{
        $("#h-weightValue").val("");
        toastTip("提示",res.info,2000);
        // console.log(res);
    }
};
//取得肥胖值
function getFatnessValue(){
    var data={
            sex:$("#h-sex").val(),
            age:$("#h-age").val(),
            height:$("#h-height").val(),
            weight:$("#h-weight").val()
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.healthFatnessValue,param,getFatnessValue_callback);

}
function getFatnessValue_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-fatValue").val(data.fatnessValue);
        $("#h-fat").val(data.fatnessResult);
        Diagnosis();
    }else{
        $("#h-fatValue").val("");
        toastTip("提示",res.info,2000);
        // console.log(res);
    }
};
//取得诊断小结
function Diagnosis(){
    var a=0;
    for(var i=0;i<$("input.diagnosis").length;i++){
        if(!$("input.diagnosis").eq(i).val()){
            a++;
        };
    };
    if(true){
        var hemachrome="";
        if($("#h-hemachrome").val()){
            hemachrome="血色素为"+$("#h-hemachrome").val()+"，"
        };
        var vision="";
        if($("#h-visionl").val() || $("#h-visionr").val()){
            vision="视力为"+($("#h-visionl").val()  || "_")+"(左)/"+($("#h-visionr").val() || "_")+"(右)，"
        };

        var html = $("#classMember").find("option:selected").text()+"在"+$("#createDate").val()+"的体检记录中，身高为"+$("#h-height").val()+"cm，体重为"+$("#h-weight").val()+"kg，"+hemachrome+vision+"判定结果为：<span>"+$("#h-fat").val()+"</span>";
        $(".reset01").empty().append(html);
    }
}



//增加健康信息
function insertHealthInfo(){
    if($("#createDate").val()){
        $("#createDate").removeClass("empty");
    }else{
        $("#createDate").addClass("empty");
    };
    if($("#h-height").val()){
        $("#h-height").removeClass("empty");
    }else{
        $("#h-height").addClass("empty");
    };
    if($("#h-hemachrome").val()){
        $("#h-hemachrome").removeClass("empty");
    }else{
        // $("#h-hemachrome").addClass("empty");
    };
    if($("#h-visionl").val()){
        $("#h-visionl").removeClass("empty");
    }else{
        // $("#h-visionl").addClass("empty");
    };
    if($("#h-visionr").val()){
        $("#h-visionr").removeClass("empty");
    }else{
        // $("#h-visionr").addClass("empty");
    };
    if($("#h-weight").val()){
        $("#h-weight").removeClass("empty");
    }else{
        $("#h-weight").addClass("empty");
    };
    var data={
            childUUID:$("#classMember").val(),
            examDate:$("#createDate").val(),
            height:$("#h-height").val(),
            hemachrome:$("#h-hemachrome").val(),
            visionL:$("#h-visionl").val(),
            visionR:$("#h-visionr").val(),
            weight:$("#h-weight").val(),
            hiUUID:$("#content01").find(".pageTitle >small").attr("data-id")
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    if($(".empty").length ==0){
        if(data.hiUUID){
            initAjax(httpUrl.healthUpdateHealthInfo,param,insertHealthInfo_callback);
        }else{
            initAjax(httpUrl.healthNewHealthInfo,param,insertHealthInfo_callback);
        };
    }else{
        toastTip("提示","请先填写完整。。");
    };
};
function insertHealthInfo_callback(res) {
    if(res.code==200){
        healthGetExamDateList_port();
        $(".content").addClass("hide");
        $("#content").removeClass("hide");
    }else{
        toastTip("提示",res.info,2000);
    };
};

/*
用途：检查输入对象的值是否符合整数格式
输入：str 输入的字符串
返回：如果通过验证返回true,否则返回false
*/
function isInteger(str) {
    var regu = /^[-]{0,1}[0-9]{1,}$/;
    return regu.test(str);
}

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