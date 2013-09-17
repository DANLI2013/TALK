
/**
 * 自定义编辑器
 * @param cfg
 * cfg.id:指定编辑器所依存的textareaID
 * cfg.width:控件宽
 * cfg.rows:行数
 * cfg.baseUrl:当前页面的地址
 * cfg.uploadUrl:上传图片的处理地址
 * cfg.mode 1:编辑器联动版本 2：不联动编辑器版本
 * @return
 */
function SheepEditor(cfg){
	this.cfg = cfg;
	//总容器
	this.totalContainer = $("<div class=\"editBox\" style=\"width:"+cfg.width+"px;\"></div>");
	//上传文件的按钮容器
	this.uploadBtnContainer = $("<div class=\"editBox_tool\"><span class=\"gray\">上传图片</span>&nbsp;&nbsp;<input id=\"uploadify\" name=\"uploads\" type=\"file\" /></div>");
	//输入框
	this.textarea = $("#"+cfg.id);
	//进度条容器
	this.uploadContainer = $("<div id=\"uploadContainer\" class=\"flash_upDiv\"></div>");
	//图片容器
	this.imgContainer = $("<div class=\"editBox_upBox\"></div>")
	
	this.initHtmlStructure();
	this.initUpload();
	this.addListener();
}

/**
 * 初始化HTML结构
 * @return
 */
SheepEditor.prototype.initHtmlStructure = function(){
	this.textarea.addClass("editTextarea");
	this.textarea.attr("rows",this.cfg.rows)
	this.textarea.wrap(this.totalContainer);
	this.textarea.after(this.uploadBtnContainer);
	this.textarea.after().after(this.uploadContainer);
	this.textarea.after().after().after(this.imgContainer);
}

/**
 * 初始化上传控件
 * @return
 */
SheepEditor.prototype.initUpload = function(){
	var editor = this;
	var uploadCfg = {
			"path" : editor.cfg.baseUrl+"/wd/components",
			"url" : editor.cfg.uploadUrl,
			"multi" : editor.cfg.mode==2?false:true,
			"num" : 5,
			"auto": true,
			"size" : 40000000,
			"fileDesc" : "图片文件",
			"fileExt" : "*.jpg;*.jpeg"
	};
	
	uploadCfg.selectOnceFunc = function(){}
	
	//处理上传结果
	bindingUpload(uploadCfg,function(event,queueID,fileObj,response,data) {
	    if(response=="error"){
	        alert("文件上传失败，请重试！")
	        }else{
	        	//处理文件中的反斜杠
	        	response = response.replace(/\\/g,"/")
	        	editor.addImg(eval('('+response+')'));
	        }
	    });
}

/**
 * 添加一个图片
 * @return
 */
SheepEditor.prototype.addImg = function(imgObj){
	var imgInfo = imgObj.id+SheepUtil.separator1+imgObj.showPath+SheepUtil.separator1+imgObj.realPath;
	var imgStr = "<div class=\"editBox_imgBox\"><span class=\"editBox_img\"><img src=\""+this.cfg.baseUrl+"/"+imgObj.smallShowPath+"\" /></span>"
				 +"<input type=\"text\" class=\"editBox_imgName\" value=\"<图片"+imgObj.id+">\"/>"
				 +"<input name=\"imgInfos\" type=\"hidden\" value=\""+imgInfo+"\"/>"
				 +"<a sign=\"<图片"+imgObj.id+">\" href=\"javascript:;\" class=\"editBox_imgRemove\">删除</a>"
				 +"</div>";
	var imgElem = $(imgStr);
	this.imgContainer.append(imgElem);
	if(this.cfg.mode!=2){
		if(this.textarea.val().indexOf("<图片"+imgObj.id+">")==-1){
			SheepEditor.insertImg(this.textarea.get(0),"<图片"+imgObj.id+">");
		}
	}
}

/**
 * 添加事件
 * @return
 */
SheepEditor.prototype.addListener = function(){
	var editor = this;
	$(".editBox_imgRemove").live("click",function(event){
		$(this).parent().remove();
		var sign = $(this).attr("sign");
		var value = editor.textarea.val();
		editor.textarea.val(value.replace(new RegExp(sign, "g"),""));
	});
	
	this.textarea.bind("keyup",function(event){
		SheepEditor.resizeTextarea(this,editor.cfg.rows);
	});
	
	$(".editBox_imgName").bind("focus",function(){
		
	});
}

/**
 * 根据输入扩展输入框
 * @param textarea
 * @param row
 * @return
 */
SheepEditor.resizeTextarea = function(textarea,row){
	var agt = navigator.userAgent.toLowerCase();
	var is_op = (agt.indexOf("opera") != -1);
	var is_ie = (agt.indexOf("msie") != -1) && document.all && !is_op;
    if(!textarea){return}
    if(!row)row=5;
    var rowNum=textarea.value.split("\n");
    var nowRowNum=is_ie?1:0;
    nowRowNum+=rowNum.length;
    var colNum=textarea.cols;
    if(colNum<=20){colNum=40}
    for(var e=0;e<rowNum.length;e++){
        if(rowNum[e].length>=colNum){
        	nowRowNum+=Math.ceil(rowNum[e].length/colNum)
        }
    }
    nowRowNum=Math.max(nowRowNum,row);
    if(nowRowNum!=textarea.rows){
		if(nowRowNum>20){nowRowNum=20}
        textarea.rows=nowRowNum;
    }
}

/**
 * 插入图片
 * @param textarea
 * @param str
 * @return
 */
SheepEditor.insertImg = function(textarea,str) {
	if (document.selection) {
		textarea.focus();
		var sel = document.selection.createRange();
		document.selection.empty();
		sel.text = str;
	} else {
		var prefix, main, suffix;
		prefix = textarea.value.substring(0, textarea.selectionStart);
		main = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
		suffix = textarea.value.substring(textarea.selectionEnd);
		textarea.value = prefix + str + suffix;
	}
	textarea.focus();
}

function strToJson(str){  
    var json = (new Function("return " + str))();  
    return json;  
}
