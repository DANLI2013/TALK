// JavaScript Document


$(function(){
    showLayer.windowWidth=$(window).width();
    showLayer.windowHeight=$(window).height();
	showLayer.bodyHeight=$("body").height();
	showLayer.layerBg=$(".layerBg");
	
	//初始化
	//showLayer.layerBg.height(showLayer.bodyHeight);
	//绑定弹出层方法  （用layer属性 传入被弹出层id）
	$(".layerOpen").click(function(){
	var id=$("#"+$(this).attr("layer"));
	showLayer(id);
	})
	//绑定关闭层方法
	$(".closeLayer").click(function(){
	closeLayer();
	})
	
})


/**
 * 弹出层 方法
 * 
 * @param id
 * @return
 */
    showLayer.windowWidth;
    showLayer.windowHeight;
	showLayer.bodyHeight;
	showLayer.layerBg;
    function showLayer(id) {
	var now = id
	var now_w = now.width();
	var now_h = now.height();
	now.css( {
		"left" : (showLayer.windowWidth - now_w) / 2,
		"top" : (showLayer.windowHeight - now_h) / 2
	});
	now.show();
	showLayer.layerBg.show();
    }
	
	function closeLayer(){
	$(".layerStyle_one").hide();
	showLayer.layerBg.hide();
	}