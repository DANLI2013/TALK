/**
 * Talk数据库操作工具
 * @return
 */
function MsgRecordTool(){
	this.db = window.openDatabase("talk", "1.0","talk消息记录库",500*1024*1024);
	this.createTable();
};

/**
 * 判断当前记录工具是否可用
 */
MsgRecordTool.useable = (typeof (window.openDatabase) == "function");

/**
 * 创建消息记录表
 * @return
 */
MsgRecordTool.prototype.createTable = function(){
	try{
		this.db.transaction(function(tx) {
			tx.executeSql("CREATE TABLE IF NOT EXISTS msgrecords (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, dialogId TEXT, senderName TEXT, message TEXT, msgDate TEXT, msgTime TEXT)");
		});
	}catch(e){
		//
	}
};

/**
 * 添加一条消息记录
 * @param dialogId 对应的对话框ID
 * @param chatMsgData
 * @return
 */
MsgRecordTool.prototype.addMsgRecord = function(dialogId,chatMsgData){
	try{
		this.db.transaction(function(tx) {
			tx.executeSql("INSERT INTO msgrecords (dialogId, senderName, message, msgDate, msgTime) values(?,?,?,?,?)", [dialogId, chatMsgData.senderName, chatMsgData.message,new Date().format("yyyy-MM-dd"),chatMsgData.time], null, null);
		});
	}catch(e){
		//
	}
};

/**
 * 清除所有记录
 * @param dialogId
 * @param chatMsgData
 * @return
 */
MsgRecordTool.prototype.clearMsgRecords = function(dialogId,chatMsgData){
	this.db.transaction(function(tx) {
		tx.executeSql("DELETE * FROM msgrecords");
	});
};

/**
 * 根据指定的日期显示消息记录
 * @param dialogId
 * @param date
 * @return 消息记录集合[dialogId,senderName,message,time]
 */
MsgRecordTool.prototype.getRecords = function(dialogId,date,dialog){
	var records = [];
	try{
		this.db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM msgrecords where dialogId=? and msgDate = ?", [dialogId,date],  
		 	function(tx, result) {
				 for(var i = 0; i < result.rows.length; i++){
					 records.push({dialogId:result.rows.item(i)['dialogId'],senderName:result.rows.item(i)['senderName'],message:result.rows.item(i)['message'],time:result.rows.item(i)['msgTime']});
				 }
				 dialog.appendDayRecords(records);
			}, function(){
				alert("获取聊天记录失败！");
			}); 
		});
	}catch(e){
		//
	}
	return records;
};