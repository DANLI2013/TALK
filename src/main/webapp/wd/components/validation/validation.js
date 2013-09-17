/**
 * 验证的结果
 * 
 * @return
 */
function ValidateResult() {
	this.isPass = true;
	this.message = "";
}

/**
 * 验证规则对象，有一系列验证方法
 * 
 * 约定：所有的参数之间必须以'-'相连，不同的验证类型必须用'|'相隔
 * 
 * @return
 */
function ValidateRegulation() {}

/**
 * 把属于某种验证方式的验证参数从字符串转换为数组,包含的验证类型会被移除，仅仅剩下参数数组
 */
ValidateRegulation.convertArgsToArray = function(validateTypeStr) {
	var validateArgsArray=validateTypeStr.split("-");
	return validateTypeStr.split("-").slice(1);
}

/**
 * 必须性验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.required = function(value) {
	if(Object.prototype.toString.apply(value) === '[object Array]'){
		var validateResult = new ValidateResult();
		validateResult.isPass = !((value == null) || (value.length == 0));
		validateResult.message = "您必须选择一个值.";
		return validateResult;
	}else{
		value = $.trim(value);
		var validateResult = new ValidateResult();
		validateResult.isPass = !((value == null) || ($.trim(value).length == 0));
		validateResult.message = "您还未输入值呢.";
		return validateResult;
	}
}

/**
 * 最小长度验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.minLength = function(value, validateTypeStr) {
	value = $.trim(value);
	var validateResult = new ValidateResult();
	var args = ValidateRegulation.convertArgsToArray(validateTypeStr);
	validateResult.isPass = !(value.length < parseInt(args[0]));
	validateResult.message = "输入长度必须大于" + args[0] + "当前长度为" + value.length;
	return validateResult;
}

/**
 * 最大长度验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.maxLength = function(value, validateTypeStr) {
	value = $.trim(value);
	var validateResult = new ValidateResult();
	var args = ValidateRegulation.convertArgsToArray(validateTypeStr);
	validateResult.isPass = !(value.length > parseInt(args[0]));
	validateResult.message = "输入长度必须小于" + args[0] + "当前长度为" + value.length;
	return validateResult;
}

/**
 * 长度范围内验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.lengthRange = function(value, validateTypeStr) {
	value = $.trim(value);
	var validateResult = new ValidateResult();
	var args = ValidateRegulation.convertArgsToArray(validateTypeStr);
	validateResult.isPass = (value.length >= parseInt(args[0]) && value.length <= parseInt(args[1]));
	validateResult.message = "输入长度必须在" + args[0] + "与" + args[1] + "之间,当前长度为"
			+ value.length;
	return validateResult;
}

/**
 * 数字验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.beDigits = function(value) {
	value = $.trim(value);
	var validateResult = new ValidateResult();
	validateResult.isPass = (!isNaN(value) && !/^\s+$/.test(value));
	validateResult.message = "只接受数字哦";
	return validateResult;
}

/**
 * 两输入控件值对比验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.equals = function(value, validateTypeStr) {
	value = $.trim(value);
	var validateResult = new ValidateResult();
	var args = ValidateRegulation.convertArgsToArray(validateTypeStr);
	validateResult.isPass = (value == $("#" + args[0]).val());
	validateResult.message = "两次输入不一致，请检查";
	return validateResult;
}

/**
 * 电话号码验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.phone = function(value) {
	value = $.trim(value);
	var validateResult = new ValidateResult();
	validateResult.isPass = (value == "" || /^((0[1-9]{3,4})?(0[12][0-9])?[-])?\d{6,8}$/
			.test(value));
	validateResult.message = "电话号码格式必须正确,如‘010-29392929’";
	return validateResult;
}

/**
 * 手机号码验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.mobilePhone = function(value) {
	value = $.trim(value);
	var validateResult = new ValidateResult();
	validateResult.isPass = (value == "" || /(^0?[1][358][0-9]{9}$)/
			.test(value));
	validateResult.message = "手机号码格式必须正确";
	return validateResult;
}

/**
 * email验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.email = function(value) {
	value = $.trim(value);
	var validateResult = new ValidateResult();
	validateResult.isPass = (value == "" || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/
			.test(value));
	validateResult.message = "email格式必须正确";
	return validateResult;
}

/**
 * ip验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.ip = function(value) {
	value = $.trim(value);
	var validateResult = new ValidateResult();
	validateResult.isPass = (value == "" || /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
			.test(value));
	validateResult.message = "ip格式必须正确";
	return validateResult;
}

/**
 * 文件验证，返回验证结果，是ValidateRegulation类的静态方法
 */
ValidateRegulation.file = function(value, validateTypeStr) {
	var args = ValidateRegulation.convertArgsToArray(validateTypeStr);
	var pass = false;
	var allowedType = "";
	$(args).each( function(i, arg) {
		if (new RegExp('\\.' + arg + '$', 'i').test(value)) {
			pass = true;
			return false;
		}
		allowedType = allowedType + arg + ",";
	});
	
	if(value=="")
	pass=true;

	var validateResult = new ValidateResult();
	validateResult.isPass = pass;
	validateResult.message = "只接受以下文件类型：" + allowedType;
	return validateResult;
}

/**
 * 根据方法名获得相应验证方法，自定义验证方法也支持
 */
ValidateRegulation.getFunc = function(methodName) {
	if (typeof (ValidateRegulation[methodName]) == "function") {
		return ValidateRegulation[methodName];
	} else if (typeof (window[methodName]) == "function") {
		return window[methodName];
	} else {
		alert("暂不支持此种验证！");
		return;
	}
}

/**
 * 将某元素上的验证方式字符串转化为数组
 */
Validator.getValidateTypeArray = function(validateTypeStr) {
	return validateTypeStr.split("|");
}

/**
 * 对错误信息进行显示
 * 
 * 约定：用到如下css命名：err、err_text、err_close
 */
Validator.showError=function(j_element,message){
	var errId=j_element.attr("id")+"_err";
	var errDiv;
	if($("#"+errId).size()<=0){
		errDiv=$("<div id=\""+errId+"\"class=\"err\"><span class=\"err_text\">"+message+"</span><a class=\"err_close\" href=\"javascript:;\"></a></div>");
		$("body").append(errDiv);
	}else{
		errDiv=$("#"+errId);
		errDiv.find(".err_text").html(message);
	}
	
	var l=j_element.offset().left;
	var t=j_element.offset().top;
	errDiv.css({'top':t-38,'left':l-1});
	errDiv.show();
}


/**
 * 验证执行者
 * 
 * 约定：按钮中如果有‘submit=true’的属性，则该按钮为某区域的提交按钮
 * 约定：当该元素所属区域的‘update’属性为‘true’时，不忽略默认值，否则把默认值看做是空字符串
 * 
 * @return
 */
function Validator(area){
	this.area = null;
	if( typeof area == "string"){
		this.area=$("#"+area);
	}else{
		this.area = area;
	}
	this.j_elements=this.area.find("[validateType]");
	this.submitButton=this.area.find("[submit='true']");//触发提交动作的按钮
	
	this.init();
	this.addListener();
}

/**
 * 对单个元素进行验证,显示验证错误
 */
Validator.prototype.validateField = function(element) {
	//全局验证，检查是否能启用提交按钮
	this.traversalCheck();
	
	var j_element = $(element);
	var result = this.validate(j_element);
	if(!result.isPass){
		j_element.addClass("input_err");
		//显示错误信息
		Validator.showError(j_element,result.message);
	}else{
		j_element.removeClass("input_err");
		$("#"+j_element.attr("id")+"_err").hide();
	}
}

/**
 * 对单个元素进行验证,仅仅获得验证结果，并不显示错误
 */
Validator.prototype.validateField4Pass = function(element) {
	var j_element = $(element);
	var result = this.validate(j_element);
	//如果通过校验，则关闭错误提示
	if(result.isPass){
		j_element.removeClass("input_err");
		$("#"+j_element.attr("id")+"_err").hide();
	}
	return result.isPass;
}

/**
 * 验证全局 确定是否开启提交按钮
 * @return
 */
Validator.prototype.traversalCheck = function(){
	    var isPass=true;
	    var validator = this;
		this.j_elements.each(function(i,element){
			//如果有一个元素未通过，则不再验证余下元素
			if(!isPass){
				return false;
			}
			isPass=validator.validateField4Pass(element);
		});
		if(isPass){
			this.submitButton.attr("disabled",false);
		}else{
			this.submitButton.attr("disabled",true);
		}
}

/**
 * 为元素统一添加事件监听
 * @return
 */
Validator.prototype.addListener = function(){
	var validator = this;
	
	this.j_elements.each(function(i,element){
		var j_element = $(element);
		var method = j_element.attr("method");
		var keyupabled = j_element.attr("keyup");
		
		//所有情况都需要添加blur事件验证
		j_element.bind("blur",function(event){
			validator.validateField(event.target);
		});
		
		//判断当前元素是否添加keyUp验证
		if(keyupabled==undefined||keyupabled=="true"){
			j_element.bind("keyup",function(event){
				//处理提交按钮是否可点击，验证所有需验证的元素，全部通过则开放提交按钮
				if(event.shiftKey||event.ctrlKey||event.altKey)
				return;
				validator.traversalCheck();
			});
		}
		
		//为控件绑定自定义事件验证
		if(method!=undefined){
			var methodArray = method.split("|");
			$(methodArray).each(function(i,methodName){
				$(element).bind(methodName,function(event){
					validator.validateField(element);
				});
			});
		}
	});
	
	$(".err_close").live("click",function(event){
		$(event.target).parent().hide();
	});
	
	this.submitButton.click(function(){
		var button=$(this);
		setTimeout(function(){
			validator.submitButton.attr("disabled",true);
			},100);
	});
}

/**
 * 初始化验证器
 * @return
 */
Validator.prototype.init = function(){
	var validator = this;
	//为所有的元素打上标记
	this.j_elements.each(function(i,element){
		validator.markElem($(element));
	});
	//执行一次全局验证
	this.traversalCheck();
}

/**
 * 处理元素默认值（如更新，或者是提醒用户该如何填写，都会给元素默认值）
 */
Validator.prototype.dealWithValue = function(j_element) {
//	if (j_element.val() == j_element.attr("defaultValue")
//			&& this.area.attr("update") != "true" && j_element.attr("update")!="true") {
//		return "";
//	} else {
//		return j_element.val();
//	}
	return j_element.val();
}

/**
 * 验证一个元素是否能通过所有验证规则
 * @param j_element
 * @return
 */
Validator.prototype.validate = function(j_element){
	var result;
	
	//处理元素值
	var elementValue=this.dealWithValue(j_element);
	var validateTypeArray = Validator.getValidateTypeArray(j_element.attr("validateType"));
	$(validateTypeArray).each(function(i,validateTypeStr){
		//获得除去参数的验证类型
		var validateType=validateTypeStr.split("-")[0];
		//拿到代表该验证类型的验证函数对象
		var validateFunc=ValidateRegulation.getFunc(validateType);
		//获得验证结果
		result=validateFunc(elementValue,validateTypeStr);
		if(!result.isPass){
			//跳出循环，不继续验证余下规则
			return false;
		}
	});
	
	return result;
}

/**
 * 标记一个元素（必填标识等等）
 */
Validator.prototype.markElem = function(j_element){
	
	var validateTypeArray = Validator.getValidateTypeArray(j_element.attr("validateType"));
	var required = false;
	$(validateTypeArray).each(function(j,type){
		if(type.indexOf("required")!=-1){
			j_element.addClass("required");
		}else if(type.indexOf("minLength")!=-1&&ValidateRegulation.convertArgsToArray(type)[0]>=1){
			j_element.addClass("required");
		}else if(type.indexOf("lengthRange")!=-1&&ValidateRegulation.convertArgsToArray(type)[0]>=1){
			j_element.addClass("required");
		}
	});
}
