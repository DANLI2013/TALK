function Dithering (obj,Rate,speed) {
	 var oL=obj.offsetLeft;
	 var oT=obj.offsetTop;
	 this.stop=null;
	 this.oTime=null;
	 var om=this;
	 this.start=function(){
			 if(parseInt(obj.style.left)==oL-1){
				obj.style.top=oT+1+"px";
				setTimeout(function(){obj.style.left=oL+1+"px"},Rate)
			 }
			 else{
				obj.style.top=oT-1+"px";
				setTimeout(function(){obj.style.left=oL-1+"px"},Rate)
			}
		this.oTime=setTimeout(function(){om.start()},speed);
	 }
	 this.stop=function(){
	   clearTimeout(this.oTime);
	 }
}

$(function(){
$("#top_nav > li").click(function(event){
$("#top_nav > li").not(this).removeClass().addClass("nav_other");
this.className="nav_this";
});
});