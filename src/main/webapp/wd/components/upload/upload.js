/**
 * 
 * @param config.path 上传控件所在的路径
 * @param config.url 上传到的url
 * @param config.multi 是否允许多文件上传
 * @param config.num 一次最多可传的文件个数
 * @param config.size 可传文件的最大尺寸字节为单位
 * @param config.fileDesc 出现在上传对话框中的文件类型描述
 * @param config.fileExt 控制可上传文件的扩展名，启用本项时需同时声明fileDesc
 * @param completeFunct 上传结束后的回调函数
 * @param args 随文件上传一起传递到后台的参数采用json格式
 * @return
 */
function bindingUpload(config,completeFunc,args){
	var targetObj = $("#uploadify");
	targetObj.bgLayer = $("<div style=\"filter:Alpha(Opacity=15);opacity:0.15;width:100%;position:absolute;left:0px;top:0px;background-color:#000;z-index:99;\"></div>");
	targetObj.uploadify({
	    "uploader"       : config.path+"/upload/uploadify.swf",
	    "script"         : config.url,
	    "scriptData"     : args,
	    "cancelImg"      : config.path+"/upload/style/cancel.png",
	    "fileDataName"   : "uploads",
	    "queueID"        : "uploadContainer",
	    "auto"           : true,
	    "multi"          : config.multi,
	    "simUploadLimit" : 1,
	    "queueSizeLimit" : config.num,
	    "sizeLimit"      : config.size,
	    "buttonText"     : "",
	    "width"          : 110,
	    "height"         : 30,
	    'fileDesc'       : config.fileDesc,
		'fileExt'        : config.fileExt,
	    "onSelectOnce":(config.selectOnceFunc==undefined?function(){
			$("body").append(targetObj.bgLayer);
			var height = ($(window).height()>=$("body").height()?$(window).height():$("body").height());
			targetObj.bgLayer.height(height);
		}:config.selectOnceFunc),
	    'onComplete': completeFunc,
	    'onAllComplete': config.completeAllFunc,
	    'onError':function(event,queueID,fileObj,errorObj){
			alert(errorObj.info);
		}
	});
	
	return targetObj;
}