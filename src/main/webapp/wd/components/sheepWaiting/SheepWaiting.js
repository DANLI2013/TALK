/**
 * 绑定等待加载事件
 * @return
 */
function sheepWaiting() {
	$(window).scroll(function () {
		$("#sheep_loading").css("top", $(document).scrollTop());
	});
	$("[linkOut=true]").click(function () {
		$("#sheep_loading").css("display", "block");
	});
	$("#sheep_loading").fadeOut("slow");
}
$(function(){
	$("body").prepend("<img id=\"sheep_loading\" src=\""+baseUrl+"/wd/components/sheepWaiting/img/sheep_loading.gif\"/>");
	$("#sheep_loading").bind("load",function(){
		setTimeout(sheepWaiting,300);
	});
});