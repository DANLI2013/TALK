/**
 * 弹出层
 * @param config 配置对象
 * @param config.width 弹出层宽度
 * @param config.height 弹出层高度
 * @param config.title 弹出层标题
 * @param config.targetId 弹出层内容元素ID
 * @param config.tigger 触发弹出层元素
 * @return
 */
function Popup(config){
	this.window_height;
	this.window_width;
	this.body_height;
	this.bodyScroll;//顶部滚动距离
	/**背景层**/
	this.bgLayer = $("<div class=\"layerBg\"></div>");
	/**中间层**/
	this.centerLayer = $("<div class=\"layerStyle_one\" style=\"width:"+config.width+"px;height:"+config.height+"px;\"></div>");
	/**中间背景层**/
	this.centerBgLayer = $("<div class=\"lsOne_bg\" style=\"width:"+config.width+"px;height:"+config.height+"px;\"></div>")
	/**主体容器**/
	this.mainContainer = $("<div class=\"lsOne_main\" style=\"width:"+config.width+"px;height:"+config.height+"px;\"></div>");
	/**头部**/
	this.header = $("<h3 class=\"lsOne_h3\">"+config.title
		+ "<a href=\"javascript:;\" class=\"lsOne_close closeLayer\">关闭</a>"
		+ "</h3>");
	/**需要弹出支持的元素**/
	this.target = $("#"+config.targetId);
	/**出发弹出层的元素**/
	this.tigger = config.tigger;
	//执行初始化动作
	this.init();
}

Popup.prototype.init = function(){
	$("body").append(this.bgLayer);
	$("body").append(this.centerLayer);
	this.centerLayer.append(this.centerBgLayer);
	this.centerLayer.append(this.mainContainer);
	this.mainContainer.append(this.header);
	this.mainContainer.append(this.target);
	this.addListener();
}
Popup.prototype.addListener = function(){
	var popup = this;
	this.tigger.bind("click",function(event){
		popup.layerShow();
	});
	//绑定关闭事件
	this.header.find(".closeLayer").bind("click",function(event){
		popup.layerHide();
	});
}
/**
 * 切换层的可见状态
 */
Popup.prototype.layerShow = function(){
	this.window_height=$(window).height();
	this.window_width=$(window).width();
	this.body_height=$("body").height();
	this.bodyScroll=$(window).scrollTop();
	/* 对背景层和弹出层定位 */
	this.centerLayer.css({
		"left" : (this.window_width - this.centerLayer.width()) / 2,
		"top" : (this.window_height - this.centerLayer.height()) / 2+this.bodyScroll
	});
	if(this.body_height > this.window_height){
		this.bgLayer.css("height",this.body_height);
	}else{
		this.bgLayer.css("height",this.window_height);
	}
	/*显示背景层和弹出层 */
	this.centerLayer.show();
	this.bgLayer.show();
	this.target.show();
}

Popup.prototype.layerHide = function(){
	this.centerLayer.hide();
	this.bgLayer.hide();
}