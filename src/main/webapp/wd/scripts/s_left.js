$(document).ready(function(){
$("div:has('.h3_before')").find(".gss_box").hide();
//解决布局问题
    $("a:first").css("margin-top","0")
//改变包含（.link_after）的ul和H3
    $(".link_after").parent().prev().removeClass().addClass("h3_after");
    $(".link_after").parent().show();
//li点击样式
    $("li").click(function(){
	   $("ul").find("li").removeClass().addClass("link_before");
	   $(this).removeClass().addClass("link_after");
	   $("ul").not($(this).parent()).slideUp();
	   //$(".link_after").parent().show();
	   $("h3").removeClass().addClass("h3_before");
	   $(".link_after").parent().prev().removeClass().addClass("h3_after");
	})
	
    $("h3").click(function(){
	   $("ul").not("ul:has(li.link_after)").not($(this).next()).slideUp(); 
	   var i = $(this).next().not("ul:has(li.link_after)");
	   $("h3").removeClass().addClass("h3_before");
	   $(this).removeClass().addClass("h3_after");
	   if(i.is(":visible")){
	    i.slideUp()
	    $("h3").removeClass().addClass("h3_before");
        }else{
	    i.slideDown()
	   }
	   $(".link_after").parent().prev().removeClass().addClass("h3_after");
	});
 });