httpUrl.recordStat=path+"/app/sample/parent/record/stat";// 统计
winResize();

var jsonAll01;
$(function () {
	recordStat_port();
}); 

// 雷达
function recordStat_port() {
    var data={
    		userUUID:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.recordStat,param,recordStat_callback);
};
function recordStat_callback(res) {
    if(res.code==200){
        $("#page-loader").removeClass("in");	
        var data=JSON.parse(res.data);
        jsonAll01=data.stat;
        echart_A01("searchBox01",data.stat);

        var data01=data;
        var html=template("advice_script",data01);
        $("#advice").empty().html(html);
        $('textarea').each(function () {
            this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
        });
    }else{
    	// alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

function echart_A01(id,json,curName){
    var myChart = echarts.init(document.getElementById(id));

    var data={
            indicator:[],
            legend:[],
            value:[]
    };

    for(var i=0;i<json.length;i++){
        data.legend.push(json[i].dim0Name);
        data.value.push(Number(json[i].value.slice(0,3)));

        var aa={};
        aa.name=json[i].dim0Name;
        aa.max=100;
        data.indicator.push(aa);
    };
    
    var radius=50;
    if(parseInt(window.innerWidth/2-80) >0){
        radius=parseInt(window.innerWidth/2-80);
    };

    var option={
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'item',
                backgroundColor : 'rgba(94,94,94,0.6)'
            },
            radar: {
                indicator: data.indicator,
                shape: 'circle',
                splitNumber: 5,
                name: {
                    textStyle: {
                        color: '#525252',
                        fontSize:10
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: [
                            'rgba(52, 52, 52, 0.1)', 'rgba(52, 52, 52, 0.1)',
                            'rgba(52, 52, 52, 0.1)', 'rgba(52, 52, 52, 0.1)',
                            'rgba(52, 52, 52, 0.1)', 'rgba(52, 52, 52, 0.1)'
                        ].reverse()
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(52, 52, 52, 0.1)'
                    }
                },
                radius: radius
            },
            series: [
                {
                    name: '综合分析',
                    type: 'radar',
                    data: [
                        {
                            value: data.value,
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:12
                                    }
                                }

                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#bff2f3'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.8
                        }
                    }
                }
            ]
        };

    myChart.setOption(option);
};

function winResize() {
    var fs=$(window).width()/750*100;
    $("html").css("font-size",fs);
    $(window).resize(function () {
        var fs01=$(window).width()/750*100;
        $("html").css("font-size",fs01);
        if(jsonAll01){
            echart_A01("searchBox01",jsonAll01);
            $('textarea').each(function () {
                this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
            });
        };
    });
}; 