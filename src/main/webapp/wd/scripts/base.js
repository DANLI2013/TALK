/*
*创建浮动层
*/
function createFloatFloor(id) {

    var w_w = $("body").width();
	var w_h = $("body").height();
	var centerFloor = $("#" + id);
	var backgroundFloor = $("#backgroundFloor");
//透明层
	backgroundFloor.css({"opacity":"0.7", "height":w_h}).hide();
	var contentTd = centerFloor.find("td.xfy_content");
	var i = contentTd.width();
	if (i < 360) {
		contentTd.css("width", "360px");
	}

//居中透明层
	var x_w = centerFloor.width();
	var x_h = centerFloor.height();
	var l = (w_w - x_w) / 2;
	var t = (w_h - x_h) / 2;
	if(t<0){
	t=10;
	}
	
	centerFloor.css("left", l);
	centerFloor.css("top", t);
	backgroundFloor.css("height", w_h);
	backgroundFloor.fadeIn(777);
	centerFloor.fadeIn(777);
	centerFloor.find(".xfy_fc002 > a").click(function () {
		backgroundFloor.hide();
		centerFloor.hide();
	}).end().find(":button").click(function () {
		backgroundFloor.fadeOut(555);
		centerFloor.fadeOut(555);
	});
}

/*
*消除ie6bug
*/
function clearBug() {
	/* 无聊的li 和 可恶的IE6 */
	$(".xfy_form > ul > li").css({"display":"block", "float":"left", "clear":"left", "padding-top":"5px", "padding-bottom":"5px"});
}
/*创建表单样式*/
function createFormStyle() {
	$(":text,:password").focus(function () {
		$(this).removeClass().addClass("xfy_text_after");
		/*value 效果*/
	}).blur(function () {
		$(this).removeClass().addClass("xfy_text_before");
		/*value 效果*/
		if ($(this).parents("form").attr("isupdate") != "true") {
			if (this.value == "") {
				this.value = this.defaultValue;
				$(this).css("color", "#777777");
			}
		}
		if (this.value != this.defaultValue) {
			$(this).removeClass().addClass("xfy_text_after");
		}
	});
	$("textarea").click(function () {
		$(this).removeClass().addClass("xfy_textarea_after");
	}).blur(function () {
		$(this).removeClass().addClass("xfy_textarea_before");
	});
	$("fieldset").find("li").mouseover(function () {
		$(this).css("background-color", "#f9f9f9");
	}).mouseout(function () {
		$(this).css("background-color", "#ffffff");
	});
	$(".select_m > option:even").css("background-color", "#f2f2f2");
}
// 绑定等待的小羊
function sheepWaiting() {
	$(window).scroll(function () {
		var i = $(document).scrollTop();
		$("#sheep_loading").css("top", i);
	});
	$("[linkOut=true]").click(function () {
		$("#sheep_loading").css("display", "block");
	});
}

// 设置按钮样式
function buttonStyle() {
	$(".xfy_button_before").mouseover(function () {
		$(this).removeClass().addClass("xfy_button_after");
	}).mouseout(function () {
		$(this).removeClass().addClass("xfy_button_before");
	});
}

// 设置用户个人喜好
function createFavorButton() {
	$("#top_tool").click(function (event) {
		event.stopPropagation();
		var open = document.getElementById("xfy_tool_02");
		var closeArray = document.getElementsByTagName("div");
		var positionArray = getposition(this);
		open.style.display = "block";
		open.style.left = -60 + positionArray[0] + "px";
		open.style.top = 20 + positionArray[1] + "px";
		for (var i = 0; i < closeArray.length; i++) {
			if (closeArray[i].className == "oc_floor") {
				if (closeArray[i].id != floorName) {
					closeArray[i].style.display = "none";
				}
			}
		}
	});
}
$(document).ready(function () {
	clearBrokenLine();
	sheepWaiting();
	createFormStyle();
	clearBug();
	buttonStyle();
	createFavorButton();
	closeByClickWindow();
	$("#sheep_loading").fadeOut("slow");
});

