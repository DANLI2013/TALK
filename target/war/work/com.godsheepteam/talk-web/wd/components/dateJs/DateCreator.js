
function DateCreator(){}

/**
 * 创建日期控件
 * @param elem
 * @param fmt
 * @return
 */
DateCreator.createDatePicker = function(elem, fmt) {
	elem.bind("focus", function(event) {
		var triggerObj = $(event.target);
		WdatePicker( {
			isShowClear : true,
			dateFmt : fmt,
			onpicked : function() {
				triggerObj.trigger("onpicked");
			}
		});
	});
}

/**
 * 创建全部页面日期控件
 */
DateCreator.createAll = function(){
	$(".date").each(function(i,dateInput){
		DateCreator.createDatePicker($(dateInput),"yyyy-MM-dd");
	});
}

$(function(){
	DateCreator.createAll();
});
