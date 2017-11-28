autoCanvasWidth();
var canvas = new fabric.Canvas('canvasMain',{
        preserveObjectStacking: true,
        backgroundColor:"#fff"
});

// 解决canvas.toDataURL()跨域问题
fabric.Image.fromURL=function(d,f,e){
    var c=fabric.document.createElement("img");
    c.onload=function(){
        if(f){f(new fabric.Image(c,e))}
        c=c.onload=null
    };
    c.setAttribute('crossOrigin','anonymous');
    c.src=d;
};

$(function () {
	init();// 初始化函数区
});
// 初始化函数区
function init() {
	tiphover();// 提示函数
	userMessage();// 用户信息初始化
	niceScroll();
	savePic();// html2canvas函数

	chooseMonth();// 选择月份初始化函数
	autoMatch();// 图片列表
	recordList();//预览列表
	loading();// loading载入
	loadFiles();// 上传图片
};




// 中间核心区域 功能区
// html2canvas函数
function savePic() {

	// 窗口缩放 主界面更新
	$(window).resize(function () {
		var h01=$("#canvas-wrapper").height();
		$("#canvas-wrapper").width(h01*0.71);

        canvas.setWidth($("#canvasBox").width());
        canvas.setHeight($("#canvasBox").height());

        if(canvas.getItemByAttr('id', "canvasBg")){
            canvas.getItemByAttr('id', "canvasBg").scaleToWidth($("#canvasMain").width());
        };
        canvas.renderAll();
	});

	// 初始化fabric 缩放控件颜色
	fabric.Object.prototype.set({
    	transparentCorners: false,
    	borderColor: '#49b6d6',
    	cornerColor: '#49b6d6'
	});
    // 添加fabric.js 依据id选择object
    fabric.Canvas.prototype.getItemByAttr = function(attr, name) {
        var object = null,
        objects = this.getObjects();
        for (var i = 0, len = this.size(); i < len; i++) {
            if (objects[i][attr] && objects[i][attr] === name) {
                object = objects[i];
                break;
            }
        }
        return object;
    };
    fabric.Canvas.prototype.getItemByClass = function(myClass) {
        var Arr=[];
        var objects = this.getObjects();
        for (var i = 0, len = this.size(); i < len; i++) {
            if (objects[i].class && objects[i].class=== myClass) {
                Arr.push(objects[i]);
            }
        }
        return Arr;
    };

	

	var w=$("#canvasMain").width();
	var h=$("#canvasMain").height();

    // 背景图初始化
    fabric.Image.fromURL(httpUrl.path_img+"61902139aead7370f1be1cb8c30a51ad",function(Img) {
            var w01=$("#canvasMain").width();
            var h01=$("#canvasMain").height();
            Img.scaleToWidth(w01).scaleToHeight(h01+12).set({
                id:"canvasBg",
                evented:false,
                selectable:false
            });
            canvas.clear();
            canvas.add(Img);

            // 添加 默认水印
            if(!$("#switchBtn").hasClass("close")){
                addWater($("#chooseColor >span.current").attr("data-color"));// 添加水印函数
            };
    });

	// 模板背景图片导入 主canvas
    $("#templateA").on("click","ul.has-menu > li",function () {
    	var md5=$(this).attr("data-md5");
        var type=$(this).parent("ul.has-menu").attr("data-type");// 父级data-type
    	var imgUrl=httpUrl.path_img+md5+"";

    	fabric.Image.fromURL(imgUrl,function(Img) {
    		var w01=$("#canvasMain").width();
    		var h01=$("#canvasMain").height();
    		Img.scaleToWidth(w01).scaleToHeight(h01+12).set({
                id:"canvasBg",
                evented:false,
    			selectable:false
    		});
            canvas.clear();
        	canvas.add(Img);
        	// canvas.moveTo(Img,8);

            // 添加 默认水印
            if(!$("#switchBtn").hasClass("close")){
                addWater($("#chooseColor >span.current").attr("data-color"));// 添加水印函数
            };
            // 封面模板时再加载detail接口
            if(type==1){
                recordPageDetail_port($("ul.has-menu >li.current").attr("data-id"));
            }else{
                $("#evaluate").removeClass("active");
                $("#canvas").addClass("active");  
            };
    	});
    });


	// 添加 水印图片
	$("#chooseMonth").on("click","li",function () {
        $(this).addClass("current").siblings().removeClass("current");

        recordDanList_port();
        recordDanMessage_port();

        // 评价模板
        if($("#evaluate").hasClass("active")){
            recordPageDetail_port($("ul.has-menu >li.current").attr("data-id"))
        }

        if($("#switchBtn").hasClass("close")){
            toastTip("提示","水印开关开启状态，才可添加月份水印","2500");
        }else{
            if(canvas.getItemByAttr('id', "waterMark")){
                canvas.getItemByAttr('id', "waterMark").remove();
                addWater($("#chooseColor >span.current").attr("data-color"));// 添加水印函数
            }else{
                addWater($("#chooseColor >span.current").attr("data-color"));// 添加水印函数
            };
        };
	});

    // 水印开关函数
    $("#switchBtn").on("click",function (event) {
        $(this).toggleClass("close");
        event.stopPropagation(); 
        if($(this).hasClass("close")){
            if(canvas.getItemByAttr('id', "waterMark")){
                canvas.getItemByAttr('id', "waterMark").remove();
            };
        }else{
            addWater($("#chooseColor >span.current").attr("data-color"));// 添加水印函数
        };
    });

    // 更改水印图片颜色
    $("#chooseColor").on("click","span",function () {
        $(this).toggleClass('current').siblings().removeClass("current");

        if($("#switchBtn").hasClass("close")){
            toastTip("提示","水印开关开启状态，才可添加月份水印","2500");
        }else{
            if(canvas.getItemByAttr('id', "waterMark")){
                canvas.getItemByAttr('id', "waterMark").remove();
                addWater($(this).attr("data-color"));// 添加水印函数
            }else{
                addWater($(this).attr("data-color"));// 添加水印函数
            };
        };
    });

    // 添加水印函数
    function addWater(AA) {

        if(AA){
            var monthBg="images/water/"+AA+"-"+$("#chooseMonth li.current").attr("data-month")+".png";
        }else{
            var monthBg="images/month/"+$("#chooseMonth li.current").attr("data-month")+".png";
        };
        
        fabric.Image.fromURL(monthBg,function(Img) {
            var w01=($("#canvasMain").width()-20)/5;
            var h01=$("#canvasMain").height()-20;
            Img.scaleToWidth(w01).set({
                left:(w-w01-w01/3),
                top:w01/3,
                id:"waterMark"
            });
            canvas.add(Img);
            canvas.renderAll();
        });
    };

    // 添加图片库 图片
    $("#picBtn").click(function () {
    	var AA=$("#picTabContent .picMain ul.picBody >li.active");
    	if(AA.length >0){
    		$.each(AA,function (index,value) {
    			var pic=httpUrl.path_img+$(value).attr("data-md5")+"";

    			fabric.Image.fromURL(pic,function(Img) {
    				var w01=$("#canvasMain").width()/2;
    				Img.scaleToWidth(w01).set({
    					left:100,
    					top:30
    				});
        			canvas.add(Img);
        			// canvas.moveTo(Img,8);
        			canvas.renderAll();
    			});
    		});
    	};
    	$("#modal-dialog-qunzu").modal("hide");
    	toastTip("Success","正在加载，请稍候。。");
    });

     // 显示>2张图片
    $("#upload").on("click",".twelve",function (e) {
        $(this).addClass("hide").parent("li").nextAll(".more").removeClass("hide").parents(".pictureList").next(".foldPic").removeClass("hide");
        $(this).parent().removeClass('active');
    });
    // 折叠>2张图片
    $("#upload").on("click",".addBtn02",function () {
        $(this).addClass("hide").prevAll(".more").addClass("hide");
        $(this).prevAll(".current").find(".twelve").removeClass("hide");
    });    

    // 底部 图片列表 添加图片及文字
    $("#autoMatch-list").on("click","> ul >li >span.matchPic",function () {
        if($("#canvas").hasClass("active")){
            var ArrPic=JSON.parse($(this).attr("data-picarr"));
            if(ArrPic.length >1){// 图片大于1时弹出选择对话框
                var data={
                        arr:ArrPic,
                        path:httpUrl.path_img
                    };
                var html=template("picMatch_script",data);
                $("#matchList").empty().append(html);

                $("#matchBtn").attr("data-body","").attr("data-body",$(this).attr("data-body")).prev("label").children("input").prop("checked",false);

                $("#modal-dialog-match").modal("show");
            }else{// 图片等于1时弹出选择对话框
                if(canvas.getItemByClass("bottomText").length !=0 ){
                    var Arr=canvas.getItemByClass("bottomText");
                    for(var i=0;i<Arr.length;i++){
                        Arr[i].remove();
                    };
                };
                if(canvas.getItemByClass("bottomPic").length !=0 ){
                    var Arr=canvas.getItemByClass("bottomPic");
                    for(var i=0;i<Arr.length;i++){
                        Arr[i].remove();
                    };
                };
        
                var w01=$("#canvasMain").width();
                var h01=$("#canvasMain").height();// 重新声明变量 适配resize一样能对齐

		        var text=$(this).attr("data-body");
		        if(text){
			        canvas.add(new fabric.Textbox(text.split('').join(" "), { 
  				        fontFamily: '宋体',
                        width:w*0.7,
                        fontSize: 16,
  				        left: w01/5, 
  				        top: h01/4,
                        class:"bottomText"
			        }));
                    // charSpacing:-100 控制字符间距
		        };
		    
		        if(ArrPic.length >0){
			       for(var i=0;i<ArrPic.length;i++){
				        var pic=httpUrl.path_img+ArrPic[i]+"";
				            fabric.Image.fromURL(pic,function(Img) {
    				            var w01=$("#canvasMain").width()/2;
    				            Img.scaleToWidth(w01).set({
    					            left:(w01*0.4),
    					            top:h01*0.5,
                                    class:"bottomPic"
    				            });
        			            canvas.add(Img);
        			            canvas.renderAll();
    			           });
			        };
    	        };
                toastTip("Success","图片正在加载，请稍候。。",1500);
            };
        };
	});

    // 底部 自动匹配多张选择图片
    $("#matchBtn").click(function () {
        if(canvas.getItemByClass("bottomText").length !=0 ){
            var Arr=canvas.getItemByClass("bottomText");
            for(var i=0;i<Arr.length;i++){
                Arr[i].remove();
            };
        };
        if(canvas.getItemByClass("bottomPic").length !=0 ){
            var Arr=canvas.getItemByClass("bottomPic");
            for(var i=0;i<Arr.length;i++){
                Arr[i].remove();
            };
        };
        
        var w01=$("#canvasMain").width();
        var h01=$("#canvasMain").height();// 重新声明变量 适配resize一样能对齐

        var text=$(this).attr("data-body");
        if(text){
            canvas.add(new fabric.Textbox(text.split('').join(" "), { 
                fontFamily: '宋体',
                width:w*0.7,
                fontSize: 16,
                left: w01/5, 
                top: h01/4,
                class:"bottomText"
            }));
        };
                
        var ArrPic=[];
        for(var i=0;i<$("#matchList >li.active").length;i++){
            ArrPic.push($("#matchList >li.active").eq(i).attr("data-md5"))
        };

        if(ArrPic.length >0){
            for(var i=0;i<ArrPic.length;i++){
                var pic=httpUrl.path_img+ArrPic[i]+"";
                    fabric.Image.fromURL(pic,function(Img) {
                        var w01=$("#canvasMain").width()/2;
                        Img.scaleToWidth(w01).set({
                            left:(w01*0.4),
                            top:h01*0.5,
                            class:"bottomPic"
                        });
                        canvas.add(Img);
                        canvas.renderAll();
                    });
            };
        };
        $("#modal-dialog-match").modal("hide");
        toastTip("Success","图片正在加载，请稍候。。",1500);
    });

    // 底部 自动匹配 选中图片函数
    $("#matchList").on("click","li",function () {
        $(this).toggleClass("active"); 
    });
    // 底部 自动匹配 全选函数
    $("#modal-dialog-match").on("click","label input",function () {
        if($(this).is(":checked")){
            $("#matchList >li").addClass("active");
        }else{
            $("#matchList >li").removeClass("active");
        };
    });

    // 预览列表 添加图片
    $("#recordOk").on("dblclick",".recordImg",function () {
        $("#evaluate").removeClass("active");
        $("#canvas").addClass("active");
        
        var src=httpUrl.path_img+$(this).attr("data-pic")+"";
        $("#carousel_img").empty().append("<img src="+src+" data-curpic="+$(this).attr("data-pic")+" />");
        recordDanDetail_port($(this).attr("data-id"));
        /*if($("#canvas").hasClass("active")){
            var imgUrl=httpUrl.path_img+$(this).attr("data-pic");
            fabric.Image.fromURL(imgUrl,function(Img) {
                var w01=$("#canvasMain").width();
                var h01=$("#canvasMain").height();
                Img.scaleToWidth(w01).scaleToHeight(h01).set({
                    left:0,
                    top:0,
                    id:"canvasBg",
                    evented:false,
                    selectable:false
                });
                canvas.clear();
                canvas.add(Img);
                // canvas.moveTo(Img,8);
            });
        };*/
        
	});


    // 删除按钮 工具箱 删除当前canvas对象
    $("#editor").on("click","#deleteBtn",function () {
        if(canvas.getActiveObject()){
            canvas.getActiveObject().remove();
        }
        if(canvas.getActiveGroup()){
            var activeGroup = canvas.getActiveGroup();
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function(object) {
                canvas.remove(object);
            }); 
        };
    });
    // 绑定键盘delete事件
    $(document).keydown(function (e) {
      if(canvas.getActiveObject()){
          if(e.keyCode ==46){
            canvas.getActiveObject().remove();
          };
      };
    });
    

    // 图层按钮 工具箱 
    $("#editor").on("click","#layerBtn",function () {
        $("#layerPanel").fadeToggle().siblings(":not(#editor-bar)").fadeOut();// 图层面板
    });
    $("#editor").on("click",".fotorPanel-btn:has(#layerUpBtn)",function () {
    	canvas.bringForward(canvas.getActiveObject());// 向上一层 图层面板
    });
    $("#editor").on("click",".fotorPanel-btn:has(#layerTopBtn)",function () {
    	canvas.bringToFront(canvas.getActiveObject());// 顶层 图层面板
    });
    $("#editor").on("click",".fotorPanel-btn:has(#layerDownBtn)",function () {
    	canvas.sendBackwards(canvas.getActiveObject());// 向下一侧 图层面板
    });
    $("#editor").on("click",".fotorPanel-btn:has(#layerBottomBtn)",function () {
    	canvas.sendToBack(canvas.getActiveObject());// 底层 图层面板
    });

    // 添加文字 
    $("#addTextBtn").click(function () {
        var text="请输入文字。。";
        var w01=$("#canvasMain").width();
        canvas.add(new fabric.Textbox(text, { 
            fontFamily: '宋体',
            fontSize: 16,
            textAlign:"left",
            width:w01*0.7,
            height:300,
            left: w01*0.15, 
            top: 100
        }));
    });

    // 字体自动排序
    $("#editor").on("click","#autoSort",function () {
        var o=canvas.getActiveObject();
        var w01=$("#canvasMain").width();
        if(o){
            if(o.oldText){
                o.text=o.oldText;
                o.oldText="";
                canvas.renderAll();
            }else{
                var text=o.text;
                o.oldText=o.text;
                var newStr = getNewline(text,50);
                o.text=newStr;
                o.width=w01*0.7;
                o.left=w01*0.15;
                canvas.renderAll();
            };
        };        
    });

    // 字体按钮 工具箱 
    $("#editor").on("click","#fontBtn",function () {
        $("#fontPanel").fadeToggle("fast").siblings(":not(#editor-bar)").fadeOut("fast");// 显示字体面板
        if($("#fontPanel:visible")){

            var o=canvas.getActiveObject();
            $("#fontNameDropdown .dropdownValue").text(o.fontFamily).attr("data-fontname",o.fontFamily);
            $("#fontSizeDropdown > input").val(o.fontSize);
            $("#fontSizeSliderTitleText").next("input").val(o.fontSize);
            $("#fontNameDropdown,#fontSizeDropdown").removeClass("active");
        }
    });
    $("#editor").on("click","#fontLeftBtn",function () {// 字体左对齐
        var o=canvas.getActiveObject();
        o.setTextAlign("left");
        canvas.renderAll();
    });
    $("#editor").on("click","#fontCenterBtn",function () {// 字体居中对齐
        var o=canvas.getActiveObject();
        o.setTextAlign("center");
        canvas.renderAll();
    });
    $("#editor").on("click","#fontRightBtn",function () {// 字体右对齐
        var o=canvas.getActiveObject();
        o.setTextAlign("right");
        canvas.renderAll();
    });
    $("#editor").on("click","#fontBoldBtn",function () {// 字体 粗体
        var o=canvas.getActiveObject();
        if(o.fontWeight =="bold"){
            o.setFontWeight("normal");
        }else{
            o.setFontWeight("bold");
        }
        canvas.renderAll();
    });
    $("#editor").on("click","#fontItalicBtn",function () {// 字体 斜体
        var o=canvas.getActiveObject();
        if(o.fontStyle =="italic"){
            o.setFontStyle("normal");
        }else{
            o.setFontStyle("italic");
        }
        canvas.renderAll();
    });
    $("#editor").on("click","#fontUnderlineBtn",function () {// 字体 下划线
        var o=canvas.getActiveObject();
        if(o.textDecoration =="underline"){
            o.setTextDecoration("none");
        }else{
            o.setTextDecoration("underline");
        }
        canvas.renderAll();
    });

    $("#editor").on("click","#fontNameDropdown",function () {// 字体选择下拉
        $(this).toggleClass("active");
        $("#fontSizeDropdown").removeClass("active");
    });
    $("#editor").on("click","#fontNameDropdown .font-name-list li",function () {// font-family
        $("#fontNameDropdown .dropdownValue").attr("data-fontname",$(this).attr("data-fontname")).empty().append($(this).text());
        var o=canvas.getActiveObject();
        o.setFontFamily($(this).attr("data-fontname"));
        canvas.renderAll();
    });
    // 字号大小
    $("#editor").on({
        focus:function () {
            $(this).parent().addClass("active");
            var o=canvas.getActiveObject();
            $(this).val(o.fontSize);
        },
        focusout:function (e) {
            if(false){
                $(this).parent().removeClass("active");
            }
            
        }
    },"#fontSizeDropdown > input");
    // 下拉选择字号
    $("#editor").on("click","#fontSizeDropdown > ul >li",function (e) {
        $("#fontSizeDropdown > input").val($(this).text());
        $("#fontSizeSliderTitleText").next("input").val($("#fontSizeDropdown > input").val());
        var o=canvas.getActiveObject();
        o.setFontSize($("#fontSizeDropdown > input").val());
        canvas.renderAll();
        $(this).parents("#fontSizeDropdown").removeClass("active");
    });

    // 输入改变字号
    $("#editor").on("change","#fontSizeDropdown > input",function () {
        $("#fontSizeSliderTitleText").next("input").val($(this).val());
        var o=canvas.getActiveObject();
        o.setFontSize($("#fontSizeDropdown > input").val());
        canvas.renderAll();
    });
    // 拖拉改变字号
    $("#editor").on("change","#fontSizeArea .font-slider-left > input",function () {
        $("#fontSizeDropdown > input").val($(this).val());
        
        var o=canvas.getActiveObject();
        o.setFontSize($(this).val());
        canvas.renderAll();
    });


    // 改变颜色
    $("#editor").on("click","#colorBtn",function () {// 颜色
        $("#colorPanel > input[type=color]").click();
    });
    $("#editor").on("change","#colorPanel > input[type=color]",function () {// 颜色
        var color=$(this).val();
        $("#colorDiv >i >span").css("background-color",color);
        var o=canvas.getActiveObject();
        o.setColor(color);
        canvas.renderAll();
    });

    // 选择当前canvas对象 执行事件
    canvas.on("mouse:up", function(options) {
        $("#editor-bar").siblings().fadeOut("fast");// 隐藏其他面板
        var w=$("#canvas").width();
        var w01=$("#canvas-wrapper").width();
        if(options.target){
            var length=(w-w01)/2+options.target.left+options.target.width*options.target.scaleX;
            if(length >1200){length=1200;}
            if(options.target && (options.target.get("type")=="i-text" || options.target.get("type")=="textbox") ){
                $("#colorBtn,#fontBtn,#autoSort").show();// 文字状态下显示颜色和字体控制按钮
                $("#editor-bar").css({"left":length+70,"top":options.e.clientY});// 主工具箱
                $("#layerPanel").css({"left":length+115,"top":(options.e.clientY+60)});//图层面板
                $("#fontPanel").css({"left":length+115,"top":(options.e.clientY+15)});// 字体面板
                $("#colorDiv >i >span").css("background-color",options.target.fill);
                $("#editor-bar").show();// 显示工具箱
            }else{
                $("#colorBtn,#fontBtn,#autoSort").hide();
                $("#editor-bar").css({"left":length+70,"top":options.e.clientY});// 主工具箱
                $("#layerPanel").css({"left":length+115,"top":(options.e.clientY-10)});//图层面板
                $("#editor-bar").show();// 显示工具箱
            };
        };
    });

    // 取消选择当前canvas对象 执行事件
	canvas.on('before:selection:cleared', function(options) {
    	var clearedObject;
    	if(typeof(canvas.getActiveObject()) !== 'undefined') {
        	clearedObject = canvas.getActiveObject();
    	}else {
        	clearedObject = canvas.getActiveGroup();
    	};

    	$("#editor > div").hide();// 隐藏工具箱
	});

    // 移动但不能超过主canvas区域函数
    canvas.on('object:moving', function (e) {
        var obj = e.target;
         // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }        
        obj.setCoords();        
        // top-left  corner
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }
        // bot-right corner
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
            obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
    });



    

    

    
	// 保存图片按钮
    $("#savePic").click(function () {
        // 评价模板保存
        if($("#evaluate").hasClass("active")){
            $("#saveEvaluate").empty().width($("#evaluateBox .temark1").width()).append($("#evaluateBox .temark1").clone());
            html2canvas($("#saveEvaluate"),{
                allowTaint: true,
                useCORS:true,
                taintTest: false,
                height:$("#saveEvaluate").outerHeight(),
                width:$("#saveEvaluate").outerWidth(),
                onrendered:function (canvas01) {
                    swal({
                        title: "提示",
                        text: "正在保存，请稍候。。。",
                        // timer: 3000,
                        showConfirmButton: false
                    }); 
                    recordSaveOrUpdate_port(canvas01.toDataURL('png'));
                    $("#saveEvaluate").empty();
                }
            });
        }else{
            if (!fabric.Canvas.supports('toDataURL')) {
                alert('This browser doesn\'t provide means to serialize canvas to an image');
            }else {
                swal({
                        title: "提示",
                        text: "正在保存，请稍候。。。",
                        // timer: 3000,
                        showConfirmButton: false
                    }); 
                // console.log(canvas.toDataURL("png"));
                recordSaveOrUpdate_port(canvas.toDataURL('png'),JSON.stringify(canvas));
            };
        }
    	
	});

    // 切换学生列表
    $("#childrenList").on("click","li >.membersBg",function () {
    	var bookId=$(this).attr("data-bookid");
    	if(bookId == 0){
    		$("#finalBtn").attr("data-useruuid",$(this).attr("data-useruuid"));
    		$("#myModal").modal("show");
    	}else{
    		$("#user").attr("data-useruuid",$(this).attr("data-useruuid")).attr("data-bookid",$(this).attr("data-bookid"));
    		$("#user #userImg >img").attr("src",httpUrl.path_img+$(this).attr("data-userphoto")+"-scale400");
    		$("#user #userName").text($(this).attr("data-username"));

            $("#classMembers >li").removeClass("hide");//档案页复制时 除去当前学生
            $("#classMembers >li >.membersBg[data-useruuid="+$("#user").attr("data-useruuid")+"]").parent("li").addClass("hide");

    		recordDanList_port();
			recordDanMessage_port();
			$("#childrenBtn").click();

            if($("#canvas").hasClass("active")){
                canvas.clear();
                $("#templateA .sub-menu li.current").click();   
            }
            if($("#evaluate").hasClass("active")){
                $("#templateC  li.current").click();   
            };
    	}
    });

     // 新建档案册函数
    $("#myModal").on("click","#finalBtn",function () {
        var name=$("#bookName").val();
        if($("#bookName").val()){
          recordNewDanbook_port($(this).attr("data-useruuid"),$("#bookName").val())
        }else{
          $("#bookName").attr("placeholder","您输入为空，请重新输入");
        }
    });
};

// 自动换行字数计算函数
function getNewline(val,num) {  
        var str = new String(val);  
        var bytesCount = 0;  
        var s="";
        for (var i = 0 ,n = str.length; i < n; i++) {  
            var c = str.charCodeAt(i);  
            //统计字符串的字符长度
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {  
                bytesCount += 1;  
            } else {  
                bytesCount += 2;  
            }
            //换行
            s += str.charAt(i);
            if(bytesCount>=num){  
            s = s + '\n';
            //重置
            bytesCount=0;
            } 
        }  
        return s;  
    }; 

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
    	var bookId=res.data;
        $("#childrenList li >.membersBg[data-useruuid="+$("#finalBtn").attr("data-useruuid")+"]").attr("data-bookid",bookId).click();
        $("#myModal").modal("hide");
    }else if(res.code ==200 && !res.data){
        console.log('请求错误，返回code非200');
    }else{
        toastTip("提示","加载失败，请稍候重试。。","2500");
    }
}


// 新增或者编辑档案页
function recordSaveOrUpdate_port(imgBase64,content) {
    var data={
    		bookId:$("#user").attr("data-bookid"),
    		id:$(".recordImg.edit").attr("data-id") || "0",
    		childUserUuid:$("#user").attr("data-useruuid"),
    		content:content || "",
    		imgBase64:imgBase64,
    		month:$("#chooseMonth >li.current").attr("data-month")
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordSaveOrUpdate,param,recordSaveOrUpdate_callback);
};
function recordSaveOrUpdate_callback(res) {
	if(res.code==200){
		// console.log(res.data);
        $("#savePic").attr("data-id","");// 区分新增、编辑 
		recordDanList_port();
	}else if(res.code==404){
        toastTip("提示","加载失败，请稍候重试。。","2500");
		// window.location.href=httpUrl.loginHttp;
	};
};
function autoCanvasWidth() {
	var h=$("#canvas-wrapper").height();
	$("#canvas-wrapper").width(h*0.71);
	$("#canvasMain").attr("width",$("#canvasBox").width());
	$("#canvasMain").attr("height",$("#canvasBox").height());
};


// 获取档案页详情
function recordDanDetail_port(id) {
    var data={
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordDanDetail,param,recordDanDetail_callback,id);
};
function recordDanDetail_callback(res,id) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        if(data.pageContent){
            // 编辑权限控制 
            if($(".recordImg[data-id="+id+"] .deleteBtn").attr("data-delete") !=1){
                $(".recordImg").removeClass("edit");
                $(".recordImg[data-id="+id+"]").addClass("edit");// 预览列表有选中时为编辑
                var content=JSON.parse(data.pageContent);
                // content.objects[0].evented=false;// 默认背景锁定
                // content.objects[0].selectable=false;// 默认背景锁定
                // content.objects[0].width=$("#canvasMain").width()-40;
                // content.objects[0].height=$("#canvasMain").height()-40;

                // 解决图片跨域问题
                for(var i=0;i<content.objects.length;i++){
                    if(content.objects[i].type=="image"){
                        content.objects[i].crossOrigin="anonymous"
                    };
                };

                canvas.clear();
                canvas.loadFromJSON(content, canvas.renderAll.bind(canvas));
            }else{
                $("#modal-dialog-img").modal("show");
                toastTip("提示","非本人制作的档案只可以查看","2500");
            }
        }else{
            $("#modal-dialog-img").modal("show");
        };
    }else if(res.code==404){
        toastTip("提示","加载失败，请稍候重试。。","2500");
        // window.location.href=httpUrl.loginHttp;
    };
};
























// 左侧工具栏 树结构 功能区

// 选择月份初始化函数
function chooseMonth() {
	var month={month:[1,2,3,4,5,6,7,8,9,10,11,12]};
	var html=template("chooseMonth_script",month);
	$("#chooseMonth").empty().append(html);

	var d=new Date();
	$("#chooseMonth >li >span").removeClass("current");
	$("#chooseMonth >li[data-month="+(d.getMonth()+1)+"]").addClass("current");

	
    

    // 水印颜色选择区
    var colors={colors:["faadad","80d8eb","96a5e7","e6c07e","7ee6a3","c7e67e","ec8f8f","6ad2e8","b687eb","e68e63","4cd57d","376ce4","e376c8","dc6063","9a31bc","a4d03c","dd49df","bc3183","ee6d34","34aaee"]};
    var html01=template("chooseColor_script",colors);
    $("#chooseColor").empty().append(html01);

    
    $("#evaluate").on("click",".xwjlbcont tr td.w3",function() {
        $(this).toggleClass("w2").siblings().removeClass("w2");
    });
    recordPageType_port();// 获取模板类型列表
};
// 获取模板类型列表接口
function recordPageType_port() {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordPageType,param,recordPageType_callback);
};
function recordPageType_callback(res) {
	if(res.code==200){
		var data=JSON.parse(res.data);
        var json={data:data};
		var html=template("templateA_script",json);
		$("#templateA").empty().append(html);
		
		recordPageList_port(1);//封面模板初始化

		treesToggle();// 树结构收缩折叠功能函数
	}else if(res.code==404){
        toastTip("提示","加载失败，请稍候重试。。","2500");
		// window.location.href=httpUrl.loginHttp;
	};
};


// 获取模板页列表接口
function recordPageList_port(pageType) {
    var data={
    		pageType:pageType
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordPageList,param,recordPageList_callback,pageType);
};
function recordPageList_callback(res,pageType) {
	if(res.code==200){
		var data=JSON.parse(res.data);
		for(var i=0;i<data.length;i++){
			data[i].pic=httpUrl.path_img+data[i].imgUrl+"-scale400";
		};
        var json={data:data};
		var html=template("templateB_script",json);
		$("#toolbarList ul[data-type="+pageType+"]").append(html);
	}else{
        toastTip("提示","加载失败，请稍候重试。。","2500");
    };
};

// 获取模板页详情
function recordPageDetail_port(id) {
    var data={
    		id:id,
    		classId:$("#user").attr("data-classid"),
    		month:$("#chooseMonth >li.current").attr("data-month")
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordPageDetail,param,recordPageDetail_callback,id);
};
function recordPageDetail_callback(res) {
    if(res.code ==200){
        var data=JSON.parse(res.data);
        if(data.pageType==1){
            if(data.pageConfig){
                var config=JSON.parse(data.pageConfig);
                // 封面模板个人信息 自动定位
                recordPageLocation_port(config);
            };
        };
        // 评价模板pageType=-1
        if(data.pageType==-1){
            if(data.body){
                var imgUrl=httpUrl.path_img+data.imgUrl+"";
                $("#evaluateBox").empty().append(data.body);
                $("#evaluateBox .temark1 > div").css("background","#fff url("+imgUrl+") center center no-repeat");
                $("#evaluate-wrapper").width($("#evaluateBox > .temark1 > div").outerWidth()+30);
                $("#evaluate").addClass("active");
                $("#canvas").removeClass("active");
            }else{
                toastTip("提示","此评价模板内容暂为空，请选择其他模板","2500");
            }
            
        }else{
            $("#evaluate").removeClass("active");
            $("#canvas").addClass("active");
        }
    }else{
        toastTip("提示","加载失败，请稍候重试。。","2500");
    }
};

// 封面模板个人信息 自动定位
function recordPageLocation_port(config) {
    var data={
            childUserUuid:$("#user").attr("data-useruuid")
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordChildAllInfo,param,recordPageLocation_callback,config);
};
function recordPageLocation_callback(res,config) {
    if(res.code==200){
            var data=JSON.parse(res.data);
            var w01=$("#canvasMain").width();
            var h01=$("#canvasMain").height();// 重新声明变量 适配resize一样能对齐

            var textArr=[];
            var picArr=[];
            for(var i=0;i<config.tag.length;i++){
                config.tag[i].value=data[config.tag[i].tagName];
                if(config.tag[i].tagType=="text"){
                    if(config.tag[i].value){textArr.push(config.tag[i])};
                }else if(config.tag[i].tagType=="pic"){
                    if(config.tag[i].value){picArr.push(config.tag[i]);}
                };
            };

            // 自动匹配字体
            if(picArr.length >0){
                for(var i=0;i<textArr.length;i++){
                    if(textArr[i].value){
                        canvas.add(new fabric.IText(textArr[i].value, { 
                            fontFamily: '宋体',
                            fontSize: 16,
                            left: w01*textArr[i].left, 
                            top: h01*textArr[i].top,
                            class:"bottomText"
                        }));
                    };
                };
            };

            // 自动匹配图片
            if(picArr.length >0){
                for(var i=0;i<picArr.length;i++){
                    var pic=httpUrl.path_img+picArr[i].value+"";
                    var width=picArr[i].width;
                    var left=picArr[i].left;
                    var top=picArr[i].top;
                    
                    fabric.Image.fromURL(pic,function(Img) {
                        Img.scaleToWidth(w01*width).set({
                            left:(w01*left),
                            top:h01*top,
                            class:"bottomPic"
                        });
                        canvas.add(Img);
                    });
                };
            };
            canvas.renderAll();
    }else{
        toastTip("提示","加载失败，请稍候重试。。","2500");
    };
};


























// 预览列表
function recordList() {
	recordDanList_port();

	$("#recordOk").on({
		mouseover:function () {
			$(this).children("span.deleteBtn").addClass("current");
		},
		mouseout:function () {
			$(this).children("span.deleteBtn").removeClass("current");
		},
		click:function () {
			$(this).parent("li").siblings().find(".recordImg").removeClass("current");
			$(this).toggleClass("current");
		}
	},".recordImg");

	$("#recordOk").on("click",".recordImg >span.deleteBtn",function () {
        var id=$(this).attr("data-id");
        var AA=$(this).parents("li");
        if($(this).attr("data-delete")==0){
            swal({
                title: "确定删除吗?",
                text: "删除之后将不可恢复!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: false
                },
                function(isConfirm){
                    if (isConfirm) {
                        recordDanDelete_port(id,AA);
                    } else {
                        swal.close();
                    }
            });
        }else{
            swal("提示", "非本人制作的档案不可删除", "error");
        };
	});

    $("#recordOk").on("click",".recordImg .closeEditBtn",function (e) {
        $(this).parents(".recordImg").removeClass("edit");
        e.stopPropagation();
    });


};
// 预览列表
function recordDanList_port() {
    var data={
    		childUserUuid:$("#user").attr("data-useruuid"),
    		bookId:$("#user").attr("data-bookid"),
    		month:$("#chooseMonth >li.current").attr("data-month")
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordDanList,param,recordDanList_callback);
};
function recordDanList_callback(res) {
	if(res.code==200 && res.data){
		var data=JSON.parse(res.data);
		for(var i=0;i<data.mbdanList.length;i++){
			data.mbdanList[i].pic=httpUrl.path_img+data.mbdanList[i].imgUrl+"-scale400";
		};
		var html=template("recordList_script",data);
        $("#recordOk").nextAll("h3").children("span.has-hover:first").text(data.childNum+"页");// 定位教师学生各自制档案数
        $("#recordOk").nextAll("h3").children("span.has-hover:last").text(data.teacherNum+"页");// 定位教师学生各自制档案数
		$("#recordOk >ul").empty().append(html);
        swal.close();

        // 排序函数
        var el = document.getElementById('recordUl');
        var sortable = new Sortable(el, {
                onUpdate: function (evt) {
                    var pidArr=[];
                    for(var i=0;i<$("#recordUl >li").length;i++){
                        pidArr.push(Number($("#recordUl > li").eq(i).attr("data-pageidx")));
                    };
                    function sortNumber(a,b){
                        return a - b
                    };

                    var arr=[];
                    for(var i=0;i<$("#recordUl >li").length;i++){
                        var data={};
                        data.id=$("#recordUl > li").eq(i).attr("data-id");
                        data.pageIdx=pidArr.sort(sortNumber)[i];
                        arr.push(data);
                    };
                    recordAdjustPosition_port(arr);
                }
        });
	}else if(res.code==200 || !res.data){
		$("#recordOk >ul").empty();
        $("#recordOk").nextAll("h3").children("span.has-hover:first").text("0页");// 定位教师学生各自制档案数
        $("#recordOk").nextAll("h3").children("span.has-hover:last").text("0页");// 定位教师学生各自制档案数
		// console.log("内容为空")
	};
};
// 删除档案页
function recordDanDelete_port(id,AA) {
    var data={
    		id:id
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordDanDelete,param,recordDanDelete_callback,AA);
};
function recordDanDelete_callback(res,AA) {
	if(res.code==200){
		recordDanList_port();
        swal({
            title: "删除成功!",
            text: "1秒后关闭",
            timer: 1000,
            type: "success",
            showConfirmButton: false
        });
	};
};

// 档案排序接口
function recordAdjustPosition_port(newDanList) {
    var data={
            newDanList:newDanList
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordAdjustPosition,param,recordAdjustPosition_callback);
};
function recordAdjustPosition_callback(res) {
    if(res.code==200){
        recordDanList_port()
    };
};




































// 底部功能区
// 自动匹配 图片列表
function autoMatch() {
	recordDanMessage_port();
	$("#autoMatch-list").on("click","> ul >li >span.matchPic",function () {
		$("#autoMatch-list span.matchPic").not(this).removeClass("current");
		$(this).toggleClass("current");	
	});
    $(".autoMatchBtn").click(function () {
        $("#autoMatch-wrapper").fadeOut();
        $(".autoMatchBtn01").fadeIn();
    });
    $(".autoMatchBtn01").click(function () {
        $("#autoMatch-wrapper").fadeIn();
        $(".autoMatchBtn01").fadeOut();
    });
};


// 获取对应幼儿帖子列表
function recordDanMessage_port() {
    var data={
    		childUserUuid:$("#user").attr("data-useruuid"),
    		month:$("#chooseMonth >li.current").attr("data-month")
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordDanMessage,param,recordDanMessage_callback);
};
function recordDanMessage_callback(res) {
	if(res.code==200 && res.data){
		var data=JSON.parse(res.data);
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].messageList.length;j++){
				data[i].messageList[j].pic=httpUrl.path_img+data[i].messageList[j].fileList[0]+"-scale400";
				data[i].messageList[j].picArr=JSON.stringify(data[i].messageList[j].fileList);
                data[i].messageList[j].body=emoji2Str(data[i].messageList[j].body);
			};
		};
        var json={data:data};
		var html=template("autoMatch-list_script",json);
		$("#autoMatch-list >ul").empty().append(html);

		$("#autoMatch-wrapper >h3 i").text($("#chooseMonth >li.current").attr("data-month"));// 自动匹配当前月份

		// 设置ul的总长度
		var length=10;
		for(var i=0;i<$("#autoMatch-list > ul >li").length;i++){
			length += $("#autoMatch-list > ul >li").eq(i).outerWidth();
		};
		$("#autoMatch-list > ul").css("width",length);
	}else if(res.code ==200 && !res.data){
		$("#autoMatch-list >ul").empty();

		$("#autoMatch-wrapper >h3 i").text($("#chooseMonth >li.current").attr("data-month"));// 自动匹配当前月份
	};
};

// 解决表情包无法解析的问题
function emoji2Str (str) {
    return unescape(escape(str).replace(/\%uD.{3}/g, ''));
}





































// 顶部功能区
// 用户信息初始化
function userMessage() {
	$("#userName").text(user.userName);
	$("#userImg >img").attr("src",httpUrl.path_img+user.userPhoto+"-scale400");
	$("#user").attr("data-useruuid",user.userUuid).attr("data-classid",user.classId).attr("data-bookid",user.bookId).attr("data-month",user.month).attr("data-year",user.year);
	recordStudent_port($("#user").attr("data-classid"));

	copyRecord();// 档案页复制函数

	dateInit();// 年份 月份初始化 
};
// 年份 月份初始化 图片库 
function dateInit() {
    var d=new Date();
    var month={month:[1,2,3,4,5,6,7,8,9,10,11,12]};
    var htmlMonth=template("query2017_script",month);
    $(".query2017").append(htmlMonth).find("span[data-value="+(d.getMonth()+1)+"]").addClass("current");

    // 年度切换按钮
    $(".query2016 >span").click(function () {
    	if($(this).attr("data-value") == 2016){
    		$(this).attr("data-value",2017).text("2017");
    		$(this).parent(".query2016").next(".query2017").children("span:first").attr("data-value",2016).text("2016");
    		recordPiclib_port();
    	} else if($(this).attr("data-value") == 2017){
    		$(this).attr("data-value",2016).text("2016");
    		$(this).parent(".query2016").next(".query2017").children("span:first").attr("data-value",2017).text("2017");
    		recordPiclib_port();
    	}
    });

    $(".query2017").on("click",">span:first",function () {
    	if($(this).attr("data-value") == 2016){
    		$(this).attr("data-value",2017).text("2017");
    		$(this).parent(".query2017").prev(".query2016").children("span:first").attr("data-value",2016).text("2016");
    		recordPiclib_port();
    	} else if($(this).attr("data-value") == 2017){
    		$(this).attr("data-value",2016).text("2016");
    		$(this).parent(".query2017").prev(".query2016").children("span:first").attr("data-value",2017).text("2017");
    		recordPiclib_port();
    	}
    });

    // 切换月份函数
    $(".query2017").on("click",">span.month",function () {
    	$(this).addClass("current").siblings().removeClass("current");
    	recordPiclib_port();
    });

    $("#addPicBtn").click(function () {
		recordPiclib_port();
	});

	$("#picTabContent >.tab-pane >.picQuery >label select").change(function () {
		recordPiclib_port();
	});

	$(".picMain >ul").on("click",".picBody >li:not(.addBtn01,.addBtn02)",function (e) {
		$(this).toggleClass("active");
	});

	$(".picMain >ul").on("click",".picBody >li.addBtn01",function () {
		$("#addBtn").click();
	});

	// 选项卡切换之后查询一次数据
	$('#picTab').on('shown.bs.tab', function (e) {
		var tabid=$("#picTab >li.active").attr("data-tabid");
		var num=$("#picTabContent >.tab-pane[data-tabid="+tabid+"] >.picMain >ul").children().length;
		if(num ==0){
			recordPiclib_port();
		};
	});
	
}
function recordPiclib_port() {
	var tabid=$("#picTab >li.active").attr("data-tabid");
	var AA={};
	AA.tabId=$("#picTab >li.active").attr("data-tabid");
	AA.year=$("#picTabContent >.tab-pane[data-tabid="+tabid+"] >.query2017 >span:first").attr("data-value");
	AA.month=$("#picTabContent >.tab-pane[data-tabid="+tabid+"] >.query2017 >span.month.current").attr("data-value");
	AA.labelId=$("#picTabContent >.tab-pane[data-tabid="+tabid+"] >.picQuery >label:first select").val();
	AA.childUserUuid=$("#picTabContent >.tab-pane[data-tabid="+tabid+"] >.picQuery >label:last select").val();
	if(tabid == 2){
		AA.childUserUuid=$("#user").attr("data-useruuid");
	}

    var data={
    		tabId:AA.tabId,
    		year:AA.year,
    		month:AA.month,
    		labelId:AA.labelId,
    		childUserUuid:AA.childUserUuid
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    if(tabid ==3){
    	initAjax(httpUrl.recordUploadList,param,recordUploadList_callback);//上传图片 tab页
    }else{
    	initAjax(httpUrl.recordPiclib,param,recordPiclib_callback);
    }
    
};
function recordPiclib_callback(res) {
	if(res.code==200 && res.data){
		var data=JSON.parse(res.data);
		for(var i=0;i<data.length;i++){
			data[i].path=httpUrl.path_img;
		};
        var json={data:data};
		var html=template("picMain_script",json);
		var tabid=$("#picTab >li.active").attr("data-tabid");
		$("#picTabContent >.tab-pane[data-tabid="+tabid+"] >.picMain >ul").empty().append(html);
		
	}else if(res.code==200 && !res.data){
        var tabid=$("#picTab >li.active").attr("data-tabid");
        $("#picTabContent >.tab-pane[data-tabid="+tabid+"] >.picMain >ul").empty();
		// window.location.href=httpUrl.loginHttp;
	}else{
        toastTip("提示","加载失败，请稍候重试。。","2500");
    };
};

// 获取上传的文件列表
function recordUploadList_callback(res) {
	if(res.code==200 && res.data){
		$(".uploadBg").addClass("hide");
		var data=JSON.parse(res.data);
		for(var i=0;i<data.length;i++){
			data[i].path=httpUrl.path_img;
		};
        var json={data:data};
		var html=template("picMain01_script",json);
		var tabid=$("#picTab >li.active").attr("data-tabid");
		$("#picTabContent >.tab-pane[data-tabid="+tabid+"] >.picMain >ul").empty().append(html);
		
	}else if(res.code==404){
        toastTip("提示","加载失败，请稍候重试。。","2500");
		// window.location.href=httpUrl.loginHttp;
	};
};

// 档案页复制函数
function copyRecord() {
    // 档案页复制函数
	$("#copeRecord").click(function () {
        if($("#recordOk .recordImg.current").length !=0){
            $("#classMembers .membersBg.active").removeClass("active");
            $("#modal-copy").modal("show");
        }else{
            swal({
                title: "提示!",
                text: "请先选择需复制的档案页。。",
                timer: 3000,
                type: "warning",
                showConfirmButton: true,
                confirmButtonText: "知道啦",
                confirmButtonColor: "#f8e264"
            });
        };
	});

    // 档案复制按钮 函数
    $("#copyBtn").click(function () {
        if($("#classMembers .membersBg.active").length !=0){
            var Arr=[];
            for(var i=0;i<$("#classMembers .membersBg.active").length;i++){
                Arr.push($("#classMembers .membersBg.active").eq(i).attr("data-useruuid"));
            };
            var id=$("#recordOk .recordImg.current").attr("data-id");
            recordDanCopy_port(Arr,id);// 档案复制接口
        }else{
            swal({
                title: "提示!",
                text: "请先选择需复制档案页的学生",
                timer: 3000,
                type: "warning",
                showConfirmButton: true,
                confirmButtonText: "知道啦",
                confirmButtonColor: "#f8e264",
            });
        };
    });

	$("#classMembers").on("click","li >div.membersBg",function () {
		$(this).toggleClass("active");
	});
	$("#modal-copy .modal-footer input").click(function () {
		if($(this).is(":checked")){
			$("#classMembers .membersBg").addClass("active");
		}else{
			$("#classMembers .membersBg").removeClass("active");
		};
	});
};
function recordStudent_port(classId) {
    var data={
    		classId:classId,
    		year:$("#user").attr("data-year"),
    		month:$("#user").attr("data-month")
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
		  for(var i=0;i<data.length;i++){
			 data[i].portrait=httpUrl.path_img+data[i].userPhoto+"";
		  };
          var json01={data:data};
		  var html=template("classMembers_script",json01);
		  $("#classMembers").empty().append(html);
		  $("#childrenList").empty().append(html);

          $("#classMembers >li >.membersBg[data-useruuid="+$("#user").attr("data-useruuid")+"]").parent("li").addClass("hide");

          var json02={data:data};
		  var html01=template("student_script",json02);
		  $("#student01").empty().append(html01);
		  $("#student02").empty().append(html01);

		  recordLabelList_port();// 获取学校所有标签
	}else if(res.code==404){
        $.toast({
            heading: "提示",
            text: "登录信息过期,请重新登录。。",
            showHideTransition: 'slide',
            icon: 'success',
            hideAfter: 2500,
            loaderBg: '#edd42e',
            position: 'bottom-right',
            afterHidden: function () {
                window.location.href="../index.html";
            }
        });
	};
};
// 获取学校所有标签
function recordLabelList_port(classId) {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordLabelList,param,recordLabelList_callback);
};
function recordLabelList_callback(res) {
	if(res.code==200){
		var data=JSON.parse(res.data);
        var json01={data:data};
		var html=template("labelList01_script",json01);
		$("#labelList01,#labelList02").empty().append(html);
	}else if(res.code==404){
        toastTip("提示","加载失败，请稍候重试。。","2500");
		// window.location.href=httpUrl.loginHttp;
	};
};

// 档案复制接口
function recordDanCopy_port(userUuidList,id) {
    var data={
            userUuidList:userUuidList,
            id:id
    };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordDanCopy,param,recordDanCopy_callback);
};
function recordDanCopy_callback(res) {
    if(res.code==200){
        swal({
            title: "复制成功!",
            text: "1秒后关闭",
            timer: 1000,
            type: "success",
            showConfirmButton: false
        });
        $("#modal-copy").modal("hide");
    }else if(res.code==404){
        toastTip("提示","加载失败，请稍候重试。。","2500");
        // window.location.href=httpUrl.loginHttp;
    };
};

// 提示函数
function tiphover() {
	$(".has-hover").on({
		mouseover:function () {
			$(this).next(".descInfo").addClass("current");
		},
		mouseout:function () {
			$(this).next(".descInfo").removeClass("current");
		}
	});
	$("#childrenBtn").on("click",function () {
		$(this).find("span").toggleClass("upBtn");
        $(this).nextAll(".triangle").toggleClass("active");
		$("#childrenList").toggleClass("active");
	});
};
// 上传图片
function loadFiles() {
    loginUserInfo_port();
    // 获得登录人信息
    function loginUserInfo_port() {
        var data={};
        var param={
            loginId:httpUrl.loginId
        };
        initAjax(httpUrl.loginUserInfo,param,loginUserInfo_callback);
    };
    function loginUserInfo_callback(res) {
        if(res.code==200){
            var data=JSON.parse(res.data);
            user.companyUUID=data.companyUUID;
            upToken1_port();
        };
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
        };
    };
    function loadFiles01() {
        var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'addBtn',         // 上传选择的点选按钮，必需
                uptoken: user.upToken1, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: httpUrl.path_img,     // bucket域名，下载资源时用到，必需
                max_file_size: '1024mb',             // 最大文件体积限制
                multi_selection: true,              // 多选上传
                max_retries: 3,                     // 上传失败最大重试次数
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FileUploaded': function(up, file, info) {
                        var data={
                                md5:JSON.parse(info.response).key,
                                path_img:httpUrl.path_img
                        };
                        recordUploadSave_port(data.md5);
                        $("#addBtn").find("div").remove();
                    },
                    'Error': function(up, err, errTip) {
                            console.log(errTip);
                    }
                }
            });
    };
};
// 上传文件接口
function recordUploadSave_port(fileMd5) {
    var data={
    		fileMd5:fileMd5
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.recordUploadSave,param,recordUploadSave_callback);
};
function recordUploadSave_callback(res) {
	if(res.code==200){
		recordPiclib_port();
	}else{
        toastTip("提示","加载失败，请稍候重试。。","2500");
    };
};



























// 基础功能函数

// loading载入
function loading(){
	$("#page-loader").addClass("hide");
};
// loading载入函数
function loadingIn() {
    $("#page-loader").removeClass('hide');
    $("#page-loader").css("z-index","999999");
};
function loadingOut() {
    $("#page-loader").addClass('hide'); 
};
// 树结构收缩折叠功能函数
function treesToggle() {
	$(".has-sub >a").click(function(){
		$(this).parent().toggleClass("active");
		if($(this).attr("data-type") =="-1"){
			if($("#templateC").children().length ==0){
				recordPageList_port($("#templateC").attr("data-type"));// 获取模板页列表接口
			}
		}
   	});
   	$(".sub-list >a").click(function(){
		$(this).next("ul.has-menu").toggleClass("current");
		$(this).parent(".sub-list").siblings().find("ul.has-menu").removeClass("current");
		
		if($(this).next("ul.sub-menu").children().length ==0){
			recordPageList_port($(this).next("ul.sub-menu").attr("data-type"));// 获取模板页列表接口
		};
   	});

   	// 选中模板函数
    $("ul.has-menu").on("click","> li",function () {
    	$("ul.has-menu >li").removeClass("current");
    	$(this).addClass("current");
    });

    $("ul#templateC.has-menu").on("click","> li",function () {
        recordPageDetail_port($(this).attr("data-id"));
    });
};

function niceScroll() {
	chooseNiceScroll("#toolbarList");
	chooseNiceScroll("#autoMatch-list");
	chooseNiceScroll("#recordOk");
	chooseNiceScroll("#teachers");
	chooseNiceScroll("#parents");
	chooseNiceScroll("#upload");
	chooseNiceScroll("#classMembers");
	chooseNiceScroll("#childrenList");
    chooseNiceScroll("#evaluateBox");
    chooseNiceScroll("#fontNameDropdown .font-name-list","#555");
    chooseNiceScroll("#fontSizeDropdown ul","#555");
    chooseNiceScroll("#matchList");
};
// niceScroll滚动条
function chooseNiceScroll(AA,color) {
	$(AA).niceScroll({ 
    	cursorcolor: color || "#ccc",//#CC0071 光标颜色 
    	cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
    	touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
    	cursorwidth: "5px", //像素光标的宽度 
    	cursorborder: "0", //     游标边框css定义 
    	cursorborderradius: "5px",//以像素为光标边界半径 
    	autohidemode: false //是否隐藏滚动条 
	});
};
// 消息提示函数
function toastTip(heading,text,hideAfter) {
	$.toast({
        	heading: heading,
        	text: text,
        	showHideTransition: 'slide',
        	icon: 'success',
        	hideAfter: hideAfter || 1500,
        	loaderBg: '#edd42e',
        	position: 'bottom-right'
    });
};