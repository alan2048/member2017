var Arr=[];
$(function () {
    init();
});
function init() {
    menu();
    watchDimensions_port();// 登入成功之后再回调执行函数,解决curCompanyId取不到的问题
};

function watchDimensions_port(pageNumber) {
    var data={};
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.dimList,param,watchDimensions_callback);
};
function watchDimensions_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        Arr.length=0;
        Arr=tree2json(data);

        getDimLevelList_port(Arr[0].id);//默认查询第一项

        var json={data:data};
        var html=template("trees_script",json);
        $("#trees").empty().append(html);
        
        watchDimensions_after();
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function watchDimensions_after(){
    // 第一层级点击折叠效果函数
    $("#trees").on("click",'li.has-sub01 >a',function () {
        var e = $(this).next('.sub-menu01');
        var t = '#trees >ul >li.has-sub01 > .sub-menu01';
        $(t).not(e).slideUp(250);
        $(e).slideToggle(250);
        var dimId=$(e).attr("data-dimid");
        getDimLevelList_port(dimId);
    });

    addDim();// 添加维度执行函数区
    deleteDim();// 删除维度执行函数
    keepclick();// 右侧维度执行函数区
}

// 添加维度执行函数区
function addDim() {
    // 添加按钮功能
    $("#trees").on("click",'.maxAddBtn,li.addbtn',function () {
        $(this).prev('li.level01input').children('input').val('');
        $(this).prev('li.level01input').show();
        $(this).prev('li.level01input').children('input').focus();
    });

    // 最高层级input新增接口函数
    $("#trees >ul").on({
        blur:function () {
            var value=$(this).val();
            if(value){
                var param={
                        id:"0",// id为0为新增，不为1为更新
                        level:$(this).attr("data-level"),
                        name:value,
                        parentId:$(this).attr("data-parentid"),
                        type:''
                };
                // dimSave_port(param); 

            var _self=$(this);
            $.ajax({
                type:"POST",
                url:httpUrl.dimAddOrUpdate,
                data:{params:JSON.stringify(param),loginId:httpUrl.loginId},
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        var data=JSON.parse(res.data);
                        var html='<li class="has-sub01" data-dimid='+data.id+'  data-parentid='+data.parentId+' data-level='+data.level+' data-type='+data.type+'>'+
                                    '<a href="javascript:;" data-dimid='+data.id+'  data-parentid='+data.parentId+' data-level='+data.level+' data-type='+data.type+' data-name='+data.name+'>'+data.name+
                                        '<b>&gt;</b>'+
                                    '</a>'+
                                    '<ul class="sub-menu01" data-dimid='+data.id+' data-level="1" data-type='+data.type+' style="display: none;">'+
                                        '<li class="level01input">'+
                                            '<input placeholder="请输入描述。。" type="text">'+
                                        '</li>'+
                                        '<li class="addbtn"></li>'+
                                    '</ul>'+
                                '</li>'
                        _self.parent().before(html);
                        _self.parent().hide();
                        Arr.push(data);
                    }
                },
                error:function (res) {
                    console.log(res);
                }
              });

            }else{
                $(this).parent(".level01input").hide();
            }
        },
        keyup:function (e) {
            if(e.keyCode==13){
                $(this).blur();
            }
        }
    },">li.level01input >input");

    // 第二层级input新增接口函数
    $("#trees").on({
        blur:function () {
            var value=$(this).val();
            var _self=$(this).parents("ul.sub-menu01").eq(0);
            if(value){
                var param={
                        id:"0",// id为0为新增，不为1为更新
                        level:_self.attr("data-level"),
                        name:value,
                        parentId:_self.attr("data-dimid"),
                        type:''//默认传空值
                };

            var _self=$(this);
            $.ajax({
                type:"POST",
                url:httpUrl.dimAddOrUpdate,
                data:{params:JSON.stringify(param),loginId:httpUrl.loginId},
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        var data=JSON.parse(res.data);
                        var html='<li class="has-sub02" data-dimid='+data.id+'  data-parentid='+data.parentId+' data-level='+data.level+' data-type='+data.type+'>'+
                                    '<a href="javascript:;" data-dimid='+data.id+'  data-parentid='+data.parentId+' data-level='+data.level+' data-type='+data.type+' data-name='+data.name+'>'+data.name+'</a>'+
                                '</li>';
                        _self.parent().before(html);
                        _self.parent().hide();
                        Arr.push(data);
                    }
                },
                error:function (res) {
                    console.log(res);
                }
              });              
            }else{
                $(this).parent().hide();
            }
        },
        keyup:function (e) {
            if(e.keyCode==13){
                $(this).blur();
            }
        }
    },"ul.sub-menu01 >li.level01input input");

    // 第二层级点击显示右侧结构函数
    $("#trees").on("click","li.has-sub02 >a",function () {
        var dimId=$(this).attr("data-dimid");
        getDimLevelList_port(dimId);
        var newArr=[];
        $.each(Arr,function (i,value) {
            if(value.parentid==dimId){
                newArr.push(value)
            }
        });
        if(newArr.length>0){
            var json={newArr:newArr};
            var html=template('treesmain_script',json);
            $("#treesmain").empty().append(html);
        }else{
            var html='<ul class="tree-menu" data-level='+(Number($(this).attr("data-level"))+1)+' data-parentid='+$(this).attr("data-dimid")+'>'+
                        '<li class="leftArrow"></li>'+
                        '<li class="level01input">'+
                            '<input type="text" placeholder="请输入描述。。" data-level='+(Number($(this).attr("data-level"))+1)+' data-parentid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+'>'+
                        '</li>'+
                        '<li class="addsmall"></li>'+
                        '<li class="rightArrow"></li>'+
                    '</ul>';
            $("#treesmain").empty().append(html);
        }
    });
}


// 删除维度执行函数区
function deleteDim() {
    // 右键菜单事件 删除与编辑功能
    document.oncontextmenu=function (e) {return false;};
    document.onclick=function (e) {
        $("#menu").hide();
    };

    // 右侧树右键弹出菜单
    $("#trees").on("contextmenu","a",function (e) {
        if($(this).attr("data-type") != "0"){
            var html='<li data-dimid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+' class="delete">删除</li>'+
                        '<li data-dimid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+' class="edit">'+
                            '<span class="editText">编辑</span>'+
                            '<input class="editInput" type="text" placeholder="请输入描述。。" data-dimid='+ $(this).attr("data-dimid")+' data-type='+ $(this).attr("data-type")+' data-parentid='+$(this).attr("data-parentid")+' data-level='+$(this).attr("data-level")+' data-name='+$(this).attr("data-name")+'>'
                        '</li>';
            $("#menu").empty().append(html).show();
            $("#menu li.edit input").val($(this).attr("data-name"));

            var menu = document.getElementById("menu");
            var e = e ||window.event;//兼容
            e.cancelBubble = true;
            //判断鼠标坐标是否大于视口宽度-块本身宽度
            var cakLeft = (e.clientX > document.documentElement.clientWidth - menu.offsetWidth)?(document.documentElement.clientWidth - menu.offsetWidth):e.clientX;
            var cakTop = (e.clientY > document.documentElement.clientHeight - menu.offsetHeight)?(document.documentElement.clientHeight - menu.offsetHeight):e.clientY;
            menu.style.left = cakLeft + "px";
            menu.style.top = cakTop + "px";
        };
    });
    // 左侧维度右键弹出菜单
    $("#treesmain").on("contextmenu","a",function (e) {
        if($(this).attr("data-type") != "0"){
            var html='<li data-dimid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+' class="delete">删除</li>'+
                        '<li data-dimid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+' class="edit">'+
                            '<span class="editText">编辑</span>'+
                            '<input class="editInput" type="text" placeholder="请输入描述。。" data-dimid='+ $(this).attr("data-dimid")+' data-type='+ $(this).attr("data-type")+' data-parentid='+$(this).attr("data-parentid")+' data-level='+$(this).attr("data-level")+' data-name='+$(this).attr("data-name")+'>'
                        '</li>';
            $("#menu").empty().append(html).show();
            $("#menu li.edit input").val($(this).attr("data-name"));

            var menu = document.getElementById("menu");
            var e = e ||window.event;//兼容
            e.cancelBubble = true;
            //判断鼠标坐标是否大于视口宽度-块本身宽度
            var cakLeft = (e.clientX > document.documentElement.clientWidth - menu.offsetWidth)?(document.documentElement.clientWidth - menu.offsetWidth):e.clientX;
            var cakTop = (e.clientY > document.documentElement.clientHeight - menu.offsetHeight)?(document.documentElement.clientHeight - menu.offsetHeight):e.clientY;
            menu.style.left = cakLeft + "px";
            menu.style.top = cakTop + "px";
        };
    });

    // 删除维度接口函数
    $("#menu").on("click",'li.delete',function () {
        var type=$(this).attr("data-type");
        if(type=="0"){
            toastTip("提示","非自定义维度为不可删除数据");
        }else{
            var dimid=$(this).attr("data-dimid");
            var i;
            $.each(Arr,function (index,value) {
                if(value.id==dimid){
                    i=index;
                }
            });
            
            var _self=$(this);
            $.ajax({
                type:"POST",
                url:httpUrl.dimDelete,
                data:{params:JSON.stringify({id:dimid}),loginId:httpUrl.loginId},
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        _self.parent().hide();
                        Arr.splice(i,1);
                        var num=$("#wacthtree li[data-dimid="+dimid+"]").parent(".tree-menu").find(".list").length;
                        if(num==1){
                            $("#wacthtree li[data-dimid="+dimid+"]").parent("ul.tree-menu").remove();
                            $("#treesmain >ul.tree-menu[data-parentid="+dimid+"]").remove();
                        }else{
                            $("#treesmain >ul.tree-menu[data-parentid="+dimid+"]").remove();
                            $("#wacthtree li[data-dimid="+dimid+"]").remove();
                        };
                        toastTip("提示","删除成功。。");
                    }
                    if(res.code==500){
                        _self.parent().hide();
                        toastTip("提示","此维度有子项，为保护数据，请先将子项删除才能删除此数据");
                    }
                },
                error:function (res) {
                    console.log(res);
                }
              });
        }
         
    });

    $("#menu").on("click",'li.edit >span',function (e) {
        stopBubble(e);//阻止冒泡
        $(this).hide();
        $(this).next("input").show().focus();
    });
    // 编辑维度接口函数
    $("#menu").on("focusout",'li.edit >input',function (e) {
        stopBubble(e);//阻止冒泡
        var type=$(this).attr("data-type");
        var name=$(this).val();

        if(name!=$(this).attr("data-name")){
            if(type=="0"){
                alert("非自定义维度为不可编辑数据");
            }else{
                var dimid=$(this).attr("data-dimid");
                var i;
                $.each(Arr,function (index,value) {
                    if(value.id==dimid){
                        i=index;
                    }
                });
            
                var param={
                        id:$(this).attr("data-dimid"),
                        name:$(this).val(),
                        parentId:$(this).attr("data-parentid"),
                        level:$(this).attr("data-level"),
                        type:$(this).attr("data-type")
                }
                var _self=$(this);
                $.ajax({
                    type:"POST",
                    url:httpUrl.dimAddOrUpdate,
                    data:{params:JSON.stringify(param),loginId:httpUrl.loginId},
                    dataType:"json",
                    success:function (res) {
                        if(res.code==200){
                            Arr[i].name=name;
                            $("#wacthtree a[data-dimid="+dimid+"]").text(name).attr("data-name",name);
                            $("#menu").hide();
                        }
                    },
                    error:function (res) {
                        console.log(res);
                    }
                });
            }
        }else{
            $("#menu").hide();
        }
         
    }).on('keyup','li.edit >input',function (e){
        if(e.keyCode==13){
            $(this).blur();
        }
    });;   
}

// 右侧维度执行函数区
function keepclick() {
    $("#treesmain").on('click','li.list >a',function () {
        var level=Number($(this).attr("data-level"))+1;
        var num=$("#treesmain >ul");
        for(var i=0;i<num.length;i++){
            var level01=Number(num.eq(i).attr("data-level"));
            if(level01>=level){
                num.eq(i).remove();
            }
        };//清楚前面的ul函数区

        // 点击后添加样式
        $(this).parents(".tree-menu").children(".list").removeClass("current");
        $(this).parent(".list").addClass("current");

        var dimId=$(this).attr("data-dimid");
        getDimLevelList_port(dimId);
        var newArr=[];
        $.each(Arr,function (i,value) {
            if(value.parentid==dimId){
                newArr.push(value)
            }
        });

        if(newArr.length>0){
            var json={newArr:newArr};
            var html=template('treesmain_script',json);
            $("#treesmain").append(html);
        }else{
            var html='<ul class="tree-menu" data-level='+(Number($(this).attr("data-level"))+1)+' data-parentid='+$(this).attr("data-dimid")+'>'+
                        '<li class="leftArrow"></li>'+
                        '<li class="level01input">'+
                            '<input type="text" placeholder="请输入描述。。" data-level='+(Number($(this).attr("data-level"))+1)+' data-parentid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+'>'+
                        '</li>'+
                        '<li class="addsmall"></li>'+
                        '<li class="rightArrow"></li>'+
                    '</ul>'
            $("#treesmain").append(html);
        }
    });

    $("#treesmain").on('click','li.addsmall',function () {
        $(this).prev("li.level01input").show().find("input").val('').focus();
    });
    $("#treesmain").on('blur','li.level01input input',function () {
        var value=$(this).val();
        if(value){
            var param={
                    id:"0",
                    level:$(this).attr("data-level"),
                    name:value,
                    parentId:$(this).attr("data-parentid"),
                    type:''//默认传空值
            };
            
            var _self=$(this);
            $.ajax({
                type:"POST",
                url:httpUrl.dimAddOrUpdate,
                data:{params:JSON.stringify(param),loginId:httpUrl.loginId},
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        var data=JSON.parse(res.data);
                        var html='<li class="list" data-dimid='+data.id+'>'+
                                    '<a href="javascript:;" data-dimid='+data.id+'  data-parentid='+data.parentId+' data-level='+data.level+' data-type='+data.type+' data-name='+data.name+'>'+data.name+
                                    '</a>'
                                '</li>';
                        _self.parent().before(html);
                        _self.parent().hide();
                        Arr.push(data);
                    }
                },
                error:function (res) {
                    console.log(res);
                }
            });   
        }else{
            $(this).parent().hide();
        }
    }).on('keyup','li.level01input input',function (e){
        if(e.keyCode==13){
            $(this).blur();
        }
    });
}

// 新增维度接口
function dimSave_port(data) {
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.dimSave,param,dimSave_callback);
};
function dimSave_callback(res) {
    if(res.code==200){
        var data01=JSON.parse(res.data);
        // watchDimensions_port();
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 删除维度接口
function dimDelete_port(dimid) {
    var data={
            dimid:dimid
    }
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.dimDelete,param,dimDelete_callback);
};
function dimDelete_callback(res) {
    if(res.code==200){
        // watchDimensions_port();
        // console.log(res);
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 树结构转平行json格式函数
function tree2json(Array) {
    var Arr = [];
    var tree2json01 = function(data){
        var obj;
        if(data){
            for(var i=0;i<data.length;i++){
                obj=data[i];
                Arr.push(obj);
                if(obj.childDimList){
                    obj=obj.childDimList;
                    tree2json01(obj);
                }else{
                    return;
                }
            }
        }
    }
    tree2json01(Array);
    return Arr;
}






//===================================================================================================================================










// 表现水平功能函数区
function getDimLevelList_port(dimid) {
    var data={
            dimId:dimid
        };
    var param={
            params:JSON.stringify(data),
            loginId:httpUrl.loginId
    };
    initAjax(httpUrl.dimLevelList,param,getDimLevelList_callback,dimid);
};
function getDimLevelList_callback(res,dimid) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        if(data.length>0){
            var json={data:data};
            var html=template('descTrees_script',json);
            $("#descTrees").empty().append(html);
            getDimLevelList_after(); 
        }else{
                var html='<ul style="width:2000px;">'+
                            '<li class="descListlast" data-dimid='+dimid+'></li>'+
                        '</ul>';
                $("#descTrees").empty().append(html);
                getDimLevelList_after();
            }
        
        
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function getDimLevelList_after() {
    getDimLevelList_hover();
    // 新增观察维度水平描述接口函数
    $("#descTrees .descListlast").click(function () {
        var index=$("#descTrees .descList").length+1;
        if(index <7){
            var dimid=$(this).attr("data-dimid");
            var html='<li class="descList">'+
                        '<div class="descTitle">'+
                            '<span>表现水平'+index+'</span>'+
                            '<span class="closeBtn" data-id=\'\' data-dimid=\'\'></span>'+
                        '</div>'+
                        '<ul>'+
                            '<li class="descContext">'+
                                '<span data-id=\'\' data-dimid=\'\'></span>'+
                                '<span>></span>'+
                                '<input type="text" data-id=\'\' data-dimid='+dimid+' data-level='+index+' data-type=\'\' placeholder="请输入描述。。">'+
                            '</li>'+
                        '</ul>'+
                    '</li>'
            $(this).before(html);
            $(this).prev(".descList").find("input").show().focus();
            getDimLevelList_hover();
        }else{
            toastTip("提示","表现水平数最大为6个")
        }
    });
}
function getDimLevelList_hover() {
    $("#descTrees li.descList").mouseover(function () {
        if($(this).attr("data-type") !="0"){
            $(this).find("span.closeBtn").show();
            $(this).find(".triangleLeft,.triangleRight").addClass("active");
        };
    }).mouseout(function () {
        if($(this).attr("data-type") !="0"){
            $(this).find("span.closeBtn").hide();
            $(this).find(".triangleLeft,.triangleRight").removeClass("active");
        };
    }).dblclick(function () {
        if($(this).attr("data-type") !="0"){
            $(this).find("input").text('').show().focus();
        };
    });
   
    // 水平描述删除接口函授
    $("#descTrees .descList .closeBtn").click(function () {
         var data={
                id:$(this).attr("data-id")
         };
         var AA=$(this).parents('.descList');
         swal({
                title: "是否删除此信息？",
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
                        deleteDimLevel_port(data);
                        AA.remove();
                    };
            });
         
    });

    $("#descTrees li.descList .triangleLeft").click(function () {
        var level=Number($(this).attr("data-level"));
        if(level ==1){
            toastTip("表现水平已为最小1");
        }else{
            $(this).parents(".descList").attr("data-level",level-1);
        };
        var data={
                id:$(this).parents(".descList").attr("data-id"),
                description:$(this).parents(".descList").find(".descBox").text(),
                dimId:$(this).parents(".descList").attr("data-dimid"),
                level:$(this).parents(".descList").attr("data-level"),
                type:$(this).parents(".descList").attr("data-type")
        };
        saveDimLevel_port(data);
    }); 

    $("#descTrees li.descList .triangleRight").click(function () {
        var level=Number($(this).attr("data-level"));
        if(level ==6){
            toastTip("表现水平已为最大6");
        }else{
            $(this).parents(".descList").attr("data-level",level+1);
        };
        var data={
                id:$(this).parents(".descList").attr("data-id"),
                description:$(this).parents(".descList").find(".descBox").text(),
                dimId:$(this).parents(".descList").attr("data-dimid"),
                level:$(this).parents(".descList").attr("data-level"),
                type:$(this).parents(".descList").attr("data-type")
        };
        saveDimLevel_port(data);
    });

    // 水平描述编辑接口函数
    $("#descTrees .descList .descContext input").on({
        blur:function () {
            var id=$(this).attr("data-id");
            var value=$(this).val();
            if(id){
                if(value){
                    var data={
                            id:$(this).attr('data-id'),
                            description:$(this).val(),
                            dimId:$(this).attr("data-dimid"),
                            level:$(this).attr("data-level"),
                            type:1
                    };              
                    saveDimLevel_port(data);
                    $(this).hide();
                    $(this).parent(".descContext").children("span:first").text(value);
                }else{
                    $(this).hide();
                }
            }else{
                if(value){
                    var data={
                            id:0,
                            description:value,
                            dimId:$(this).attr("data-dimid"),
                            level:$(this).attr("data-level"),
                            type:1
                    }
                    saveDimLevel_port(data);
                    $(this).hide();
                    $(this).parent(".descContext").children("span:first").text(value);
                }else{
                    $(this).parents('.descList').remove();
                }
            }
        },
        keyup:function (e) {
            if(e.keyCode==13){
                $(this).blur();
            }
        }
    });
}
// 水平描述新增接口函授
function saveDimLevel_port(data) {
    var param={
            params:JSON.stringify(data),loginId:httpUrl.loginId
    };
    initAjax(httpUrl.dimLevelAddOrUpdate,param,saveDimLevel_callback);
};
function saveDimLevel_callback(res) {
    if(res.code==200){
        var dimid=JSON.parse(res.data).dimId;
        getDimLevelList_port(dimid);
        // console.log(res);
    }
}
// 水平描述编辑接口函数
function updateDimLevel_port(data) {
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.updateDimLevel,param,updateDimLevel_callback);
};
function updateDimLevel_callback(res) {
    if(res.code==200){
        // console.log(res);
    }
}
// 水平描述删除接口函授
function deleteDimLevel_port(data) {
    var param={
            params:JSON.stringify(data),loginId:httpUrl.loginId
    };
    initAjax(httpUrl.dimLevelDelete,param,deleteDimLevel_callback);
};
function deleteDimLevel_callback(res) {
    if(res.code==200){
        // console.log(res);
    }
}
   

function stopBubble(e) { 
//如果提供了事件对象，则这是一个非IE浏览器 
    if ( e && e.stopPropagation ) 
    //因此它支持W3C的stopPropagation()方法 
    e.stopPropagation(); 
     else 
    //否则，我们需要使用IE的方式来取消事件冒泡 
    window.event.cancelBubble = true; 
} 
  




























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
            background:"url("+data.path_img+data.portraitMD5+"&minpic=0) no-repeat scroll center center / 100%"
        });
        loadingOut();//关闭loading
    };
};