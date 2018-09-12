httpUrl.addOrUpdateMedicineRecord=path+"/app/heath/addOrUpdateMedicineRecord";//新增 编辑 全日观察
httpUrl.deleteMedicineRecord=path+"/app/heath/deleteMedicineRecord";//删除全日观察
httpUrl.medicineRecordDetail=path+"/app/heath/medicineRecordDetail";//获取全日观察详情列表
httpUrl.medicineRecordList=path+"/app/heath/medicineRecordList";//获取全日观察记录列表
httpUrl.classList=path+"/app/basic/myClassInfo"; // 获取当前人所在班级
httpUrl.basicStudent=path+"/common/basic/class/student",// 获取当前班级学生列表
httpUrl.roleOfUser=path+"/app/heath/roleOfUser",// 获取当前用户角色
winResize();
$(function () {
    roleOfUser_port();
    section01Fn();
}); 

// 查看
function section01Fn() {
    // 查看
    $("#section01").on("click",".caseBox",function () {
        medicineRecordDetail_port($(this).attr("data-uuid"),0);
        scroll2Top();
    });

    // 修改
    $("#section01").on("click",".editBtn",function (e) {
        e.stopPropagation();
        medicineRecordDetail_port($(this).attr("data-uuid"),1);
    });

    // 新增
    $("#section01").on("click","#addIcon",function () {
        if(user.type ==20){
            var data={
                    attention:"",
                    disease:"",
                    dosage:"",
                    hospital:"",
                    instruction:"",
                    medicalRecordPicture:"",
                    medicalRecordPictureArr:[],
                    medicineName:"",
                    medicinePicture:"",
                    medicinePictureArr:[],
                    parentRemind:"",
                    remark:"",
                    studentName: user.student.studentName,
                    studentPhoto: user.student.studentPhoto,
                    studentUUID: user.student.studentUUID,
                    userUUID: user.useruuid,
                    uuid: "",
                    takeMedicineTime: "",
                    path_img:httpUrl.path_img,
                    typeId:user.type,
                    editing: 1
            };
            console.log(data);
            
            data.takeMedicineDate="";
            data.photo=httpUrl.path_img+data.studentPhoto+"-scale400";

            var html=template("update_script",data);
            $("#updateBox").empty().append(html);

            $("section").removeClass("current");
            $("#section03").addClass("current");

            mobiscrollInit();

            loadFiles();
        }else{
            if($("#class >option").length ==0){
                classList_port();
            }else{
                getClassStudentInfo_port($("#class").val());
            };
        
            scroll2Top();
            $("section").removeClass("current");
            $("#section02").addClass("current");
        };
    });

    // 删除
    $("#section01").on("click",".deleteBtn",function (e) {
        e.stopPropagation();
        var uuid=$(this).attr("data-uuid");
        $(document).dialog({
            type:"confirm",
            titleShow:false,
            content: '确认删除此记录吗？',
            buttonTextCancel:"取消",
            buttonTextConfirm:"删除",
            onClickConfirmBtn:function () {
                deleteMedicineRecord_port(uuid);
            }
        });
    });

    // 新增界面 后退一步
    $("#section02").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
    });

    // 跳转至新增
    $("#section02").on("click",".studentBtn",function () {
        var data={
                attention:"",
                disease:"",
                dosage:"",
                hospital:"",
                instruction:"",
                medicalRecordPicture:"",
                medicalRecordPictureArr:[],
                medicineName:"",
                medicinePicture:"",
                medicinePictureArr:[],
                parentRemind:"",
                remark:"",
                studentName: $(this).attr("data-name"),
                studentPhoto: $(this).attr("data-studentphoto"),
                studentUUID: $(this).attr("data-studentuuid"),
                userUUID: user.useruuid,
                uuid: "",
                takeMedicineTime: "",
                editing: 1
        };
            
        data.takeMedicineDate="";
        data.photo=httpUrl.path_img+data.studentPhoto+"-scale400";

        var html=template("update_script",data);
        $("#updateBox").empty().append(html);

        $("section").removeClass("current");
        $("#section03").addClass("current");

        mobiscrollInit();
        loadFiles();
    });

    // 详情页面 后退一步
    $("#section03").on("click",".backBar >div:first-of-type >span",function () {
        scroll2Top();
        $("section").removeClass("current");
        if(user.type ==20){
            $("#section01").addClass("current");
        }else{
            $("#section02").addClass("current");
        };
    });

    // 新增 修改 接口
    $("#section03").on("click","#addIcon02",function () {
        addOrUpdateMedicineRecord_port();
    });

    // 删除图片
    $("#section03").on("click",".deleteIcon",function (e) {
        e.stopPropagation();
        $(this).parents(".picItem").remove();
    });

    $("#section03").on("click",".picItem",function () {
        var data=[];
        for(var i=0;i<$(this).parent().find(".picItem").length;i++){
            data.push($(this).parent().find(".picItem").eq(i).attr("data-pic"))
        };

        var index=$(this).index();// 定位到当前图片
        var openPhotoSwipe = function() {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var items = [];
            for(var i=0;i<data.length;i++){
                var obj={
                        src:httpUrl.path_img+data[i]+"?imageMogr2/auto-orient/thumbnail/1000x1000/interlace/1/blur/1x0/quality/90",
                        w:650,
                        h:910
                };
                items.push(obj);
            };
            var options = {    
                    history: false,
                    focus: false,
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0,
                    index:index
            };
            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        openPhotoSwipe();
    }); 
};

function mobiscrollInit() {
    var currYear = (new Date()).getFullYear();  
    var opt={};
    opt.datetime = {preset : 'datetime'};
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'bottom', //显示方式 
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        startYear: currYear - 20, //开始年份
        endYear: currYear + 5 //结束年份
    };

    var optDateTime = $.extend(opt['datetime'], opt['default']);
    $("#mobiscrollBtn").mobiscroll(optDateTime).datetime(optDateTime);//年月日时分型
};

function scroll2Top() {
    $("html, body").animate({scrollTop:$("body").offset().top},400);
}
// 获取全日观察记录列表
function medicineRecordList_port() {
    var data={
            pageNumber:0,
    		userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.medicineRecordList,param,medicineRecordList_callback);
};
function medicineRecordList_callback(res) {
    if(res.code==200){	
        var data=JSON.parse(res.data);

        console.log(data);
        if(data.length >0){
            for(var i=0;i<data.length;i++){
                data[i].createDate=new Date(data[i].createTime*1000).Format("yyyy-MM-dd hh:mm");
                if(data[i].takeMedicineTime){
                    data[i].takeMedicineDate=new Date(data[i].takeMedicineTime*1000).Format("yyyy-MM-dd hh:mm");
                }else{
                    data[i].takeMedicineDate=""; 
                };
                data[i].photo=httpUrl.path_img+data[i].studentPhoto+"-scale400";
            };
            var html=template("listBox_script",{arr:data});
            $(".listBox").empty().append(html);
            $("#section01").removeClass("empty");
        }else{
            $(".listBox").empty();
            $("#section01").addClass("empty");
        };

        scroll2Top();
        $("section").removeClass("current");
        $("#section01").addClass("current");
    }else{
    	// alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 获取全日观察记录详情
function medicineRecordDetail_port(uuid,editing) {
    var data={
            uuid:uuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.medicineRecordDetail,param,medicineRecordDetail_callback,editing);
};
function medicineRecordDetail_callback(res,editing) {
    if(res.code==200){  
        var data=JSON.parse(res.data);
        if(data.takeMedicineTime){
            data.takeMedicineDate=new Date(data.takeMedicineTime*1000).Format("yyyy-MM-dd hh:mm");
        }else{
            data.takeMedicineDate="";
        };
        
        data.photo=httpUrl.path_img+data.studentPhoto+"-scale400";
        data.editing=editing;
        data.path_img=httpUrl.path_img;
        data.typeId=user.type;
        if(data.medicinePicture.length !=0){
            data.medicinePictureArr=data.medicinePicture.split(",");
        }else{
            data.medicinePictureArr=[];
        }
        
        if(data.medicalRecordPicture.length !=0){
            data.medicalRecordPictureArr=data.medicalRecordPicture.split(",");
        }else{
            data.medicalRecordPictureArr=[];
        };

        var html=template("update_script",data);
        $("#updateBox").empty().append(html);

        $("section").removeClass("current");
        $("#section03").addClass("current");

        mobiscrollInit();
        if(data.editing ==1){
            loadFiles();
        };
    }else{
        $(document).dialog({
            type:"notice",
            infoText:res.info,
            autoClose: 2500,
            position:"bottom"
        });
    }
};

// 新增全日观察
function addOrUpdateMedicineRecord_port() {
    var data={
            attention:$("#attention").val(),
            disease:$("#disease").val(),
            dosage:$("#dosage").val(),
            hospital:$("#hospital").val(),
            instruction:$("#instruction").val(),
            medicalRecordPicture:function () {
                var arr=[];
                for(var i=0;i<$("#carousel02 >li.picItem").length;i++){
                    arr.push($("#carousel02 >li.picItem").eq(i).attr("data-pic"))
                };
                return arr.join();
            }(),
            medicineName:$("#medicineName").val(),
            medicinePicture:function () {
                var arr=[];
                for(var i=0;i<$("#carousel >li.picItem").length;i++){
                    arr.push($("#carousel >li.picItem").eq(i).attr("data-pic"))
                };
                return arr.join();
            }(),
            parentRemind:$("#parentRemind").val(),
            remark:$("#remark").val(),
            studentUUID:$(".photoBox").attr("data-studentuuid"),
            userUUID: user.useruuid,
            uuid: $(".photoBox").attr("data-uuid"),
            takeMedicineTime: function () {
                    var time="";
                    if($("#mobiscrollBtn").val()){
                        time=new Date($("#mobiscrollBtn").val()).getTime()/1000
                    };
                    return time;
            }()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.addOrUpdateMedicineRecord,param,addIndividualCase_callback);
};
function addIndividualCase_callback(res) {
    if(res.code==200){  
        medicineRecordList_port();
    }else{
        $(document).dialog({
            type:"notice",
            infoText:res.info,
            autoClose: 2500,
            position:"bottom"
        });
    }
};

// 删除全日观察
function deleteMedicineRecord_port(uuid) {
    var data={
            uuid:uuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.deleteMedicineRecord,param,deleteMedicineRecord_callback);
};
function deleteMedicineRecord_callback(res) {
    if(res.code==200){  
        $(document).dialog({
            type:"notice",
            infoText:"删除成功",
            autoClose: 1000,
            position:"bottom"
        });

        medicineRecordList_port();
    }else{
        $(document).dialog({
            type:"notice",
            infoText:res.info,
            autoClose: 1000,
            overlayShow:false,
            position:"bottom"
        });
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
        
        // 默认第一班级的所有成员
        if(data.arr.length>0){
            getClassStudentInfo_port(data.arr[0].classUUID);
        };

        // 切换班级时成员接口切换
        $("#class").change(function () {
            var classId=$(this).val();
            getClassStudentInfo_port(classId);
        });
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 班级下学生列表 需改 过滤已生成学生
function getClassStudentInfo_port(classId) {
    var data={
            classId:classId,
            userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.basicStudent,param,getClassStudentInfo_callback);
};
function getClassStudentInfo_callback(res,tabIndex) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].photo=httpUrl.path_img+data[i].studentPhoto+"-scale400"
        };
        console.log(data);
        var html=template("students_script",{arr:data});
        $("#students").empty().append(html);
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 班级下学生列表 需改 过滤已生成学生
function roleOfUser_port() {
    var data={
            userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.roleOfUser,param,roleOfUser_callback);
};
function roleOfUser_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        user.type=data.type;
        user.student=data.student;

        medicineRecordList_port();
        classList_port();
    }else{
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

// 上传图片
function loadFiles() {
    if(!user.upToken1){
        upToken1_port();
    }else{
        loadFiles01();// 七牛公有文件上传
        loadFiles02();
    };
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
            loadFiles02();
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
                        if($("#carousel >.picItem").length <40){
                            var data={
                                    md5:JSON.parse(info.response).key,
                                    path_img:httpUrl.path_img
                            };
                            var url=data.path_img+data.md5;
                            var html="<li data-pic="+data.md5+" class='picItem'>"+
                                    "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" data-src="+url+" class=\"pic\" data-pic="+data.md5+">"+
                                        "<img src="+url+"-scale400>"+
                                        "<span class=\"deleteIcon\"></span>"+
                                    "</a>"+
                                "</li>";
                            $("#addPicBtn").parent("li").before(html);
                            $('.qiniuBar').remove();
                        }else{
                            toastTip("提示","图片数量上限为40张",4000);
                            $('.qiniuBar').remove();
                        }
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

    function loadFiles02() {
        var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'addPicBtn02',         // 上传选择的点选按钮，必需
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
                        if($("#carousel >.picItem").length <40){
                            var data={
                                    md5:JSON.parse(info.response).key,
                                    path_img:httpUrl.path_img
                            };
                            var url=data.path_img+data.md5;
                            console.log(data);
                            var html="<li data-pic="+data.md5+" class='picItem'>"+
                                    "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" data-src="+url+" class=\"pic\" data-pic="+data.md5+">"+
                                        "<img src="+url+"-scale400>"+
                                        "<span class=\"deleteIcon\"></span>"+
                                    "</a>"+
                                "</li>";
                            $("#addPicBtn02").parent("li").before(html);
                            $('.qiniuBar').remove();
                        }else{
                            toastTip("提示","图片数量上限为40张",4000);
                            $('.qiniuBar').remove();
                        }
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

function toastTip(text,infoText,minite) {
    $(document).dialog({
        type:"notice",
        text:text,
        infoText:infoText,
        autoClose: minite,
        overlayShow:false,
        position:"bottom"
    });
};