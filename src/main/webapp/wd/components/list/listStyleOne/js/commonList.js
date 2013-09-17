
function CommonList(baseUrl,urlHead){
	this.form = $("#ListForm");
	this.caseHqlInput = $("#caseHql");
	this.conditionInfoInput = $("#conditionInfo");
	this.urlHead=urlHead;
	this.submitButton = $("#xfy_serach");
	this.searchAll = $("#searchAll");
	this.pageSizeSelect = $("[name='pageSize']");
	if(baseUrl!=""&&urlHead!=""){
		this.queryUrl = baseUrl+"/"+urlHead+"/list.htm";
		this.delUrl = baseUrl+"/"+urlHead+"/deleteAll.htm";
	}
	
	this.addListener();
}

/**
 * 删除一列
 * @param url
 * @return
 */
CommonList.deleteColumn = function(url){
	if (confirm("本操作将无法恢复，您确认继续吗？"))
		SheepUtil.submitUrl("ListForm",url);
	else
		return false;
}

/**
 * 排序
 * @param url
 * @return
 */
CommonList.sort = function(url,taxisFieldName){
	$("#taxisFieldName").val(taxisFieldName);
	SheepUtil.submitUrl("ListForm",url);
}

/**
 * 获取查询条件系列表单，拼接HQL
 */
CommonList.prototype.submitQueryForm = function() {
	var inputArray = $("[condition=yes]").get();
		//最终生成的hql
	var hql = "";
	var conditionInfo = "";
	for (var i = 0; i < (inputArray.length); i++) {
		var hqltemp;
		//这是属性名
		var frist = inputArray[i++].value;
		//这是比较符号
		var second = inputArray[i++].value;
		//这是用户输入的查询条件值
		var third = $.trim(inputArray[i].value);
		//如果用户输入了查询条件值则进行HQL拼接
		if (third != null && third != "") {
			conditionInfo = conditionInfo + frist + "|" + second + "|" + third + ";";
		//语句中是否含有'where'
			if (second == "like") {
				hqltemp = " and " + frist + " like" + " '" + "%" + third + "%" + "'";
			} else {
				hqltemp = " and " + frist + " " + second + " '" + third + "'";
			}
			//拼接hql
			hql = hql + hqltemp;
		}
	}
	//alert(hql);//本句用于输出生成的hql便于调试
	if (conditionInfo.length > 0) {
		conditionInfo = conditionInfo.substring(0, conditionInfo.length - 1);
	}
	this.caseHqlInput.val(hql);
	this.conditionInfoInput.val(conditionInfo);
}

/**
 * 将查询值还原回来
 */
CommonList.prototype.revertBack = function(target) {
	if (target != "") {
		var groupArray = target.split(";");
		$(groupArray).each(function (i, groupStr) {
			var valueArray = groupStr.split("|");
			var inputArray = $("[group=" + valueArray[0] + "]");
			$(inputArray).each(function (j, input) {
				$(input).val(valueArray[j]);
			});
		});
	}
}

/**
 * 初始化列表
 * @return
 */
CommonList.prototype.addListener = function(){
	var commonList = this;
	
	//绑定复选框全选
	$("#total").click(function (event) {
		if (event.target.checked) {
			$(":checkbox[name=entityIds]").attr("checked", true);
		} else {
			$(":checkbox[name=entityIds]").attr("checked", false);
		}
	});
	
	//删除动作
	$(".deleteSelected").click(function (event) {
		if ($(":checkbox:checked").size() == 0) {
			alert("必须选择一条或多条记录！");
			event.preventDefault();
		} else {
			if (confirm("此操作不可恢复，您确定要继续吗？")) {
				event.preventDefault();
				commonList.form.attr("action", commonList.delUrl).submit();
			} else {
				event.preventDefault();
			}
		}
	});
	
	//绑定提交按钮
	commonList.form.bind("submit",function(){
		commonList.submitQueryForm();
		this.submit();
		return false;
	});
	
	//查询全部
	this.searchAll.click(function(event){
		commonList.form.get(0).reset();
		commonList.form.submit();
	});
	
	//切换页面显示条数时，提交表单
	commonList.pageSizeSelect.change(function (event) {
		commonList.form.submit();
	});
}