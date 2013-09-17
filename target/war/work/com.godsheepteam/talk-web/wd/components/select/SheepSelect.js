
/**
 * 我们自定义Select
 * @return
 */
function SheepSelect(center){
	this.spanParent = $("<span class=\"mySelect\"></span>");//创建包裹input的span节点
	this.center = center;//这是input节点，一切都以他为中心
	this.form = this.center.parents("form");//所属的form
	this.optionParent = $("<ul></ul>");//创建下拉选项的父节点
	this.clickPoint = $("<a href=\"javascript:;\"></a>");// 点击下拉的按钮
	// 填充下拉选项的数组（必须为二维）一维为显示值，二维为实际值
	this.optionarray = eval(this.center.attr("optionarray"));
	
	this.init();
	this.addListener();
}

/**
 * 初始化各个元素
 * @return
 */
SheepSelect.prototype.init = function(){
	//将本实例绑定在原生控件上
	this.center.get(0).sheepObj = this;
	this.center.attr("autocomplete","off");
	//把input节点包在span里面
	this.center.wrap(this.spanParent);
	//在input节点后跟点击下拉的按钮
	this.center.after(this.clickPoint);
	//在下拉的按钮后跟下拉选项的父节点(ul)
	this.clickPoint.after(this.optionParent);
	//根据选项数组生成下拉选项
	this.createOptions();
	this.optionParent.hide();
}

/**
 * 根据选项数组生成下拉选项
 * @return
 */
SheepSelect.prototype.createOptions = function(){
	this.optionParent.empty();
	for (var i = 0; i < this.optionarray.length; i++){
		this.optionParent.append($("<li realValue='" + this.optionarray[i][1] + "'>" + this.optionarray[i][0] + "</li>"));
		if(this.center.attr("realValue")==this.optionarray[i][1]){
			this.center.val(this.optionarray[i][0]);
		}
	}
	var sheepSelect = this;
	//为li绑定事件 触发自定义select事件
	this.optionParent.find("li").bind("mouseover", function () {
		$(this).css({"background-color":"#3366cc", "color":"#ffffff"});
	}).bind("mouseout", function () {
		$(this).css({"background-color":"#f5f5f5", "color":"#000000"});
	}).bind("click", function (event) {
		sheepSelect.center.val($(event.target).html()).attr("realValue",$(event.target).attr("realValue")).focus();
		sheepSelect.center.trigger("sheepselect");
	});
}

/**
 * 为各个元素添加监听器
 * @return
 */
SheepSelect.prototype.addListener = function(){
	var sheepSelect = this;
	
	//绑定keyup事件 筛选符合条件的选项
	this.center.bind("keyup",function(event){
		
		if(event.shiftKey||event.ctrlKey||event.altKey){
			return;
		}
		
		var left = sheepSelect.center.offset().left + "px";
		var top = sheepSelect.center.outerHeight() + sheepSelect.center.offset().top + "px";
		var inputWidth = sheepSelect.center.width();
		
		sheepSelect.optionParent.width(inputWidth);
		//限制高为200
		if (sheepSelect.optionParent.height() > 200) {
			sheepSelect.optionParent.css("height", "200px");
		}else{
			sheepSelect.optionParent.css("height", "auto");
		}
		sheepSelect.optionParent.css("left", left);
		sheepSelect.optionParent.css("top", top);
		sheepSelect.optionParent.show();
		
		//隐藏不匹配的li
		sheepSelect.optionParent.find("li").each(function (i, liNode) {
			if ($(liNode).html().indexOf(sheepSelect.center.val()) != -1) {
				$(liNode).show();
				//当用户输入与某个选项完全吻合时，写入真实值
				if($(liNode).html()==$(event.target).val()){
					$(event.target).attr("realValue",$(liNode).attr("realValue"));
				}
			} else {
				$(liNode).hide();
			}
		});
		//绑定焦点离开事件 当用户填入的值不存在时，强制清空,如已存在，触发自定义select事件
	}).blur(function (event) {
		var isFound = false;
		sheepSelect.optionParent.find("li").each(function (i, liNode) {
			if ($(liNode).html() == $(event.target).val()) {
				isFound = true;
			}
		});
		if (!isFound) {
			$(event.target).val("");
			$(event.target).attr("realValue","");
		}else{
			sheepSelect.center.trigger("sheepselect");
		}
	});
	
	//绑定下拉事件
	this.clickPoint.click(function (event) {
		//重新生成下拉选项
		sheepSelect.createOptions();
		
		var ul = sheepSelect.optionParent;
		var left = sheepSelect.center.offset().left + "px";
		var top = sheepSelect.center.outerHeight() + sheepSelect.center.offset().top + "px";
		var inputWidth = sheepSelect.center.width();
		
		sheepSelect.optionParent.toggle();
		sheepSelect.optionParent.css("left", left);
		sheepSelect.optionParent.css("top", top);
		sheepSelect.optionParent.width(inputWidth);
		
		sheepSelect.optionParent.find("li").show();
		//限制高为200
		if (sheepSelect.optionParent.height() > 200) {
			sheepSelect.optionParent.css("height", "200px");
		}
		
	//关闭除了本身之外的其他同类ul
		$("span.mySelect > ul").not(sheepSelect.optionParent).hide();
		event.stopPropagation();
	});
	
	//提交时将真实值赋给文本框
	this.form.submit(function(){
		sheepSelect.center.val(sheepSelect.center.attr("realValue"));
	});
	
	$("body").click(function(event){
		$("span.mySelect > ul").hide();
	});
}

/**
 * 生成全部
 * @return
 */
SheepSelect.createAll = function(){
	$("input[SheepType=select]").each(function(i,inputs){
		new SheepSelect($(inputs));
	});
}