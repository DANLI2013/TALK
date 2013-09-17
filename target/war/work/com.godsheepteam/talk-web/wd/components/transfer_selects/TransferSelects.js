
/**
 * 允许选项迁移的Select
 * @param name 用于提交的控件名称
 * @param srcOptions 填充源选择框的数组
 * @param TargetOptions 填充目标选择框的数组
 * @return
 */
function TransferSelects(targetSelectId,srcOptions){
	this.sourceSelect = $("<select multiple=\"multiple\" class=\"formStyleOne_selectM\"></select>");//源选择框
	this.targetSelect = $("#"+targetSelectId);//目标选择框
	this.buttonBox = $("<span class=\"select_button_box\"></span>");// 选择按钮容器
	this.toTargetButton = $("<span id=\"select_right_before\" class=\"select_left_before\"></span>");//向目标选择框迁移按钮
	this.toSourceButton = $("<span id=\"select_left_before\" class=\"select_right_before\"></span>");//向源选择框迁移按钮
	this.srcOptions = srcOptions;
	
	this.init();
}

/**
 * 根据所给数据初始化UI
 * @return
 */
TransferSelects.prototype.init = function(){
	var transferSelect = this;
	
	//填充源选择框
	$(this.srcOptions).each(function(i,option){
		//当目标选择框中没有本选项时，才把他加入源选择框以供选择
		if(!TransferSelects.isExistInOther(option[0],transferSelect.targetSelect)){
			transferSelect.sourceSelect.append("<option value=\""+option[0]+"\">"+option[1]+"</option>")
		}
	});
	
	this.buttonBox.append(this.toTargetButton);
	this.buttonBox.append(this.toSourceButton);
	this.targetSelect.before(this.buttonBox);
	this.buttonBox.before(this.sourceSelect);
	
	this.addListener();
}

/**
 * 添加事件监听
 * @return
 */
TransferSelects.prototype.addListener = function(){
	var transferSelect = this;
	
	this.toTargetButton.bind("click",function(event){
		TransferSelects.transfer(transferSelect.sourceSelect,transferSelect.targetSelect);
		transferSelect.targetSelect.trigger("transfer");
	});
	
	this.toSourceButton.bind("click",function(event){
		TransferSelects.transfer(transferSelect.targetSelect,transferSelect.sourceSelect);
		transferSelect.targetSelect.trigger("transfer");
	});
}

/**
 * 将一个选择框中的选项移到另一个选择框中
 * @param srcSelect 源选择框 JQUERY
 * @param tarSelect 目标选择框 JQUERY
 * @return
 */
TransferSelects.transfer = function(srcSelect,targetSelect){
	srcSelect.find("option:selected").each(function (i, sourceOption) {
		var exist = TransferSelects.isExistInOther(sourceOption.value,targetSelect);
		if(exist){
			$(sourceOption).remove();
		}else{
			targetSelect.prepend(sourceOption);
		}
	});
}

/**
 * 判断某个值是否存在于指定的Select控件中
 * @param value 需要验证的值
 * @param select 被jquery包装过的Select控件
 * @return
 */
TransferSelects.isExistInOther = function(value,select){
	var exist = false;
	select.find("option").each(function(i,option){
		if(option.value == value){
			exist = true;
			return false;
		}
	});
	
	return exist;
}