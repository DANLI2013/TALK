function SheepUtil() {
}

SheepUtil.separator1 = String.fromCharCode(17);
SheepUtil.separator2 = String.fromCharCode(18);
SheepUtil.separator3 = String.fromCharCode(19);
SheepUtil.separator4 = String.fromCharCode(20);
SheepUtil.separator5 = String.fromCharCode(21);

/**
 * js获取锚点
 * @param uri
 * @return
 */
SheepUtil.getAnchorFromURI = function getAnchorFromURI(uri){
	  return uri.slice(uri.lastIndexOf('#')+1);
	}

/**
 * 读cookie
 */
SheepUtil.readCookie = function(name) {
	var cookieValue = "";
	var search = name + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1) {
				end = document.cookie.length;
			}
			cookieValue = unescape(document.cookie.substring(offset, end));
		}
	}
	return cookieValue;
}

/**
 * 写cookie
 */
SheepUtil.writeCookie = function(name, value, hours) {
	var expire = "";
	if (hours != null) {
		expire = new Date((new Date()).getTime() + hours * 3600000);
		expire = "; expires=" + expire.toGMTString();
	}
	document.cookie = name + "=" + escape(value) + expire;
}

/**
 * 要求用户确认
 */
SheepUtil.confirm = function() {
	if (confirm("本操作无法恢复，您确认要继续么？"))
		;
	else
		return false;
}

/**
 * 返回上页
 */
SheepUtil.back = function() {
	history.go(-1);
}

/**
 * 用来遍历指定对象所有的属性名称和值
 * 
 * @param obj
 *            需要遍历的对象
 * @return 所有属性值组成的数组
 */
function getAllPrpos(obj) {
	// 用来保存所有的值
	var props = [];
	// 开始遍历
	for ( var p in obj) {
		// 方法
		if (typeof (obj[p]) == "function") {
			continue;
		} else {
			props.push(obj[p]);
		}
	}
	return props;
}

/**
 * 把跳转到指定的url转化为form提交的方式
 */
SheepUtil.submitUrl = function(formId, url) {
	$("#" + formId).attr("action", url).submit();
}

/**
 * 创建flash元素
 * @param id 指定所生成元素的ID
 * @param swfUrl swf文件的路径
 * @param varStr 变量字符串
 * @param width 宽度
 * @param height 高度
 * @return
 */
SheepUtil.createFlash = function(id,swfUrl,varStr,width,height){
	document.write("<object id=\""+id+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0\" width=\""+width+"\" height=\""+height+"\">"
			+ "<param name=\"flashvars\" value=\""+varStr+"\">"
			+ "<param name=\"allowScriptAccess\" value=\"always\" />"
			+ "<param name=\"movie\" value=\""+swfUrl+"\">"
			+ "<param name=\"quality\" value=\"high\">"
			+ "<param name=\"wmode\" value=\"transparent\"/>"
			+ "<embed src=\""+swfUrl+"\" name=\""+id+"\" quality=\"high\" wmode=\"transparent\" allowScriptAccess=\"always\" swLiveConnect=\"true\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" flashvars=\""+varStr+"\" width=\""+width+"\" height=\""+height+"\"></embed>"
			+ "</object>");
}

/**
 * 创建flashHTML字符串
 * @param id 指定所生成元素的ID
 * @param swfUrl swf文件的路径
 * @param varStr 变量字符串
 * @param width 宽度
 * @param height 高度
 * @return
 */
SheepUtil.createFlashStr = function(id,swfUrl,varStr,width,height){
	return "<object id=\""+id+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0\" width=\""+width+"\" height=\""+height+"\">"
			+ "<param name=\"flashvars\" value=\""+varStr+"\">"
			+ "<param name=\"allowScriptAccess\" value=\"always\" />"
			+ "<param name=\"movie\" value=\""+swfUrl+"\">"
			+ "<param name=\"quality\" value=\"high\">"
			+ "<embed src=\""+swfUrl+"\" name=\""+id+"\" quality=\"high\" allowScriptAccess=\"always\" swLiveConnect=\"true\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" flashvars=\""+varStr+"\" width=\""+width+"\" height=\""+height+"\"></embed>"
			+ "</object>";
}

function SheepDate() {
	this.date = new Date();
	this.dayname = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
}

SheepDate.prototype.getYear = function() {
	document.write(this.date.getFullYear());
}

SheepDate.prototype.getMonth = function() {
	document.write(this.date.getMonth() + 1, "月");
}

SheepDate.prototype.getDate = function() {
	document.write(this.date.getDate());
}

SheepDate.prototype.getWeek = function() {
	document.write("", this.dayname[this.date.getDay()]);
}

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.ltrim = function() {
	return this.replace(/(^\s*)/g, "");
}

String.prototype.rtrim = function() {
	return this.replace(/(\s*$)/g, "");
}

/**
 * 附加了日期格式化功能
 */
Date.prototype.format = function(format){ 
  var o = { 
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(),    //day 
    "h+" : this.getHours(),   //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter 
    "S" : this.getMilliseconds() //millisecond 
  } 
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1, 
    (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o)if(new RegExp("("+ k +")").test(format)) 
    format = format.replace(RegExp.$1, 
      RegExp.$1.length==1 ? o[k] : 
        ("00"+ o[k]).substr((""+ o[k]).length)); 
  return format; 
};

//alert(new Date().format("yyyy-MM-dd")); 
//alert(new Date("january 12 2008 11:12:30").format("yyyy-MM-dd hh:mm:ss")); 

/**
 * 继承
 * @param baseClass
 * @return
 */
Function.prototype.inherit=function(baseClass){
    for(var p in baseClass.prototype){
           this.prototype[p]=baseClass.prototype[p];
    }
}

/**
 * 闪烁页面标题
 * @param newTitle
 * @return
 */
SheepUtil.blinkTitle = function(newTitle){
	SheepUtil.clearBlinkTitle();
	var step=0, _title = document.title;  
    var timer = setInterval(function() {  
        step++;  
        if (step==3) {step=1};  
        if (step==1) {document.title='【　　　】'+_title};  
        if (step==2) {document.title="【"+newTitle+"】"+_title};  
    }, 500); 
    SheepUtil.blinkTitleTimerObj = [timer, _title];
}

/**
 * 取消标题闪烁
 * @return
 */
SheepUtil.clearBlinkTitle = function(){
	if(SheepUtil.blinkTitleTimerObj) {  
        clearInterval(SheepUtil.blinkTitleTimerObj[0]);   
        document.title = SheepUtil.blinkTitleTimerObj[1];  
    }
}

jQuery(function() {
	// 消除点击后的虚线
	jQuery("a").focus(function() {
		jQuery(this).blur();
	})
});