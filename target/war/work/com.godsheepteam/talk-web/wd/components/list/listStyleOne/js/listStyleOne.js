function Table(sign){
	this.table = $("#xfy_table");
	this.sign = "/"+sign+"/list.htm";
	this.addListener();
	this.initStyle();
}

Table.prototype.initStyle = function(){
	/*表格底部线条设置*/
	this.table.find("tr:last").find("td").css("borderBottomWidth","0px");
	this.table.find("tr").find("td:first").css("borderLeftWidth","0px");
	/* 表格 隔行变色 */
	this.table.find("tr:even").css("background-color", "#f2f2f2");
	
	//根据cookie确定查询列是否显示
	var dt = $("#form_box").find("dt");
	var dd = dt.next();
	
	if (SheepUtil.readCookie(this.sign) == "open") {
		dt.removeClass().addClass("dt_after");
		dd.show();
	} else {
		dt.removeClass().addClass("dt_before");
		dd.hide();
	}
}

Table.prototype.addListener = function(){
	var table = this;
	
	$("#form_box").find("dt").click(function() {
		var ocimg = $(this)
		var ocbutton = $(this).next();
		if (ocbutton.is(':visible')) {
			ocimg.removeClass().addClass("dt_before");
			SheepUtil.writeCookie(table.sign, "close", 24);
			ocbutton.slideUp();
		} else {
			ocimg.removeClass().addClass("dt_after")
			SheepUtil.writeCookie(table.sign, "open", 24);
			ocbutton.slideDown();
		}
	});
	
	/* 表格 鼠标经过变色 */
	table.table.find("tr").mouseover(function() {
		$(this).removeClass().addClass("tr_after");
	}).mouseout(function() {
		$(this).removeClass();
	});
	
	/* 重置时清除 text 样式 */
	$(":reset").click(function() {
		$(":text").removeClass().addClass("xfy_text_before");
		});
	/* button 样式 */
	$(".xfy_button_before").mouseover(function(){
	$(this).removeClass().addClass("xfy_button_after");
	}).mouseout(function(){
	$(this).removeClass().addClass("xfy_button_before");
	})
}