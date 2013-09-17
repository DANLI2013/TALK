/**
 * 邀请加入讨论组的系统通知
 * @param data
 * @param sysMsgNoticeSystem
 * @return
 */
function JoinDiscussionGroupInvitationNotice(data,sysMsgNoticeSystem){
	this.parent = sysMsgNoticeSystem;
	this.id = data.uid;
	this.data = data;
	this.type = "joinDiscussionGroupInvitation";
	this.container = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	this.title = $("<h5 class=\"orange\">"+data.title+"</h5>");
	this.content = $("<p>"+data.content+"</p>");
	this.formContainer = $("<ul class=\"layerForm\"></ul>");
	this.passingContainer = $("<li class=\"layerFormLi\">" +
			"<label class=\"layerFormLabel\">是否同意：</label>" +
			"<label class=\"layerFormLabel2\"><input type=\"radio\" name=\"passing\" value=\"1\" checked/>同意</label>" +
			"<label class=\"layerFormLabel2\"><input type=\"radio\" name=\"passing\" value=\"2\"/>拒绝</label>" +
			"</li>");
	this.btnContainer = $("<p class=\"leyear_butBox\"></p>");
	this.confirmBtn = $("<input class=\"button_black\" type=\"button\" value=\"确认\" />");
	
	this.build();
};

//继承自SysMsgNotice
JoinDiscussionGroupInvitationNotice.inherit(SysMsgNotice);

/**
 * 构建DOM树
 * @return
 */
JoinDiscussionGroupInvitationNotice.prototype.build = function(){
	this.parent.parent.talk.relationPlane.plane.append(this.container);
	this.container.append(this.title);
	this.container.append(this.content);
	this.container.append(this.formContainer);
	this.formContainer.append(this.passingContainer);
	this.container.append(this.btnContainer);
	this.btnContainer.append(this.confirmBtn);
	
	this.addListener();
};

/**
 * 添加事件
 * @return
 */
JoinDiscussionGroupInvitationNotice.prototype.addListener = function(){
	var joinDiscussionGroupInvitationNotice = this;
	
	//点击确定，销毁
	this.confirmBtn.bind("click",function(event){
		var discussionGroupId = joinDiscussionGroupInvitationNotice.data.discussionGroupId;
		var invitationId = joinDiscussionGroupInvitationNotice.data.invitationId;
		var passStr = joinDiscussionGroupInvitationNotice.passingContainer.find(":checked").val();
		var pass = false;
		if(passStr=="1"){
			pass = true;
		}
		var requestMsg = joinDiscussionGroupInvitationNotice.parent.parent.talk.request.joinDiscussionGroup(discussionGroupId,invitationId,pass);
		joinDiscussionGroupInvitationNotice.parent.parent.talk.sendRequest(requestMsg);
		joinDiscussionGroupInvitationNotice.destroy();
	});
};